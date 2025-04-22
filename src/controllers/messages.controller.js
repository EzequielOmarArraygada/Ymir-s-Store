import messageModel from '../dao/models/message.model.js'
import { MessageManagerMongo } from '../dao/services/managers/MessageManagerMongo.js'
import { UserManagerMongo } from '../dao/services/managers/UserManagerMongo.js'
import { sendEmail } from '../services/mailing.js'


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
                client_name: message.client_name,
                client_email: message.client_email,
                datetime: message.datetime,
                status: message.status,
                message: message.message
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
            status: "NoVisto",
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
            res.render('adminMessagesDetails', { message });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener los detalles del ticket');
        }
    };

    updateMessageStatus = async (req, res) => {
      try {
        const { mid, status } = req.body;
        const updatedMessage = await this.messageService.updateMessageStatus(mid, status);
  
        if (updatedMessage) {
          res.json({ success: true, message: 'Estado del ticket actualizado con éxito' });
        } else {
          res.status(404).json({ success: false, message: 'Ticket no encontrado' });
        }
      } catch (error) {
        console.error(`Error al actualizar el estado del ticket: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error al actualizar el estado del ticket' });
      }
    };

    sendReply = async (req, res) => {
      const { to, name, message } = req.body;
      try {
        await sendEmail({
          to,
          subject: `Respuesta a tu mensaje - Ymir`,
          html: `<p>Hola ${name},</p><p>${message}</p><p>Saludos cordiales,<br>Equipo de Ymir</p>`
        });
    
        res.json({ success: true });
      } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ success: false });
      }
    }

    }