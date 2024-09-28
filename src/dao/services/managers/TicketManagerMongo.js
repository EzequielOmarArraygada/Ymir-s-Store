import { TicketRepository } from '../../../repositories/ticket.repository.js';

export class TicketManagerMongo {
    constructor() {
        this.ticketRepository = new TicketRepository();
    }

    async getTickets() {
        try {
            return await this.ticketRepository.getTickets();
        } catch (error) {
            logger.error(`Error al mostrar los tickets: ${error.message}`, { error });
            throw new Error('No se pudieron obtener los tickets. Por favor, inténtelo de nuevo más tarde.');
        }
    }

    async getTicket(tid){
        return await this.ticketRepository.getTicketById(tid);
    }

    async updateTicketStatus(id, status) {
        try {
          const updatedTicket = await this.ticketRepository.updateTicketStatus(id, status);
          if (!updatedTicket) {
            throw new Error('No se pudo actualizar el estado del ticket');
          }
          return updatedTicket;
        } catch (error) {
          throw new Error(`Error al actualizar el estado del ticket: ${error.message}`);
        }
      }

}