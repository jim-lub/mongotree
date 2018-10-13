/* jshint esversion: 6 */
let socket = io();

function on() {
    document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
}

document.getElementById('overlayTest').addEventListener("click", () => {
    on();
});
document.getElementById('overlay').addEventListener("click", () => {
    off();
});

let html_item = (_id, parentID, name, order, depth) => {
  return `<div class="item--row"><div class="item--icon"><img src="/images/folder2.png"/></div><div class="item--name">${name}</div><div class="item--info info1">${depth}</div><div class="item--info info3">${parentID}</div><div class="item--info info2">${order}</div><div class="item--info info4">${_id}</div></div><div class="item--container--child" id="${_id}"></div>`;
};

let html_itemSub = (_id, parentID, name, order, depth) => {
  return `<div class="item--row"><div class="item--icon"><img src="/images/nextrow.png"/></div><div class="item--icon"><img src="/images/folder2.png"/></div><div class="item--name">${name}</div><div class="item--info info1">${depth}</div><div class="item--info info3">${parentID}</div><div class="item--info info2">${order}</div><div class="item--info info4">${_id}</div></div><div class="item--container--child" id="${_id}"></div>`;
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
    parentID: document.getElementById('add-item--parentID').value,
    order: document.getElementById('add-item--order').value
  });
});

socket.on('newTreeArray', (array) => {

  array.forEach((cur) => {
    if (!cur.parentID) {
      element = document.getElementById('container');
      element.insertAdjacentHTML('beforeend', html_item(cur._id, cur.parentID, cur.name, cur.order, cur.depth));
    } else {
      element = document.getElementById(cur.parentID);
      element.insertAdjacentHTML('beforeend', html_itemSub(cur._id, cur.parentID, cur.name, cur.order, cur.depth));
    }
  });

});

socket.on('parseItems', (item) => {

  let html = html_item(item._id, item.parentID, item.name, 0, 0);
  let html2 = html_itemSub(item._id, item.parentID, item.name, 0, 0);

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


/*

document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

deleteListItem: function(selectorID) {
  var el = document.getElementById(selectorID);
  el.parentNode.removeChild(el);
},


*/
