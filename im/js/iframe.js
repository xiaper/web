/**
 * 嵌入iframe
 */
(function () {

  var contentHtml = '<div style="position: fixed; bottom: 0px; right: 0px;">\n' +
      '<iframe id="byteDesk-im-iframe" width="1200px" height="600" src="chat.html" frameborder="0" scrolling="no"></iframe>\n' +
    '</div>';
  //
  var byteDesk = document.getElementById('byteDesk');
  byteDesk.insertAdjacentHTML('beforeend', contentHtml);

})();

