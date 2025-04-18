import bcrypt from 'bcrypt';
import passport from 'passport';
import { ProductManagerMongo } from './dao/services/managers/ProductManagerMongo.js'; // Importa correctamente

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidatePassword = (user, password) => bcrypt.compareSync(password, user.password);
const productManager = new ProductManagerMongo();

const requirePremium = (req, res, next) => {
    // Permitir acceso si el rol es 'premium' o 'admin'
    if (req.session.role !== 'premium' && req.session.role !== 'admin') {
        req.logger.warning(`Acceso denegado: Solo usuarios premium o admin. ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
        return res.status(403).send('Acceso denegado: Solo usuarios premium o admin');
    }
    next();
};

const requireOwnershipOrAdmin = async (req, res, next) => {
    const { pid } = req.params;
    const user = req.user;

    try {
        const product = await productManager .getProduct(pid);

        if (!product) {
            req.logger.warning(`Producto no encontrado. ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            return res.status(404).send('Producto no encontrado');
        }

        if (product.owner.toString() !== user._id && user.role !== 'admin') {
            req.logger.warning(`Acceso denegado: No tienes permiso para esta acción. ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            return res.status(403).send('Acceso denegado: No tienes permiso para esta acción');
        }
        next();
    } catch (error) {
        req.logger.error(`Error al verificar el dueño del producto: ${error.message}. ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
        res.status(500).send('Error interno del servidor');
    }
};

const passportCall = (strategy, role) => {
    return (req, res, next) => {
        // Rutas públicas con acceso opcional al usuario autenticado
        const publicPaths = [
            { path: '/products', method: 'GET' },
            { path: '/about', method: 'GET' },
            { path: '/contactus', method: 'GET' },
            { path: '/faq', method: 'GET' },
            { path: '/gallery', method: 'GET' }
        ];

        const isPublicPath = publicPaths.some(p =>
            req.path.startsWith(p.path) && req.method === p.method
        );

        if (isPublicPath) {
            passport.authenticate(strategy, { session: false }, (err, user, info) => {
                if (err) return next(err);
                if (user) req.user = user;
                return next();
            })(req, res, next);
        } else {
            // Rutas protegidas
            passport.authenticate(strategy, function (err, user, info) {
                if (err) return next(err);
                if (!user) return res.redirect('/login');

                req.logger?.info(`Usuario autenticado: ${user.email}`);
                req.logger?.debug(`Rol de usuario: ${user.role}`);

                if (user.role !== role && user.role !== 'admin') {
                    req.logger?.warning(`Acceso denegado. Rol incorrecto: ${user.role}`);
                    return res.status(403).send({ error: `Acceso denegado. Rol de usuario incorrecto.` });
                }

                req.user = user;
                next();
            })(req, res, next);
        }
    };
};



export default { createHash, isValidatePassword, passportCall, requirePremium, requireOwnershipOrAdmin };
