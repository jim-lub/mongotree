/* jshint esversion: 6 */
require('./config/config');

const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const _ = require('lodash');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./controllers/db');
const {Item} = require('./models/item');

const actions = require('./controllers/actions');

const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {

  actions.buildTreeArray().then((result) => {
    console.log('------------------------->');
    console.log(result);
    console.log(`-------------------------> Array generated. ${result.length} entries.`);
    socket.emit('newTreeArray', result);
    // actions.sortTreeArray(result).then((result) => {
    //   console.log('|||||||------------------------->');
    //   console.log(result);
    //   console.log(`|||||||-------------------------> Array sorted. ${result.length} entries.`);
    //   socket.emit('newTreeArray', result);
    // });
  });

  socket.on('newItem', (data) => {
    data = _.pick(data, ['name', 'parentID']);

    actions.newItem(data).then((item) => {
      console.log(item);
      socket.emit('parseItems', {
        _id: item._id,
        parentID: item.parentID,
        name: item.name,
        order: 99
      });
    }).catch((e) => {
      console.log(e);
    });
  });
});

server.listen(port, () => {
  console.log('Server running..');
});
