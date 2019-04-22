/**
 * 嵌入iframe
 */
(function () {
  //  
  localStorage.iframe = "1";
  //
  localStorage.adminUid = window.adminUid;
  localStorage.workGroupWid = window.workGroupWid;
  localStorage.subDomain = window.subDomain;
  localStorage.type = window.type;
  localStorage.agentUid = window.agentUid;
  //
  var contentHtml = '<div style="position: fixed; bottom: 0px; right: 10px;">\n' +
      '<iframe id="byteDesk-kefu-iframe" width="300" height="500" src="/webchat/kefu/chatvue.html" frameborder="0" scrolling="no"></iframe>\n' +
    '</div>';
  //
  var byteDesk = document.getElementById('byteDesk');
  byteDesk.insertAdjacentHTML('beforeend', contentHtml);

})();
