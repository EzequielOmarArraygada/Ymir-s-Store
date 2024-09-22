import User from '../dao/models/user.model.js';

export class UserRepository {
    constructor() {
        this.model = User;
    }

    async findById(id) {
        try {
            const user = await this.model.findById(id);
            if (!user) {
                return null; 
            }
            return user;
        } catch (error) {
            console.error(`Error al buscar usuario por ID ${id}:`, error);
            throw error; 
        }
    }

    async findByEmail(email) {
        try {
            const user = await this.model.findOne({ email });
            if (!user) {
                return null; 
            }
            return user;
        } catch (error) {
            console.error(`Error al buscar usuario por email '${email}':`, error);
            throw error; 
        }
    }

    async createOne(obj) {
        try {
            const user = await this.model.create(obj);
            return user;
        } catch (error) {
            console.error('Error al crear un usuario:', error);
            throw error; 
        }
    }

    async getAllUsers() {
        try {
            // Retornamos solo los campos necesarios
            return await this.model.find({}, 'first_name email role');
        } catch (error) {
            console.error('Error al obtener todos los usuarios:', error);
            throw error;
        }
    }

    async deleteInactiveUsers() {
        try {
            // Obtener la fecha límite para la inactividad
            const inactivityDate = new Date(Date.now() - 30 * 60 * 1000); 
            const users = await this.model.find({ last_connection: { $lt: inactivityDate } });

            if (users.length > 0) {
                // Enviar correos a los usuarios inactivos (puedes ajustar el método de envío de correo aquí)
                for (const user of users) {
                    // Lógica para enviar correo (esto es un pseudocódigo, ajusta con tu método de envío real)
                    console.log(`Enviando correo a ${user.email} para notificar la eliminación por inactividad.`);
                }

                // Eliminar usuarios inactivos
                await this.model.deleteMany({ _id: { $in: users.map(user => user._id) } });
            }

            return { status: 'success', message: 'Usuarios inactivos eliminados', count: users.length };
        } catch (error) {
            console.error('Error al eliminar usuarios inactivos:', error);
            throw error;
        }
    }
    
}
