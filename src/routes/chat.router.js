import { Router } from 'express';
import { ChatManagerMongo } from '../dao/services/managers/ChatManagerMongo.js';
import utils from '../utils.js';

const { passportCall } = utils;

const chatRouter = Router()
const chatMM = new ChatManagerMongo()

chatRouter.get('/', passportCall('login', 'user'), (req, res) => {
    if (req.isAuthenticated()) {
        res.render('index.handlebars');
    } else {

        res.redirect('/login');
    }
});

chatRouter.post('/', async (req, res) => {
    const { username, message } = req.body; 
    try {
        const result = await chatMM.addChat(username, message); 
        res.json({ result: 'success', payload: result }); 
    } catch (error) {
        console.error(
            'Error al guardar el mensaje.', error
        )
        
    }
});


export { chatRouter, chatMM };