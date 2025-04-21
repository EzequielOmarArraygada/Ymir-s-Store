import mongoose from 'mongoose';

const messageCollection = 'messages';

const messageSchema = new mongoose.Schema({
    client_name: { type: String, required: true, max: 30},
    client_email: { type: String, required: true },
    message: { type: String, required: true },
    datetime: { type: Date, default: Date.now },
    status: { 
        type: String,
        enum: ['NoVisto', 'Contestado', 'EnEspera', 'Visto', 'Spam'],
        default: 'NoVisto',
      },
});


const messageModel = mongoose.model(messageCollection, messageSchema);

export default messageModel;