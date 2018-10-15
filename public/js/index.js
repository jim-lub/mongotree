/* jshint esversion: 6 */
let socket = io();

socket.on('connect', () => console.log('Connected to server'));
socket.on('disconnect', () => console.log('Disconnected from server'));

// build the tree structure
socket.on('buildTreeStructure', (array) => {
  $(document).ready(function(){
    $('#container').empty();

    array.forEach((cur) => {
      cur.order = cur.order || 99;
      cur.depth = cur.depth || 0;
      cur.hasChild = cur.hasChild || false;
      if (!cur.parentID) {
        $('#container').append(html.folderRow(cur));
      } else {
        $('#' + cur.parentID).children('.folder--children').append(html.folderRow(cur));
      }
    });
  });
});

// add a new folder event listener
$(document).ready(function(){
  $('#add-folder--button').click(function() { addFolder(); });

  $(document).keypress(function(e) { if(e.which === 13) { addFolder(); }});

  addFolder = () => {
    socket.emit('newFolder', {
      name: $('#add-folder--name').val(),
      parentID: $('#add-folder--parentID').val()
    });
  };
});

// open overlay
$(document).ready(function(){
  $('#container').on('click', '.overlay--button', function () {
    let _id = $(this).closest('.folder--container').attr('id');
    on();
  });
});

// set parentID value
$(document).ready(function(){
  $('#container').on('click', '.parent-folder--button', function () {
    let _id = $(this).closest('.folder--container').attr('id');
    $('#add-folder--parentID').val(_id);
  });
});

// delete folder event listener
$(document).ready(function(){
  $('#container').on('click', '.delete-folder--button', function () {
    socket.emit('deleteFolder', {
      _id: $(this).closest('.folder--container').attr('id')
    });
  });
});
