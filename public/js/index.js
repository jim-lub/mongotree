/* jshint esversion: 6 */
let socket = io();

let html_item = (_id, parentID, name) => {
  return `<div class="item--container"><div><div class="item--name level--0">${name}</div><div class="item--ID level--0">${_id}</div><div class="item--parentID level--0">${parentID}</div></div><div class="item--container--child" id="${_id}"></div></div>`;
};

let html_itemSub = (_id, parentID, name) => {
  return `<div class="item--container"><div><div class="item--name level--1">${name}</div><div class="item--ID level--1">${_id}</div><div class="item--parentID level--1">${parentID}</div></div><div class="item--container--child" id="${_id}"></div></div>`;
};

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

socket.on('newTreeArray', (array) => {

  array.forEach((cur) => {
    if (!cur.parent) {
      element = document.getElementById('container');
      element.insertAdjacentHTML('beforeend', html_item(cur.id, cur.parent, cur.name));
    } else {
      element = document.getElementById(cur.parent);
      element.insertAdjacentHTML('beforeend', html_itemSub(cur.id, cur.parent, cur.name));
    }
  });

});

socket.on('parseItems', (item) => {

  let html = html_item(item._id, item.parentID, item.name);
  let html2 = html_itemSub(item._id, item.parentID, item.name);

  if(!item.parentID){
    element = document.getElementById('container');
    element.insertAdjacentHTML('beforeend', html);
  } else {
    element = document.getElementById(item.parentID);
    element.insertAdjacentHTML('beforeend', html2);
  }


  // item.forEach((cur) => {
  //   element.insertAdjacentHTML('afterbegin', `<div class="">${cur}</div>`);
  // });
});
