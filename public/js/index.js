/* jshint esversion: 6 */
let socket = io();

socket.on('connect', () => {
  console.log('Connected to server');

});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

document.getElementById('add-item').addEventListener("click", () => {
  socket.emit('newItem', {
    name: document.getElementById('add-item--name').value,
    parentID: document.getElementById('add-item--parentID').value
  });
});

socket.on('parseItems', (item) => {
  let html = `<div class="item--container"><div><div class="item--name level--0">${item.name}</div><div class="item--ID level--0">${item._id}</div><div class="item--parentID level--0">${item.parentID}</div></div><div class="item--container--child" id="${item._id}"></div></div>`;

  let html2 = `<div class="item--container"><div><div class="item--name level--1">${item.name}</div><div class="item--ID level--1">${item._id}</div><div class="item--parentID level--1">${item.parentID}</div></div><div class="item--container--child" id="${item._id}"></div></div>`;

  if(!item.parentID){
    element = document.getElementById('container');
    element.insertAdjacentHTML('afterbegin', html);
  } else {
    element = document.getElementById(item.parentID);
    element.insertAdjacentHTML('afterbegin', html2);
  }

  // item.forEach((cur) => {
  //   element.insertAdjacentHTML('afterbegin', `<div class="">${cur}</div>`);
  // });
});
