import { UserManagerMongo } from '../dao/services/managers/UserManagerMongo.js';
import { ProductManagerMongo } from '../dao/services/managers/ProductManagerMongo.js';
import jwt from 'jsonwebtoken';
import utils from '../utils.js';
import dotenv from 'dotenv';
import User from '../dao/models/user.model.js';
import path from 'path';
import { sendPasswordResetEmail } from '../services/mailing.js';
import bcrypt from 'bcrypt';
import { sendEmail } from '../services/mailing.js';


dotenv.config();

export class UserController {
    constructor() {
        this.usersService = new UserManagerMongo();
        this.productsService = new ProductManagerMongo()
    }

    postSignup = async (req, res) => {
        res.redirect('/login');
    }

    postSignupDash = async (req, res) => {
        res.redirect('/admin/users?success=true');
    };
    
    postLogin = async (req, res) => {
        const { email, password } = req.body;
        try {
            const normalizedEmail = email.toLowerCase(); // Convertimos el email a minúsculas
            let user = await this.usersService.findByEmail(normalizedEmail);
    
            if (!user) {
                req.logger.warn(`Intento de inicio de sesión con un usuario no existente: ${email}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
                req.logger.debug('Enviando respuesta de error: usuario no existe');
                return res.redirect('/login?error=Email no registrado');
            }
    
            req.session.clientId = user._id;
            req.session.role = user.role;
            req.logger.debug(`Usuario encontrado: ${user ? user.email : 'No encontrado'}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    
            const isValid = utils.isValidatePassword(user, password);
            req.logger.debug(`Verificación de contraseña: ${isValid ? 'exitosa' : 'fallida'}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    
            if (!isValid) {
                req.logger.warn(`Intento de inicio de sesión fallido para el usuario: ${email}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
                req.logger.debug('Redirigiendo a /faillogin');
                return res.redirect('/login?error=Contraseña incorrecta');
            }
    
            const tokenUser = {
                _id: user._id,
                email: user.email,
                first_name: user.first_name,
                role: user.role,
                cart: user.cart,
            };
            user.last_connection = new Date();
            await user.save();
            const token = jwt.sign(tokenUser, process.env.JWT_SECRET, { expiresIn: '1d' });
            req.logger.debug(`Token JWT generado exitosamente: ${token}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    
            res.cookie('coderCookieToken', token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true,
            });
    
            req.logger.debug('Redirigiendo a /');
            return res.redirect('/');
        } catch (error) {
            req.logger.error(`Error al procesar el inicio de sesión: ${error.message}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            req.logger.debug('Enviando respuesta de error del servidor');
            return res.status(500).send({ status: 'error', message: 'Error interno del servidor.' });
        }
    }


    getSignOut = async (req, res, next) => {
        try {
            req.logout((err) => {
                if (err) {
                    return next(err);
                }
                res.clearCookie('coderCookieToken').redirect('/login');
            });
        } catch (error) {
            console.error(`Error al cerrar sesión: ${error.message}`);
            res.status(500).send({ status: 'error', message: 'Error al cerrar sesión.' });
        }
    }

   
    uploadDocuments = async (req, res) => {
        try {
            const userId = req.params.uid;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
            }

            // Verifica si los archivos se han subido
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ status: 'error', message: 'No se han subido documentos' });
            }

            req.files.forEach(file => {
                let folder;
                if (file.originalname === 'profile.jpg') {
                    folder = 'profiles';
                } else if (file.originalname === 'product.jpg') {
                    folder = 'products';
                } else {
                    folder = 'documents';
                }

                const fullPath = `/uploads/${folder}/${file.originalname}`;

                // Verifica si el documento ya está agregado
                if (!user.documents.some(doc => doc.reference === fullPath)) {
                    user.documents.push({
                        name: file.originalname,
                        reference: fullPath
                    });
                }
            });

            // Guarda el usuario con los documentos actualizados
            await user.save();

            res.status(200).json({ status: 'success', message: 'Documentos subidos exitosamente' });
        } catch (error) {
            console.error('Error al subir documentos:', error);
            res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    }

    

    togglePremium = async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await this.usersService.findById(uid);
    
            if (!user) {
                return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
            }
    
