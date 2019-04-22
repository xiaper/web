/**
 * bytedesk.com
 */
/**
 * @apiDefine Message 消息
 *
 * 发送消息相关
 */
var bd_kfe_stompapi = {
  /**
   * 发送同步消息
   */
  sendTextMessageSync: function (content) {
    bd_kfe_stompapi.sendMessageSync("text", content);
  },
  sendImageMessageSync: function (content) {
    bd_kfe_stompapi.sendMessageSync("image", content);
  },
  sendMessageSync: function (type, content) {
    //
    var localId = bd_kfe_utils.guid();
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/messages/send?access_token=" +
      bd_kfe_data.passport.token.access_token,
      type: "post",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({
        tid: bd_kfe_data.thread.tid,
        type: type,
        content: content,
        status: "sending",
        localId: localId,
        sessionType: "thread",
        client: bd_kfe_data.client
      }),
      success:function(response){
        console.log("sendMessageSync:" + response.data);
        if (response.status_code !== 200) {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log(error);
      }
    });
  },
  /**
   * 必须添加前缀 '/topic/'
   * @param topic
   */
  subscribeTopic: function (topic) {
    // 防止重复订阅
    if (bd_kfe_data.subscribedTopics.indexOf(topic) !== -1) {
      return;
    }
    bd_kfe_data.subscribedTopics.push(topic);
    //
    bd_kfe_data.stompClient.subscribe("/topic/" + topic, function (message) {
      // console.log('message :', message, 'body:', message.body);
      var messageObject = JSON.parse(message.body);
      if (
        (messageObject.type === "text" ||
          messageObject.type === "image" ||
          messageObject.type === "file") &&
        messageObject.user.uid !== bd_kfe_data.uid
      ) {
        //
        var mid = messageObject.mid;
        // 发送消息回执：消息送达
        bd_kfe_stompapi.sendReceiptMessage(mid, "received");
      } else if (messageObject.type === "notification_browse_invite") {
        bd_kfe_data.browseInviteBIid = messageObject.browseInvite.bIid;
        // 客服邀请您参加会话
        // bd_kfe_httpapi.acceptInviteBrowse();
        // bd_kfe_httpapi.rejectInviteBrowse();
      } else if (messageObject.type === "notification_queue") {
        // 排队
      } else if (messageObject.type === "notification_queue_accept") {
        // 1. 保存thread
        bd_kfe_data.thread = messageObject.thread;
        // 2. 订阅会话消息
        bd_kfe_stompapi.subscribeTopic(bd_kfe_data.threadTopic());
      } else if (messageObject.type === "notification_invite_rate") {
        // 邀请评价
        bd_kfe_data.rateDialogVisible = true;
        bd_kfe_data.isInviteRate = true;
        $("#byteDesk-chat").hide();
        $("#byteDesk-leave").hide();
        $("#byteDesk-rate").show();
      } else if (
        messageObject.type === "notification_agent_close" ||
        messageObject.type === "notification_auto_close"
      ) {
        // TODO: 会话关闭，添加按钮方便用户点击重新请求会话
        bd_kfe_data.isThreadClosed = true;
      } else if (messageObject.type === "notification_preview") {
        if (messageObject.user.username !== bd_kfe_data.username) {
          bd_kfe_data.inputTipVisible = true;
          bd_kfe_utils.toggleInputTip(true);
          setTimeout(function () {
            bd_kfe_data.inputTipVisible = false;
            bd_kfe_utils.toggleInputTip(false);
          }, 5000);
        }
      }
      //
      if (
        messageObject.type !== "notification_preview" &&
        messageObject.type !== "notification_receipt" &&
        messageObject.type !== "notification_connect" &&
        messageObject.type !== "notification_disconnect"
      ) {
        bd_kfe_data.isRobot = false;
        bd_kfe_utils.pushMessage(messageObject);
        bd_kfe_utils.scrollToBottom();
      } else {
        // TODO: 监听客服端输入状态
      }
      // and acknowledge it
      // FIXME: PRECONDITION_FAILED - unknown delivery tag 8
      // message.ack()
      // }, {ack: 'client'});
    });
  },
  /**
   * 订阅一对一会话,
   * 必须携带前缀 '/user/'
   *
   * @param queue
   */
  subscribeQueue: function (queue) {
    bd_kfe_data.stompClient.subscribe("/user/queue/" + queue, function (message) {
      console.log(queue, ":", message, "body:", message.body);
    });
  },
  /**
   * 输入框变化
   */
  onInputChange: function () {
    var content = $.trim($("#byteDesk-input-textarea").val());
    bd_kfe_data.stompClient.send(
      "/app/" + bd_kfe_data.threadTopic(),
      {},
      JSON.stringify({
        type: "notification_preview",
        content: content,
        client: bd_kfe_data.client
      })
    );
  },
  /**
   * 发送消息
   */
  sendTextMessage: function () {
    //
    var content = $.trim($("#byteDesk-input-textarea").val());
    if (content.length === 0) {
      return;
    }
    console.log('send text:', content);
    if (bd_kfe_data.isRobot) {
      bd_kfe_httpapi.messageAnswer(content);
    } else {
      //
      if (bd_kfe_data.isThreadClosed) {
        alert("会话已经结束");
        return;
      }
      // 发送/广播会话消息
      // bd_kfe_stompapi.sendTextMessageSync(content);
      bd_kfe_data.stompClient.send("/app/" + bd_kfe_data.threadTopic(), 
      {}, 
      JSON.stringify({
        'type': 'text', 
        'content': content, 
        'client': bd_kfe_data.client
      }));
    }
    // 清空输入框
    $("#byteDesk-input-textarea").val("");
    // 清空消息预知
    bd_kfe_data.stompClient.send(
      "/app/" + bd_kfe_data.threadTopic(),
      {},
      JSON.stringify({
        type: "notification_preview",
        content: "",
        client: bd_kfe_data.client
      })
    );
  },
  sendImageMessage: function (imageUrl) {
    //
    if (bd_kfe_data.isRobot) {
      alert("自助服务暂不支持图片")
      return;
    } 
    //
    if (bd_kfe_data.isThreadClosed) {
      alert("会话已经结束");
      return;
    }
    // 发送/广播会话消息
    // bd_kfe_stompapi.sendImageMessageSync(imageUrl);
    bd_kfe_data.stompClient.send("/app/" + bd_kfe_data.threadTopic(), 
    {}, 
    JSON.stringify({
      'type': 'image', 
      'imageUrl': imageUrl, 
      'client': bd_kfe_data.client
    }));
  },
  sendReceiptMessage: function (mid, status) {
    // 收到消息后，向服务器发送回执
    bd_kfe_data.stompClient.send(
      "/app/" + bd_kfe_data.threadTopic(),
      {},
      JSON.stringify({
        type: "notification_receipt",
        content: mid,
        status: status,
        client: bd_kfe_data.client
      })
    );
  },
  /**
   * http://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#websocket-bd_kfe_stompapi-authentication
   */
  byteDeskConnect: function () {
    console.log('start stomp connection');
    var socket = new SockJS(
      bd_kfe_data.STOMP_HOST +
      "/stomp/?access_token=" +
      bd_kfe_data.passport.token.access_token
    );
    bd_kfe_data.stompClient = Stomp.over(socket);
    bd_kfe_data.stompClient.reconnect_delay = 1000;
    // client will send heartbeats every 10000ms, default 10000
    bd_kfe_data.stompClient.heartbeat.outgoing = 20000;
    // client does not want to receive heartbeats from the server, default 10000
    bd_kfe_data.stompClient.heartbeat.incoming = 20000;
    // to disable logging, set it to an empty function:
    // bd_kfe_data.stompClient.debug = function (value) {}
    // 连接bytedesk，如果后台开启了登录，需要登录之后才行
    bd_kfe_data.stompClient.connect(
      {},
      function (frame) {
        // console.log('stompConnected: ' + frame + " username：" + frame.headers['user-name']);
        bd_kfe_data.isConnected = true;
        bd_kfe_utils.updateConnection(true);
        // 获取 websocket 连接的 sessionId
        // FIXME: Uncaught TypeError: Cannot read property '1' of null
        // var sessionId = /\/([^\/]+)\/websocket/.exec(socket._transport.url)[1];
        // console.log("connected, session id: " + sessionId);
        // 订阅会话消息，处理断开重连的情况
        if (
          bd_kfe_data.thread.tid !== null &&
          bd_kfe_data.thread.tid !== undefined &&
          bd_kfe_data.thread.tid !== ""
        ) {
          bd_kfe_stompapi.subscribeTopic(bd_kfe_data.threadTopic());
        }
        // 显示icon漂浮框
        if (document.getElementById("byteDesk-app-wrapper").style.display === 'none') {
          document.getElementById("byteDesk-start").style.display = '';
        }
      },
      function (error) {
        console.log("连接断开【" + error + "】");
        bd_kfe_data.isConnected = false;
        bd_kfe_utils.updateConnection(false);
        // 为断开重连做准备
        bd_kfe_data.subscribedTopics = [];
        // 10秒后重新连接，实际效果：每10秒重连一次，直到连接成功
        setTimeout(function () {
          console.log("reconnecting...");
          bd_kfe_stompapi.byteDeskConnect();
        }, 10000);
      }
    );
  }
};
