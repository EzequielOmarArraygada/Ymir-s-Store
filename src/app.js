import express from 'express';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import handlebars from 'express-handlebars';
import path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import initializePassport from './config/passport.config.js';
import utils from './utils.js';
import router from './routes/index.js';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import errorHandler from './middlewares/errors/index.js';
import { addLogger } from './utils/logger.js';
import swaggerConfig from './config/swagger.js';
import { engine } from 'express-handlebars';
import morgan from 'morgan'
import mercadopago from 'mercadopago';

dotenv.config();

const { passportCall } = utils;


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express();
const PORT = process.env.PORT || 8080

app.engine(
    'handlebars',
    engine({
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
      },
      helpers: {
        json: function (context) {
          return JSON.stringify(context);
        },
        ifEquals: function (arg1, arg2, options) {
          return arg1 === arg2 ? options.fn(this) : options.inverse(this);
        },
      },
    })
  );
  
app.use(addLogger)
app.set('views', __dirname + '/views') 
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static('uploads'));
app.use(morgan('dev'))

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

swaggerConfig(app);



app.use((err, req, res, next) => {
    req.logger.fatal(
        `Algo se rompió!, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
    )
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


const mongooseUrl = process.env.MONGO_URL;

app.use(session({
    store: MongoStore.create({
        mongoUrl: mongooseUrl,
        ttl: 60 * 60 
    }),
    secret: '12345679',
    resave: false,
    saveUninitialized: false
}));

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN
  });
  
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    if (req.url === '/favicon.ico') {
        res.status(204).end(); 
    } else {
        next();  
    }
});

app.get('/failregister', (req, res) => {
    req.logger.error(
        `Fallo en el registro!, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
    )
    res.status(400).send({ error: 'Fallo en el registro' })
});

app.use(router);

app.use((req, res, next) => {
    res.render('error404')
});


const httpServer = app.listen(PORT, () => {
    console.log (`Server is running on port ${PORT}`)
})

const io = new Server(httpServer);

const users = {}

io.on('connection', (socket)=>{
    
    socket.on('newUser', (username)=>{
        users[socket.id] = username
        io.emit('userConnected', username)
    })

    socket.on('disconnect', ()=>{
        const username = users[socket.id]
        delete users[socket.id]
        io.emit('userDisconnected', username)
    })
})

const environment = async () => {
    await mongoose.connect(mongooseUrl)
        .then (() => {
            console.log('Conectado a la base de datos')
        })
        .catch (error => {
            console.error('error al conectarse', error)
        })
}

app.use(errorHandler);

environment ();

export default app;