            // Validar documentos antes de cambiar a premium
            const requiredDocsKeywords = ['Identificacion', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            const hasAllRequiredDocs = requiredDocsKeywords.every(keyword =>
                user.documents.some(doc => doc.name.includes(keyword))
            );
    
            if (!hasAllRequiredDocs && user.role !== 'premium') {
                return res.status(400).send({ status: 'error', message: 'Faltan documentos para cambiar a premium' });
            }
    
            user.role = user.role === 'premium' ? 'user' : 'premium';
            await user.save();
    
            res.send({ status: 'success', message: `El rol del usuario ha sido cambiado a ${user.role}` });
        } catch (error) {
            req.logger.error(
                `Error al cambiar el rol del usuario: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ status: 'error', message: 'Error interno del servidor.' });
        }
    }

    getAllUsers = async (req, res) => {
        try {
            const users = await this.usersService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            req.logger.error(`Error al obtener usuarios: ${error.message}`);
            res.status(500).send({ status: 'error', message: 'Error interno del servidor.' });
        }
    }

    getDashUsers = async (req, res) => {
        try {
            const result = await this.usersService.getAllUsers();
            const users = result.map(user => ({
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                email: user.email,
                age: user.age,
                last_connection: user.last_connection,
            }));
            res.render('adminUsers', { users });
        } catch (error) {
            req.logger.error(`Error al obtener los usuarios: ${error.message}`);
            res.status(500).send({ error: 'Ocurrió un error al obtener los usuarios.' });
        }
    }  

    deleteInactiveUsers = async (req, res) => {
        try {
            const result = await this.usersService.deleteInactiveUsers();
            res.status(200).json(result);
        } catch (error) {
            req.logger.error(`Error al eliminar usuarios inactivos: ${error.message}`);
            res.status(500).send({ status: 'error', message: 'Error interno del servidor.' });
        }
    }

    requestPasswordReset = async (req, res) => {
        const email  = req.user.email;
        try {
            const user = await this.usersService.findByEmail(email);
            if (!user) {
                return res.status(404).send('Usuario no encontrado');
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            sendPasswordResetEmail(user.email, token);
            res.send('Correo enviado');
        } catch (error) {
            res.status(500).send('Error interno del servidor');
        }
    }

    requestPasswordResetFromLogin = async (req, res) => {
        const { email } = req.body;
    
        if (!email) {
            return res.status(400).json({ message: 'El email es obligatorio' });
        }
    
        try {
            const user = await this.usersService.findByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
    
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
    
            await sendPasswordResetEmail(user.email, token);
    
            return res.status(200).json({ message: 'Correo enviado' });
        } catch (error) {
            console.error("Error en requestPasswordResetFromEmail:", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    };

    getPasswordReset = async (req, res) => {
        const { token } = req.query;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.render('resetPassword', { token });
        } catch (error) {
            res.status(400).send('El enlace ha expirado');
        }
    }

    postPasswordReset = async (req, res) => {
        const { token, newPassword } = req.body;
        try {
            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await this.usersService.findById(decoded.userId);
    
            if (!user) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }
    
            if (await user.isPasswordSame(newPassword)) {
                return res.status(400).json({ success: false, message: 'La nueva contraseña no puede ser igual a la anterior' });
            }
    
            user.password = await user.hashPassword(newPassword);
            await user.save();
            
            return res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            console.error(`Error al restablecer la contraseña: ${error.message}`);
            return res.status(400).json({ success: false, message: 'Error al restablecer la contraseña' });
        }
    }
    

    isAdmin = async (req, res, next) => {
        if (req.user.role === 'admin') {
          return next();
        }
        res.redirect('/login');
      }

    addUser = async (req, res, next) => {
        try {
            const { first_name, last_name, email, age, password, role } = req.body;
            const user = req.user; 

            if (user.role !== 'admin') {
                return res.status(403).send('Solo los usuarios admin pueden crear usuarios.');
            }

            const result = await this.usersService.createOne({
                first_name,
                last_name,
                email,
                age,
                password: utils.createHash(password),
                role
            });

            res.send({ result: 'success', payload: result });
        } catch (error) {
            req.logger.error(
                `Error al agregar el producto: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: 'Error interno del servidor.' });
        }
    }

     updateUser = async (req, res, next) => {
        try {
             const { uid } = req.params;
             const updatedData = req.body;
             const result = await this.usersService.updateUser(uid, updatedData);
             res.send({ result: 'success', payload: result });
         } catch (error) {
             req.logger.error(`Error al actualizar el usuario ${error.message}`);
             res.status(500).send({ error: 'Error al actualizar el usuario.' });
         }
     };
    

     deleteUser = async (req, res) => {
         try {
             const { uid } = req.params;
             const userDeleted = await this.usersService.findById(uid);
             const user = req.user; 

             if (!userDeleted) {
                 return res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
             }

             await this.usersService.deleteUser(uid);

             if (user && user.role === 'admin') {
                 await sendEmail({
                     to: user.email,
                     subject: 'Usuario eliminado',
                     text: `El usuario ${userDeleted._id} ha sido eliminado.`
                 });
                 req.logger.info(`Correo enviado a ${user.email} sobre la eliminación del producto ${uid}`);
             }

             res.send({ status: 'success', message: 'Producto eliminado exitosamente' });
         } catch (error) {
             req.logger.error(`Error al eliminar producto: ${error.message}, ${req.method} en ${req.url}`);
             res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
         }
     }

     getProfile = async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await this.usersService.findById(uid);
            res.render('userProfile', { user });
        } catch (error) {
            req.logger.error(`Error al obtener el usuario: ${error.message}`);
            res.status(500).send({ error: 'Ocurrió un error al obtener los usuarios.' });
        }
}
}
