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

  let newArray = [
    {name: 'item 1.1.1.2', id: 1112, parent: 111, order: 2},
    {name: 'item 1', id: 1, parent: 0, order: 1},
    {name: 'item 2', id: 2, parent: 0, order: 2},
    {name: 'item 3', id: 3, parent: 0, order: 3},
    {name: 'item 4', id: 4, parent: 0, order: 4},
    {name: 'item 1.1', id: 11, parent: 1, order: 1},
    {name: 'item 1.2', id: 12, parent: 1, order: 2},
    {name: 'item 3.1', id: 31, parent: 3, order: 1},
    {name: 'item 3.2', id: 32, parent: 3, order: 2},
    {name: 'item 1.1.1', id: 111, parent: 11, order: 1},
    {name: 'item 1.1.2', id: 112, parent: 11, order: 2},
    {name: 'item 1.1.1.1', id: 1111, parent: 111, order: 1}
  ];

  actions.buildTreeArray().then((result) => {
    actions.recursive(_.sortBy(result, ['order']), 0, []).then((result) => {
      console.log(`||||||| -------------------> ${result.length} items.`);
      socket.emit('newTreeArray', result);
    });
  });

  socket.on('newItem', (data) => {
    data = _.pick(data, ['name', 'parentID']);

    actions.newItem(data).then((item) => {
      console.log(item);
      socket.emit('parseItems', {
        _id: item._id,
        parentID: item.parentID,
        name: item.name,
        order: item.order
      });
    }).catch((e) => {
      console.log(e);
    });
  });
});

server.listen(port, () => {
  console.log('Server running..');
});
