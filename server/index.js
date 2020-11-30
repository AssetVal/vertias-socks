const Koa = require('koa');
const koaBody = require('koa-body');
const logger = require('koa-logger');
const mongoose = require('mongoose');
const helmet = require('koa-helmet');
const ip = require('ip');
const cors = require('@koa/cors');

const app = new Koa(); // Create Koa Server

app.use(logger());
app.use(koaBody());
app.use(cors());
app.use(helmet());

const server = require('http').createServer(app.callback());
const {Server} = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: [
      'https://www.assetval.club', // Staging server
      'http://192.168.56.1:5000',  // Antonio Home
      'http://192.168.245.108:5000/' // Antonio Work
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['assetcat-the-wondercat'],
    credentials: true,
  },
});

const routing = require('./routes/routeHandler.js');
const {port, mongo} = require('./utils/port.js');
mongoose.connect(mongo.uri, mongo.config).catch(err => console.error); // Create Database Connection
routing(app); // Start Routes

server.listen(port, () => { console.log(`Server is now running on http://${ip.address()}:${port}`); }); // Start the server
let usersOnline = [];
io.on('connection', (socket) => {
  socket.emit('OnlineService', {AuthCheckIsOnline: true});
  socket.on('isOnline', (data) => {
    console.log('Received =>', data);
    if (usersOnline.filter(obj => obj.user === data.user).length > 0){
      usersOnline = usersOnline.filter(obj => obj.user !== data.user);
      usersOnline.push(data);
    } else {
      usersOnline.push(data);
    }
    socket.emit('Online', usersOnline);
    socket.on('disconnect', () => {
      console.log(`${data.user} disconnected`);
      usersOnline = usersOnline.filter(obj => obj.user !== data.user);
    });
  });
});

module.exports = app;
