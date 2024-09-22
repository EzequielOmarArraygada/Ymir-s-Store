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


}