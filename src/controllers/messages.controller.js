import messageModel from '../dao/models/message.model.js'
import { MessageManagerMongo } from '../dao/services/managers/MessageManagerMongo.js'
import { UserManagerMongo } from '../dao/services/managers/UserManagerMongo.js'


export class MessageController {
    constructor(){
        this.messageService = new MessageManagerMongo();
        this.userService = new UserManagerMongo(); 
    }

    getViewMessage = async (req, res) => {
      try{
        let cartId = null;
            if (req.isAuthenticated()) {
                const user = req.user;
                cartId = user.cart ? user.cart : null;
            }
        res.render('contactUs', { user: req.user, cartId });
      } catch (error) {
      res.status(500).send({ error: 'Ocurrió un error.' });
  }
    }

    getMessages = async (req, res) => {
        try {
            const result = await this.messageService.getMessages();
            const messages = result.map(message => ({
                _id: message._id,
                clien_name: message.client_name,
                client_email: message.client_email,
            }));
            res.render('adminMessages', { messages });

        } catch (error) {
            req.logger.error(`Error al obtener los mensajes: ${error.message}`);
            res.status(500).send({ error: 'Ocurrió un error al obtener los tickets.' });
        }
    }  

    postMessage = async (req, res) => {
        try {
          const { nombre, email, mensaje } = req.body;
      
          if (!nombre || !email || !mensaje) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
          }
      
          const nuevoMensaje = new messageModel({
            client_name: nombre,
            client_email: email,
            message: mensaje,
          });
      
          await nuevoMensaje.save();
      
          res.status(200).json({ message: 'Mensaje guardado correctamente' });
        } catch (error) {
          console.error('Error al guardar el mensaje:', error);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      };

    getMessageDetails = async (req, res) => {
        try {
            let { mid } = req.params;
            let message = await this.messageService.getMessage(mid);
            res.render('adminTicketsDetails', { message });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener los detalles del ticket');
        }
    };

    

    }