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

    async updateTicketStatus(tid, status) {
        try {
          return await Ticket.findByIdAndUpdate(
            tid,
            { status },
            { new: true } // Retorna el ticket actualizado
          );
        } catch (error) {
          throw new Error(`Error al actualizar el estado del ticket: ${error.message}`);
        }
      }

}