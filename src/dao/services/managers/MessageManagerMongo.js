import { MessageRepository } from '../../../repositories/message.repository.js';

export class MessageManagerMongo {
    constructor() {
        this.messageRepository = new MessageRepository();
    }

    async getMessages() {
        try {
            return await this.messageRepository.getMessages();
        } catch (error) {
            logger.error(`Error al mostrar los mensajes: ${error.message}`, { error });
            throw new Error('No se pudieron obtener los mensajes. Por favor, inténtelo de nuevo más tarde.');
        }
    }

    async getMessage(mid){
        return await this.messageRepository.getTicketById(mid);
    }

    async updateMessageStatus(id, status) {
        try {
          const updatedMessage = await this.messageRepository.updateMessageStatus(id, status);
          if (!updatedMessage) {
            throw new Error('No se pudo actualizar el estado del ticket');
          }
          return updatedMessage;
        } catch (error) {
          throw new Error(`Error al actualizar el estado del ticket: ${error.message}`);
        }
      }

}