/* jshint esversion: 6 */
let socket = io();

socket.on('connect', () => console.log('Connected to server'));
socket.on('disconnect', () => console.log('Disconnected from server'));

// build the tree structure
socket.on('buildTreeStructure', (array) => {
  $(document).ready(function(){
    $('#container').empty();

    array.forEach((cur) => {
      if(!cur.order){cur.order = 99;}
      if(!cur.depth){cur.depth = 0;}
      if(!cur.hasChild){cur.hasChild = false;}
      if (!cur.parentID) {
        $('#container').append(html.folderRow(cur));
      } else {
        $('#' + cur.parentID).append(html.folderRow(cur));
      }
    });
  });
});

// add a new folder event listener
$(document).ready(function(){
  $('#add-folder--button').click(function() {
    socket.emit('newFolder', {
      name: $('#add-folder--name').val(),
      parentID: $('#add-folder--parentID').val()
    });
  });
});


// function on() {
//   document.getElementById("overlay").style.display = "block";
// }
//
// function off() {
//   document.getElementById("overlay").style.display = "none";
// }
//
// document.getElementById('overlayTest').addEventListener("click", () => {
//   on();
// });
// document.getElementById('overlay').addEventListener("click", () => {
//   off();
// });

/*

document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

deleteListItem: function(selectorID) {
  var el = document.getElementById(selectorID);
  el.parentNode.removeChild(el);
},


*/
