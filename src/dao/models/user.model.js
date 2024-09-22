import mongoose from 'mongoose';
import { CartManagerMongo } from '../services/managers/CartManagerMongo.js';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role: { type: String, enum: ['user', 'premium','admin'], default: 'user' },
    documents: [{
        name: String,
        reference: String
    }],
    last_connection:{ type: Date, }
});

userSchema.post('save', async function (doc, next) {
    try {

        if (doc.role === 'user' && !doc.cart) {
            const cartManager = new CartManagerMongo();
            const newCart = await cartManager.addCart();
            doc.cart = newCart._id;
            await doc.save();
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isPasswordSame = async function(newPassword) {
    return await bcrypt.compare(newPassword, this.password);
}

userSchema.methods.hashPassword = async function(newPassword) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(newPassword, salt);
}


const User = mongoose.model('User', userSchema);

export default User;

