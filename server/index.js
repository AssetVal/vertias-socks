const Koa = require('koa'),
  koaBody = require('koa-body'),
  logger = require('koa-logger'),
  mongoose = require('mongoose'),
  helmet = require('koa-helmet'),
  ip = require('ip'),
  cors = require('@koa/cors'),
  routing = require('./routes/routeHandler.js'),
  {port, mongo} = require('./utils/port.js');
mongoose.connect(mongo.uri, mongo.config).catch(err => console.error); // Create Database Connection

const app = new Koa(); // Create Koa Server

app.use(logger());
app.use(koaBody());
app.use(helmet()); // Invoke Middleware
app.use(cors());

routing(app); // Start Routes

const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
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
    socket.emit('Online', {users: usersOnline, raw: data});
    socket.on('disconnect', () => {
      console.log(`${data.user} disconnected`);
      usersOnline = usersOnline.filter(obj => obj.user !== data.user);
    });
  });
});

module.exports = app;
