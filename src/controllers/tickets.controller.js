import Ticket from '../dao/models/ticket.model.js';
import { TicketManagerMongo } from '../dao/services/managers/TicketManagerMongo.js'



export class TicketController {
    constructor(){
        this.ticketsService = new TicketManagerMongo();
    }


    getTickets = async (req, res) => {
        try {
            let result = await this.ticketsService.getTickets()
            res.send({ result: 'success', payload: result });
        } catch (error) {
            req.logger.error(
                `Error al recuperar tickets: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: 'Ocurrió un error al obtener los tickets'});
        }
    }

}