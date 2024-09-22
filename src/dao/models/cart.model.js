import mongoose from 'mongoose';

const cartCollection = 'carts';

const productSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, integer: true }
});


const cartSchema = new mongoose.Schema({ 
    products: [productSchema]
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;