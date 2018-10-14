/* jshint esversion: 6 */
require('./config/config');

const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const _ = require('lodash');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./controllers/db-connect');
const {Folder} = require('./models/folder');

const db = require('./controllers/db-actions');
const tree = require('./controllers/tree-actions');

const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {

  tree.fetchFolders().then((result) => {
    tree.sortFolders_recursive(_.sortBy(result, ['order']), [], 0, 0).then((result) => {
      console.log(`||||||| -------------------> ${result.length} items.`);
      // console.log(result);
      socket.emit('newTreeArray', result);
    });
  });

  socket.on('newItem', (data) => {
    console.log('newItem request received');
    data = _.pick(data, ['name', 'parentID', 'order']);

    db.newFolder(data).then((item) => {
      tree.fetchFolders().then((result) => {
        tree.sortFolders_recursive(_.sortBy(result, ['order']), [], 0, 0).then((result) => {
          console.log(`||||||| -------------------> ${result.length} items.`);
          // console.log(result);
          socket.emit('newTreeArray', result);
        });
      });
    }).catch((e) => {
      console.log(e);
    });
  });
});

server.listen(port, () => {
  console.log('Server running..');
});
