import messageModel from '../dao/models/message.model.js';


export default class MessageManager {

  async addMessage(userEmail, message) {
    try {
      return await messageModel.create({ user: userEmail, message: message });
    } catch (error) {
      console.log('Error al guardar el mensaje.');
    }
  }


  async getMessages() {
    try {
      return await messageModel.find();
    } catch (error) {
      console.log('Error al obtener los mensajes.');
    }
  }
}
