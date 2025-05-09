import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    subtotal: { type: Number }, 
    title: { type: String },
    description: { type: String },
    code: { type: String },
    price: { type: Number },
    status: { type: Boolean, default: true },
    stock: { type: Number },
    category: { type: String },
    thumbnail: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

const ticketSchema = new mongoose.Schema({
    code: { type: String },
    purchase_datetime: { type: Date, default: Date.now },
    purchaser: { type: Object },
    products: [productSchema],
    totalAmount: { type: Number },
    status: { 
        type: String,
        enum: ['Pendiente', 'Aprobado', 'Preparando', 'Completado', 'Cancelado'],
        default: 'Pendiente',
      },
      paymentInf: {
        method: { type: String }, 
        paymentDate: { type: Date }, 
        card: {
          lastFourDigits: { type: String },
          installments: { type: Number },
          issuerName: { type: String },
        }
      },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;




