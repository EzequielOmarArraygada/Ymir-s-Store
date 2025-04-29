import Ticket from '../dao/models/ticket.model.js';
import { TicketManagerMongo } from '../dao/services/managers/TicketManagerMongo.js'
import { UserManagerMongo } from '../dao/services/managers/UserManagerMongo.js';
import {formatDate} from '../utils/utils.js'
import { sendCompraCancelada } from '../services/mailing.js'


export class TicketController {
    constructor(){
        this.ticketsService = new TicketManagerMongo();
        this.usersService = new UserManagerMongo();
    }

    getTickets = async (req, res) => {
        try {
            const result = await this.ticketsService.getTickets();
            const tickets = result.map(ticket => ({
                _id: ticket._id,
                code: ticket.code,
                purchaser: ticket.purchaser.email,
                status: ticket.status,
                products: ticket.products,
                totalAmount: ticket.totalAmount,
                purchase_datetime: formatDate(ticket.purchase_datetime),
                paymentInf: ticket.paymentInf, 
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

    updateStatus = async (req, res) => {
        try {
          const { tid, status } = req.body;
          const updatedTicket = await this.ticketsService.updateTicketStatus(tid, status);
    
          if (updatedTicket) {
            res.json({ success: true, message: 'Estado del ticket actualizado con éxito' });
          } else {
            res.status(404).json({ success: false, message: 'Ticket no encontrado' });
          }
        } catch (error) {
          console.error(`Error al actualizar el estado del ticket: ${error.message}`);
          res.status(500).json({ success: false, message: 'Error al actualizar el estado del ticket' });
        }
      };

      cancelarTicketsVencidos = async () => {
        const hace72Horas = new Date(Date.now() - 1 * 60 * 60 * 1000);
    
        const ticketsVencidos = await Ticket.find({
            status: "Pendiente",
            purchase_datetime: { $lt: hace72Horas }
        });
    
        for (const ticket of ticketsVencidos) {
            ticket.status = "Cancelado";
            await ticket.save();
    
            const user = await this.usersService.findById(ticket.purchaser);
            await sendCompraCancelada(user.email, ticket);
        }
    
        console.log(`${ticketsVencidos.length} ticket(s) cancelado(s) por estar vencidos.`);
    };


} 

