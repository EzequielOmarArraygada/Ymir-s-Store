import messageModel from '../dao/models/message.model.js'

export class MessageRepository {
    constructor(){
        this.model = messageModel;
    }

    async getMessages(){
        try {
            return await this.model.find({});
        } catch (error) {
            console.error('Error al obtener todos los mensajes', error);
            throw error;
        }
    }

    async getTicketById(mid){
        try {
            return await this.model.findById(mid).lean(); 
        } catch (error) {
            console.error(`Error al obtener el ticket con ID ${mid}:`, error);
            throw error;
        }
    }

}