import chatModel from '../../models/chat.model.js';
import logger from '../../../config/logger.js'; 

export class ChatManagerMongo {
    constructor() {
        this.model = chatModel;
    }

    async addChat(username, message) {
        try {
            const chat = await this.model.findOne({});
            if (chat) {
                chat.messages.push({ username, message });
                await chat.save();
                return chat;
            } else {
                return await this.model.create({ messages: [{ username, message }] });
            }
        } catch (error) {
            logger.error(`Error al añadir mensaje al chat: ${error.message}`, { username, message, error });
            throw new Error('No se pudo añadir el mensaje al chat. Por favor, inténtelo de nuevo más tarde.');
        }
    }
}
