/**
 * html js
 * @version 1.1.1
 * @author www.bytedesk.com
 * @date 2018/10/18
 */
(function () {
  //
  var contentHtml = 
  '<div id="byteDesk-app-wrapper" style="display: none">' +
    '<div id="byteDesk-app">' +
      '<div id="byteDesk-title">' +
        '<div id="byteDesk-name">' +
          '<div style="height: 100%;">' +
            '<img id="byteDesk-agent-avatar" src="/assets/img/default_avatar.png" width="40px" height="40px"/>' +
            '<div style="margin-left: 60px;">' +
              '<div id="byteDesk-agent-nickname">' + 
                '昵称' +
              '</div>' +
              '<div id="byteDesk-agent-description">' + 
                '描述' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' + // byteDesk-name
        '<div id="byteDesk-close">' + 
          '<span style="cursor: pointer;"><i class="iconfont icon-close"></i></span>' +
        '</div>' + 
        '<div id="byteDesk-max">' + 
          '<span style="cursor: pointer;"><i class="iconfont icon-max"></i></span>' +
        '</div>' + 
      '</div>' + // byteDesk-title
      '<div id="byteDesk-main">' +
        '<div id="byteDesk-message-pc">' +
          '<ul id="byteDesk-message-ul" class="byteDesk-message-ul">' +
          '</ul>' + 
        '</div>' + // byteDesk-message-pc
        '<div id="byteDesk-input-pc">' + 
          '<div id="byteDesk-input-emoji-box" style="display: none;">' +
            '<li><img src="/assets/img/emoji/100.gif" onclick="bd_kfe_utils.emotionClicked(\'[微笑]\')"></li>' +
            '<li><img src="/assets/img/emoji/101.gif" onclick="bd_kfe_utils.emotionClicked(\'[撇嘴]\')"></li>' +
            '<li><img src="/assets/img/emoji/102.gif" onclick="bd_kfe_utils.emotionClicked(\'[色]\')"></li>' +
            '<li><img src="/assets/img/emoji/103.gif" onclick="bd_kfe_utils.emotionClicked(\'[发呆]\')"></li>' +
            '<li><img src="/assets/img/emoji/104.gif" onclick="bd_kfe_utils.emotionClicked(\'[得意]\')"></li>' +
            '<li><img src="/assets/img/emoji/105.gif" onclick="bd_kfe_utils.emotionClicked(\'[流泪]\')"></li>' +
            '<li><img src="/assets/img/emoji/106.gif" onclick="bd_kfe_utils.emotionClicked(\'[害羞]\')"></li>' +
            '<li><img src="/assets/img/emoji/107.gif" onclick="bd_kfe_utils.emotionClicked(\'[闭嘴]\')"></li>' +
            '<li><img src="/assets/img/emoji/108.gif" onclick="bd_kfe_utils.emotionClicked(\'[睡]\')"></li>' +
            '<li><img src="/assets/img/emoji/109.gif" onclick="bd_kfe_utils.emotionClicked(\'[大哭]\')"></li>' +

            '<li><img src="/assets/img/emoji/110.gif" onclick="bd_kfe_utils.emotionClicked(\'[尴尬]\')"></li>' +
            '<li><img src="/assets/img/emoji/111.gif" onclick="bd_kfe_utils.emotionClicked(\'[发怒]\')"></li>' +
            '<li><img src="/assets/img/emoji/112.gif" onclick="bd_kfe_utils.emotionClicked(\'[调皮]\')"></li>' +
            '<li><img src="/assets/img/emoji/113.gif" onclick="bd_kfe_utils.emotionClicked(\'[呲牙]\')"></li>' +
            '<li><img src="/assets/img/emoji/114.gif" onclick="bd_kfe_utils.emotionClicked(\'[惊讶]\')"></li>' +
            '<li><img src="/assets/img/emoji/115.gif" onclick="bd_kfe_utils.emotionClicked(\'[难过]\')"></li>' +
            '<li><img src="/assets/img/emoji/116.gif" onclick="bd_kfe_utils.emotionClicked(\'[酷]\')"></li>' +
            '<li><img src="/assets/img/emoji/117.gif" onclick="bd_kfe_utils.emotionClicked(\'[冷汗]\')"></li>' +
            '<li><img src="/assets/img/emoji/118.gif" onclick="bd_kfe_utils.emotionClicked(\'[抓狂]\')"></li>' +
            '<li><img src="/assets/img/emoji/119.gif" onclick="bd_kfe_utils.emotionClicked(\'[吐]\')"></li>' +

            '<li><img src="/assets/img/emoji/120.gif" onclick="bd_kfe_utils.emotionClicked(\'[偷笑]\')"></li>' +
            '<li><img src="/assets/img/emoji/121.gif" onclick="bd_kfe_utils.emotionClicked(\'[愉快]\')"></li>' +
            '<li><img src="/assets/img/emoji/122.gif" onclick="bd_kfe_utils.emotionClicked(\'[白眼]\')"></li>' +
            '<li><img src="/assets/img/emoji/123.gif" onclick="bd_kfe_utils.emotionClicked(\'[傲慢]\')"></li>' +
            '<li><img src="/assets/img/emoji/124.gif" onclick="bd_kfe_utils.emotionClicked(\'[饥饿]\')"></li>' +
            '<li><img src="/assets/img/emoji/125.gif" onclick="bd_kfe_utils.emotionClicked(\'[困]\')"></li>' +
            '<li><img src="/assets/img/emoji/126.gif" onclick="bd_kfe_utils.emotionClicked(\'[惊恐]\')"></li>' +
            '<li><img src="/assets/img/emoji/127.gif" onclick="bd_kfe_utils.emotionClicked(\'[流汗]\')"></li>' +
            '<li><img src="/assets/img/emoji/128.gif" onclick="bd_kfe_utils.emotionClicked(\'[憨笑]\')"></li>' +
            '<li><img src="/assets/img/emoji/129.gif" onclick="bd_kfe_utils.emotionClicked(\'[悠闲]\')"></li>' +

            '<li><img src="/assets/img/emoji/130.gif" onclick="bd_kfe_utils.emotionClicked(\'[奋斗]\')"></li>' +
            '<li><img src="/assets/img/emoji/131.gif" onclick="bd_kfe_utils.emotionClicked(\'[咒骂]\')"></li>' +
            '<li><img src="/assets/img/emoji/132.gif" onclick="bd_kfe_utils.emotionClicked(\'[疑问]\')"></li>' +
            '<li><img src="/assets/img/emoji/133.gif" onclick="bd_kfe_utils.emotionClicked(\'[嘘]\')"></li>' +
            '<li><img src="/assets/img/emoji/134.gif" onclick="bd_kfe_utils.emotionClicked(\'[晕]\')"></li>' +
            '<li><img src="/assets/img/emoji/135.gif" onclick="bd_kfe_utils.emotionClicked(\'[疯了]\')"></li>' +
            '<li><img src="/assets/img/emoji/136.gif" onclick="bd_kfe_utils.emotionClicked(\'[衰]\')"></li>' +
            '<li><img src="/assets/img/emoji/137.gif" onclick="bd_kfe_utils.emotionClicked(\'[骷髅]\')"></li>' +
            '<li><img src="/assets/img/emoji/138.gif" onclick="bd_kfe_utils.emotionClicked(\'[敲打]\')"></li>' +
            '<li><img src="/assets/img/emoji/139.gif" onclick="bd_kfe_utils.emotionClicked(\'[再见]\')"></li>' +

            '<li><img src="/assets/img/emoji/140.gif" onclick="bd_kfe_utils.emotionClicked(\'[擦汗]\')"></li>' +
            '<li><img src="/assets/img/emoji/141.gif" onclick="bd_kfe_utils.emotionClicked(\'[抠鼻]\')"></li>' +
            '<li><img src="/assets/img/emoji/142.gif" onclick="bd_kfe_utils.emotionClicked(\'[鼓掌]\')"></li>' +
            '<li><img src="/assets/img/emoji/143.gif" onclick="bd_kfe_utils.emotionClicked(\'[糗大了]\')"></li>' +
            '<li><img src="/assets/img/emoji/144.gif" onclick="bd_kfe_utils.emotionClicked(\'[坏笑]\')"></li>' +
            '<li><img src="/assets/img/emoji/145.gif" onclick="bd_kfe_utils.emotionClicked(\'[左哼哼]\')"></li>' +
            '<li><img src="/assets/img/emoji/146.gif" onclick="bd_kfe_utils.emotionClicked(\'[右哼哼]\')"></li>' +
            '<li><img src="/assets/img/emoji/147.gif" onclick="bd_kfe_utils.emotionClicked(\'[哈欠]\')"></li>' +
            '<li><img src="/assets/img/emoji/148.gif" onclick="bd_kfe_utils.emotionClicked(\'[鄙视]\')"></li>' +
            '<li><img src="/assets/img/emoji/149.gif" onclick="bd_kfe_utils.emotionClicked(\'[委屈]\')"></li>' +

            '<li><img src="/assets/img/emoji/150.gif" onclick="bd_kfe_utils.emotionClicked(\'[快哭]\')"></li>' +
            '<li><img src="/assets/img/emoji/151.gif" onclick="bd_kfe_utils.emotionClicked(\'[阴险]\')"></li>' +
            '<li><img src="/assets/img/emoji/152.gif" onclick="bd_kfe_utils.emotionClicked(\'[亲亲]\')"></li>' +
            '<li><img src="/assets/img/emoji/153.gif" onclick="bd_kfe_utils.emotionClicked(\'[吓]\')"></li>' +
          '</div>' +
          '<div class="byteDesk-input-pc-buttons">' +
            '<li id="byteDesk-input-emoji" class="iconfont icon-emoji"></li>' +
            '<input type="file" id="imagefile" style="display: none;"/>' +
            '<li id="byteDesk-upload-image" class="iconfont icon-image"></li>' +
            '<li id="byteDesk-message-rate" class="iconfont icon-rate"></li>' +
            '<li id="byteDesk-message-tip">对方正在输入</li>' +
          '</div>' + // byteDesk-input-pc-buttons
          '<textarea id="byteDesk-input-textarea" placeholder="请输入" onkeyup="bd_kfe_utils.onKeyUp(arguments[0] || window.event)"></textarea>' +
          '<div id="byteDesk-input-pc-send">' + 
            '<span id="byteDesk-input-pc-send-btn" style="color: black; cursor: pointer;">发送</span>' +
          '</div>' + // byteDesk-input-pc-send
          '<div id="byteDesk-logo">' + 
            '<a href="http://www.bytedesk.com" target="_blank">客服软件由萝卜丝提供</a>' +
          '</div>' + // byteDesk-logo
        '</div>' + // byteDesk-input-pc
      '</div>' + // byteDesk-main
      '<div id="byteDesk-rate">' +
        '<span id="byteDesk-rate-close" style="cursor: pointer; color: gray;"><i class="iconfont icon-close"></i>开发中...</span>' +
      '</div>' + // byteDesk-rate 评价
      '<div id="byteDesk-leave">' +
        '<span id="byteDesk-leave-close" style="cursor: pointer; color: gray;"><i class="iconfont icon-close"></i></span>' +
      '</div>' + // byteDesk-leave 留言
      '<div id="byteDesk-search">' +
      '</div>' + // byteDesk-search 自助搜索查询
      '<div id="byteDesk-questionnaire">' +
      '</div>' + // bytedesk-questionnaire 询前问卷
      '<div id="byteDesk-agent-detail">' +
      '</div>' + // byteDesk-agent-detail 点击客服头像，显示客服详情，如：联系方式，等级评分等
    '</div>' + // byteDesk-app
   '</div>'; // byteDesk-app-wrapper
  //
  var byteDesk = document.getElementById('byteDesk');
  byteDesk.insertAdjacentHTML('beforeend', contentHtml);
})();
