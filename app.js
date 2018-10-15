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

  /** First connection; get folder structure and send to client **/
  tree.init().then((result) => {
    socket.emit('buildTreeStructure', result);
  })
  .catch((e) => console.log(e));

  /** Create a new folder; get updated folder structure and send to client **/
  socket.on('newFolder', (data) => {
    Promise.resolve(data)
      .then(data => {
        console.log(data, ['name', 'parentID']);
        return db.newFolder(_.pick(data, ['name', 'parentID']));
      })
      .then(data => {
        console.log(data);
        return tree.init();
      })
      .then(data => {
        socket.emit('buildTreeStructure', data);
      })
      .catch(e => console.log(e));
  });

  /** Delete a folder; get updated folder structure and send to client **/
  socket.on('deleteFolder', (data) => {
    Promise.resolve(data)
      .then(data => {
        return db.deleteFolder(_.pick(data, ['_id']));
      })
      .then(data => {
        console.log(data);
        return tree.init();
      })
      .then(data => {
        socket.emit('buildTreeStructure', data);
      })
      .catch(e => console.log(e));
  });

  /** Move a folder; get updated folder structure and send to client **/
  socket.on('moveFolder', (data) => {
    Promise.resolve(data)
      .then(data => {
        return db.moveFolder(_.pick(data, ['_id']), _.pick(data, ['direction']));
      })
      .then(data => {
        console.log(data);
        return tree.init();
      })
      .then(data => {
        socket.emit('buildTreeStructure', data);
      })
      .catch(e => console.log(e));
  });

});

server.listen(port, () => {
  console.log('Server running..');
});
