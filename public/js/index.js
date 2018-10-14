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
  return `<div class="item--row"><div class="folder--depthVisual_1 depth${depth}"></div><div class="item--name">${name}</div><div class="item--info info1">${depth}</div><div class="item--info info3">${parentID}</div><div class="item--info info2">${order}</div><div class="item--info info4">${_id}</div></div><div class="item--container--child" id="${_id}"></div>`;
};

let html_itemSub = (_id, parentID, name, order, depth) => {
  return `<div class="item--row"><div class="folder--depthVisual_1 depth${depth}"></div><div class="item--name">${name}</div><div class="item--info info1">${depth}</div><div class="item--info info3">${parentID}</div><div class="item--info info2">${order}</div><div class="item--info info4">${_id}</div></div><div class="item--container--child" id="${_id}"></div>`;
};

let html_row = (_id, parentID, name, order, depth, hasChild) => {
  let html, showHide;

  if (!hasChild) {
    showHide = `<div class="folder--depthVisual_2">`;
      showHide += `<div class="infinity depth${depth}b"></div>`;
    showHide += `</div>`;
  } else {
    showHide = `<div class="folder--show-hide-toggle"><img src="./images/hidefolder.png"/></div>`;
  }

  html = `<div class="folder--container">`;
  html += `<div class="folder--row depth${depth}b">`;
    html += `<div class="folder--row-left">`;
      html += `<div class="folder--depthVisual_1 depth${depth}"></div>`;
      // html += `<div class="folder--depthVisual_2">`;
        // html += `<div class="infinity depth${depth}b"></div>`;
      // html += `</div>`;
      // html += `<div class="folder--show-hide-toggle"><img src="./images/hidefolder.png"/></div>`;
      html += showHide;
      html += `<div class="folder--name">/${name}</div>`;
    html += `</div>`;
    html += `<div class="folder--row-right">`;
      html += `<div class="folder--info info1">${depth}</div>`;
      html += `<div class="folder--info info2">${order}</div>`;
      html += `<div class="folder--info info3">${_id}</div>`;
      html += `<div class="folder--info info4">0</div>`;
    html += `</div>`;
  html += `</div>`;
  html += `<div class="folder--children depth${depth}b" id="${_id}">`;
  html += `</div>`;
  html += `</div>`;

  return html;
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
  document.getElementById('container').innerHTML = "";
  array.forEach((cur) => {
    if(!cur.order){cur.order = 99;}
    if(!cur.depth){cur.depth = 0;}
    if(!cur.hasChild){cur.hasChild = false;}
    if (!cur.parentID) {
      element = document.getElementById('container');
      element.insertAdjacentHTML('beforeend', html_row(cur._id, cur.parentID, cur.name, cur.order, cur.depth, cur.hasChild));
    } else {
      element = document.getElementById(cur.parentID);
      element.insertAdjacentHTML('beforeend', html_row(cur._id, cur.parentID, cur.name, cur.order, cur.depth, cur.hasChild));
    }
  });

});

socket.on('parseItems', (cur) => {
  if(!cur.order){cur.order = 99;}
  if(!cur.depth){cur.depth = 0;}
  if(!cur.hasChild){cur.hasChild = false;}

  if (!cur.parentID) {
    element = document.getElementById('container');
    element.insertAdjacentHTML('beforeend', html_row(cur._id, cur.parentID, cur.name, cur.order, cur.depth, cur.hasChild));
  } else {
    element = document.getElementById(cur.parentID);
    element.insertAdjacentHTML('beforeend', html_row(cur._id, cur.parentID, cur.name, cur.order, cur.depth, cur.hasChild));
  }

});


/*

document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

deleteListItem: function(selectorID) {
  var el = document.getElementById(selectorID);
  el.parentNode.removeChild(el);
},


*/
