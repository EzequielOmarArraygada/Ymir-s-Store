import Ticket from '../dao/models/ticket.model.js';

export class TicketRepository {
    constructor(){
        this.model = Ticket;
    }

    async getTickets(){
        try {
            return await this.model.find({});
        } catch (error) {
            console.error('Error al obtener todos los tickets', error);
            throw error;
        }
    }

    async getTicketById(tid){
        try {
            return await this.model.findById(tid).lean(); 
        } catch (error) {
            console.error(`Error al obtener el ticket con ID ${pid}:`, error);
            throw error;
        }
    }

}