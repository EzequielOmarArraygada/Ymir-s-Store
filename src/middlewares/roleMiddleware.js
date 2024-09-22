import User from '../dao/models/user.model.js';

export const requirePremium = async (req, res, next) => {
    const userId = req.userId; 
    const user = await User.findById(userId);
    if (user.role !== 'premium') {
        return res.status(403).send('Acceso denegado: se requiere rol premium');
    }
    next();
};