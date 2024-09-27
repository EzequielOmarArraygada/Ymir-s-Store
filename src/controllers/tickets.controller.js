import Ticket from '../dao/models/ticket.model.js';
import { TicketManagerMongo } from '../dao/services/managers/TicketManagerMongo.js'



export class TicketController {
    constructor(){
        this.ticketsService = new TicketManagerMongo();
    }

    getTickets = async (req, res) => {
        try {
            const result = await this.ticketsService.getTickets();
            const tickets = result.map(ticket => ({
                _id: ticket._id,
                code: ticket.code,
                purchaser: ticket.purchaser.email,
                products: ticket.products,
                totalAmount: ticket.totalAmount,
                purchase_datetime: ticket.purchase_datetime,
            }));
            res.render('adminTickets', { tickets });

        } catch (error) {
            req.logger.error(`Error al obtener los tickets: ${error.message}`);
            res.status(500).send({ error: 'Ocurrió un error al obtener los tickets.' });
        }
    }  

    getTicketDetails = async (req, res) => {
        try {
            let { tid } = req.params;
            let ticket = await this.ticketsService.getTicket(tid);
            res.render('adminTicketsDetails', { ticket });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener los detalles del ticket');
        }
    };

} 

