import mongoose from 'mongoose';

const chatCollection = 'chats';

const messageSchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
    messages: [messageSchema] 
});

const chatModel = mongoose.model(chatCollection, chatSchema);

export default chatModel;