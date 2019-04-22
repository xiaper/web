/**
 * bytedesk.com
 */
/**
 * @apiDefine Message 消息
 *
 * 发送消息相关接口
 */
/**
 * @apiDefine ResponseResultSuccess
 * @apiSuccess {String} message 返回提示
 * @apiSuccess {Number} status_code 状态码
 * @apiSuccess {String} data 返回内容
 */
var stompapi = {
  /**
   * @api {post} /api/v2/messages/send 同步发送文本消息
   * @apiName sendTextMessageSync
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} id 当sesstionType == 'thread'的时候填写会话 tid，当为 'contact'的时候为用户uid，当为'group'的时候，为群组gid
   * @apiParam {String} content 内容
   * @apiParam {String} sesstionType，有三种类型：'thread' 代表客服会话, 'contact'代表单聊, 'group'代表群聊
   * 
   * @apiDescription
   * 客服会话：stompapi.send('xxx', 'hello world', 'thread')
   * 单聊：stompapi.send('xxx', 'hello world', 'contact')
   * 群聊：stompapi.send('xxxx', 'hello world', 'group')
   *
   * @apiUse ResponseResultSuccess
   */
  sendTextMessageSync: function (id, content, sessionType) {
    stompapi.sendMessageSync(id, "text", content, sessionType);
  },
  /**
   * @api {post} /api/v2/messages/send 同步发送图片消息
   * @apiName sendImageMessageSync
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} id 当sesstionType == 'thread'的时候填写会话 tid，当为 'contact'的时候为用户uid，当为'group'的时候，为群组gid
   * @apiParam {String} content 图片URL
   * @apiParam {String} sesstionType，有三种类型：'thread' 代表客服会话, 'contact'代表单聊, 'group'代表群聊
   * 
   * @apiDescription
   * 客服会话：stompapi.send('xxx', 'hello world', 'thread')
   * 单聊：stompapi.send('xxx', 'hello world', 'contact')
   * 群聊：stompapi.send('xxxx', 'hello world', 'group')
   *
   * @apiUse ResponseResultSuccess
   */
  sendImageMessageSync: function (id, content, sessionType) {
    stompapi.sendMessageSync(id, "image", content, sessionType);
  },
  /**
   * @api {post} /api/v2/messages/send 同步发送商品消息
   * @apiName sendCommodityMessageSync
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} id 当sesstionType == 'thread'的时候填写会话 tid，当为 'contact'的时候为用户uid，当为'group'的时候，为群组gid
   * @apiParam {String} content 可自定义为json字符串
   * @apiParam {String} sesstionType，有三种类型：'thread' 代表客服会话, 'contact'代表单聊, 'group'代表群聊
   * 
   * @apiDescription 实例：var contentObject = { 'type': 'commodity', 'title': '商品标题', 'content': '商品详情', 'price': '¥9.99', 'url': 'https://item.m.jd.com/product/12172344.html', 'imageUrl': 'https://m.360buyimg.com/mobilecms/s750x750_jfs/t4483/332/2284794111/122812/4bf353/58ed7f42Nf16d6b20.jpg!q80.dpg' }
   * var content = JSON.stringfy(contentObject)
   * stompapi.sendCommodityMessageSync('xxx', content, 'contact')
   *
   * @apiUse ResponseResultSuccess
   */
  sendCommodityMessageSync: function (id, content, sessionType) {
    stompapi.sendMessageSync(id, "commodity", content, sessionType);
  },
  /**
   * @api {post} /api/v2/messages/send 同步发送消息
   * @apiName sendMessageSync
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} id 当sesstionType == 'thread'的时候填写会话 tid，当为 'contact'的时候为用户uid，当为'group'的时候，为群组gid
   * @apiParam {String} type 消息类型，如：文字消息为 'text', 图片消息为 'image', 商品消息为 'commodity'
   * @apiParam {String} content 消息内容
   * @apiParam {String} sesstionType，有三种类型：'thread' 代表客服会话, 'contact'代表单聊, 'group'代表群聊
   * 
   * @apiDescription
   * 客服会话：stompapi.send('xxx', 'text', 'hello world', 'thread')
   * 单聊：stompapi.send('xxx', 'image', 'hello world', 'contact')
   * 群聊：stompapi.send('xxxx', 'commodity', 'hello world', 'group')
   *
   * @apiUse ResponseResultSuccess
   */
  sendMessageSync: function (id, type, content, sessionType) {
    //
    $.ajax({
      url: data.HTTP_HOST +
      "/api/v2/messages/send?access_token=" +
      data.passport.token.access_token,
      type: "post",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({
        tid: id,
        type: type,
        content: content,
        username: data.username,
        status: "sending",
        localId: utils.guid(),
        sessionType: sessionType,
        voiceLength: 0,
        format: "amr",
        client: data.client
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
   * @api {} 长连接订阅主题
   * @apiName subscribeTopic
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} topic 订阅主题
   * 
   * @apiDescription 用户登录成功之后必须订阅相关主题才能接收到消息。
   * 其中：客服会话主题格式为：'thread.xxxx'，单聊主题格式为：'contact.xxx'，群聊主题格式为：'group.xxx'
   */
  subscribeTopic: function (topic) {
    // 防止重复订阅
    if (data.subscribedTopics.indexOf(topic) !== -1) {
      return;
    }
    data.subscribedTopics.push(topic);
    //
    data.stompClient.subscribe("/topic/" + topic, function (message) {
      // console.log('message :', message, 'body:', message.body);
      var messageObject = JSON.parse(message.body);
      if (
        (messageObject.type === "text" ||
          messageObject.type === "image" ||
          messageObject.type === "file") &&
        messageObject.user.uid !== data.uid
      ) {
        //
        var mid = messageObject.mid;
        // 发送消息回执：消息送达
        stompapi.sendReceiptMessage(mid, "received");
      } else if (messageObject.type === "notification_browse_invite") {
        data.browseInviteBIid = messageObject.browseInvite.bIid;
        // 客服邀请您参加会话
        // httpapi.acceptInviteBrowse();
        // httpapi.rejectInviteBrowse();
      } else if (messageObject.type === "notification_queue") {
        // 排队
      } else if (messageObject.type === "notification_queue_accept") {
        // 1. 保存thread
        data.thread = messageObject.thread;
        // 2. 订阅会话消息
        stompapi.subscribeTopic(data.threadTopic());
      } else if (messageObject.type === "notification_invite_rate") {
        // 邀请评价
        data.rateDialogVisible = true;
        data.isInviteRate = true;
        $("#byteDesk-chat").hide();
        $("#byteDesk-leave").hide();
        $("#byteDesk-rate").show();
      } else if (
        messageObject.type === "notification_agent_close" ||
        messageObject.type === "notification_auto_close"
      ) {
        // TODO: 会话关闭，添加按钮方便用户点击重新请求会话
        data.isThreadClosed = true;
      } else if (messageObject.type === "notification_preview") {
        if (messageObject.user.username !== data.username) {
          data.inputTipVisible = true;
          utils.toggleInputTip(true);
          setTimeout(function () {
            data.inputTipVisible = false;
            utils.toggleInputTip(false);
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
        data.isRobot = false;
        utils.pushMessage(messageObject);
        utils.scrollToBottom();
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
    data.stompClient.subscribe("/user/queue/" + queue, function (message) {
      console.log(queue, ":", message, "body:", message.body);
    });
  },
  /**
   * 输入框变化
   */
  onInputChange: function () {
    var content = $.trim($("#inputcontent").val());
    data.stompClient.send(
      "/app/" + data.threadTopic(),
      {},
      JSON.stringify({
        type: "notification_preview",
        content: content,
        client: data.client
      })
    );
  },
  /**
   * 发送消息
   */
  sendTextMessage: function () {
    //
    var content = $.trim($("#inputcontent").val());
    if (content.length === 0) {
      return;
    }
    //
    if (data.isRobot) {
      httpapi.messageAnswer(content);
    } else {
      //
      if (data.isThreadClosed) {
        alert("会话已经结束");
        return;
      }
      // 发送/广播会话消息
      // stompapi.sendTextMessageSync(content);
      data.stompClient.send("/app/" + data.threadTopic(), 
      {}, 
      JSON.stringify({
        'type': 'text', 
        'content': content, 
        'client': data.client
      }));
    }
    // 清空输入框
    $("#inputcontent").val("");
    // 清空消息预知
    data.stompClient.send(
      "/app/" + data.threadTopic(),
      {},
      JSON.stringify({
        type: "notification_preview",
        content: "",
        client: data.client
      })
    );
  },
  sendImageMessage: function (imageUrl) {
    //
    if (data.isRobot) {
      alert("自助服务暂不支持图片")
      return;
    } 
    //
    if (data.isThreadClosed) {
      alert("会话已经结束");
      return;
    }
    // 发送/广播会话消息
    // stompapi.sendImageMessageSync(imageUrl);
    data.stompClient.send("/app/" + data.threadTopic(), 
    {}, 
    JSON.stringify({
      'type': 'image', 
      'imageUrl': imageUrl, 
      'client': data.client
    }));
  },
  sendReceiptMessage: function (mid, status) {
    // 收到消息后，向服务器发送回执
    data.stompClient.send(
      "/app/" + data.threadTopic(),
      {},
      JSON.stringify({
        type: "notification_receipt",
        content: mid,
        status: status,
        client: data.client
      })
    );
  },
  /**
   * @api {} 建立长连接
   * @apiName byteDeskConnect
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission none
   * 
   * @apiDescription 建立长连接。长连接形式，不支持http请求。
   */
  byteDeskConnect: function () {
    console.log('start stomp connection');
    var socket = new SockJS(
      data.STOMP_HOST +
      "/stomp/?access_token=" +
      data.passport.token.access_token
    );
    data.stompClient = Stomp.over(socket);
    data.stompClient.reconnect_delay = 1000;
    // client will send heartbeats every 10000ms, default 10000
    data.stompClient.heartbeat.outgoing = 20000;
    // client does not want to receive heartbeats from the server, default 10000
    data.stompClient.heartbeat.incoming = 20000;
    // to disable logging, set it to an empty function:
    // data.stompClient.debug = function (value) {}
    // 连接bytedesk，如果后台开启了登录，需要登录之后才行
    data.stompClient.connect(
      {},
      function (frame) {
        // console.log('stompConnected: ' + frame + " username：" + frame.headers['user-name']);
        data.isConnected = true;
        utils.updateConnection(true);
        // 获取 websocket 连接的 sessionId
        // FIXME: Uncaught TypeError: Cannot read property '1' of null
        // var sessionId = /\/([^\/]+)\/websocket/.exec(socket._transport.url)[1];
        // console.log("connected, session id: " + sessionId);
        // 订阅会话消息，处理断开重连的情况
        if (
          data.thread.tid !== null &&
          data.thread.tid !== undefined &&
          data.thread.tid !== ""
        ) {
          stompapi.subscribeTopic(data.threadTopic());
        }
        // 接受通知
        // stompapi.subscribeQueue('notification');
        // 订阅错误消息
        // stompapi.subscribeQueue('errors');
      },
      function (error) {
        console.log("连接断开【" + error + "】");
        data.isConnected = false;
        utils.updateConnection(false);
        // 为断开重连做准备
        data.subscribedTopics = [];
        // 10秒后重新连接，实际效果：每10秒重连一次，直到连接成功
        setTimeout(function () {
          console.log("reconnecting...");
          stompapi.byteDeskConnect();
        }, 10000);
      }
    );
  }
};
