import mongoose from 'mongoose';

const messageCollection = 'messages';

const messageSchema = new mongoose.Schema({
    client_name: { type: String, required: true, max: 30},
    client_email: { type: String, required: true },
    message: { type: String, required: true },
    datetime: { type: Date, default: Date.now },
});


const messageModel = mongoose.model(messageCollection, messageSchema);

export default messageModel;