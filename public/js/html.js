/* jshint esversion: 6 */
let html = (function() {
  return {
    folderRow: function(data) {
      let h, c;

      if (!data.hasChild) {
        c = `<div class="folder--depthVisual_2">`;
          c += `<div class="infinity depth${data.depth}b"></div>`;
        c += `</div>`;
      } else {
        c = `<div class="folder--show-hide-toggle"><img src="./images/hidefolder.png"/></div>`;
      }

      h = `<div class="folder--container">`;
        h += `<div class="folder--row depth${data.depth}b">`;
        h += `<div class="folder--row-left">`;
          h += `<div class="folder--depthVisual_1 depth${data.depth}"></div>`;
          h += c;
          h += `<div class="folder--name">/${data.name}</div>`;
        h += `</div>`;
      h += `<div class="folder--row-right">`;
          h += `<div class="folder--info info1">${data.depth}</div>`;
          h += `<div class="folder--info info2">${data.order}</div>`;
          h  += `<div class="folder--info info3">${data._id}</div>`;
          h += `<div class="folder--info info4">0</div>`;
        h += `</div>`;
      h += `</div>`;
      h += `<div class="folder--children depth${data.depth}b" id="${data._id}">`;
      h += `</div>`;
      h += `</div>`;

      return h;
    }
  };
})();
