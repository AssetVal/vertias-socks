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
app.use(cors({
  origin: '*',
}));

const server = require('http').createServer(app.callback());
const {Server} = require('socket.io');
const io = new Server(server);

const routing = require('./routes/routeHandler.js');
const {port, mongo} = require('./utils/port.js');
mongoose.connect(mongo.uri, mongo.config).catch(err => console.error); // Create Database Connection
routing(app); // Start Routes

server.listen(port, () => { console.log(`Server is now running on http://${ip.address()}:${port}`); }); // Start the server
let usersOnline = [];
io.on('connection', (socket) => {
  socket.emit('OnlineService', {AuthCheckIsOnline: true});
  socket.on('isOnline', (data) => {
    console.log('Recieved =>', data);
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
