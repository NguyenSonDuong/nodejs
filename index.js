import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import logger from 'morgan';
import http from 'http';
import { Server } from 'socket.io';

import {InitRouter} from './server/router/main.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

mongoose.connect('mongodb://localhost:27017/username', { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> {
  console.log('Database connected');
})
.catch((error)=> {
  console.log('Error connecting to database');
});

io.sockets.on('connection', (socket) => {
  console.log('a user connected');
});

// InitRouter(app);

app.listen(8080, () => {
  console.log('listening on *:8080');
});