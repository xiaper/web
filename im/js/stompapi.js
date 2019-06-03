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
   * @apiDescription 用户登录成功之后必须订阅相关主题才能接收到消息。长连接形式，不支持http请求。
   * 其中：客服会话主题格式为：'thread.xxxx'，单聊主题格式为：'contact.xxx'，群聊主题格式为：'group.xxx'
   */
  subscribeTopic: function (topic) {
    // 防止重复订阅
    if (data.subscribedTopics.indexOf(topic) !== -1) {
      return;
    }
    data.subscribedTopics.push(topic);
    //
    data.stompClient.subscribe("/topic/" + topic, function (msg) {
      // console.log('message :', msg, 'body:', msg.body);
      var message = JSON.parse(msg.body)
      if (message.type === constants.MESSAGE_TYPE_TEXT ||
          message.type === constants.MESSAGE_TYPE_IMAGE ||
          message.type === constants.MESSAGE_TYPE_FILE
      ) {
        // 文本、图片消息 + 上线、离线消息
        if (message.thread.type === constants.THREAD_TYPE_THREAD) {
          // 客服会话
        } else if (message.thread.type === constants.THREAD_TYPE_CONTACT) {
          // 一对一消息, 广播，主页面监听
          // 不含自己发送的消息
          if (data.userInfo.uid !== message.user.uid) {
            var content = ''
            if (message.type === constants.MESSAGE_TYPE_TEXT) {
              content = message.content
            } else if (message.type === constants.MESSAGE_TYPE_IMAGE) {
              content = 'img[' + message.imageUrl + ']'
            }
            data.layim.getMessage({
              id: message.user.uid, // 接收者：消息的来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
              username: message.user.realName, // 消息来源用户名
              avatar: message.user.avatar, // 消息来源用户头像
              type: 'friend', // 聊天窗口来源类型，从发送消息传递的to里面获取
              content: content, // 消息内容
              cid: 0, // 消息id，可不传。除非你要对消息进行一些操作（如撤回）
              mine: false, // 是否我发送的消息，如果为true，则会显示在右方
              fromid: message.user.uid, // 消息的发送者id（比如群组中的某个消息发送者），可用于自动解决浏览器多窗口时的一些问题
              timestamp: moment(message.createdAt).valueOf() // 服务端时间戳毫秒数。注意：如果你返回的是标准的 unix 时间戳，记得要 *1000
            })
          }
        } else if (message.thread.type === constants.THREAD_TYPE_GROUP) {
          // 群组消息, 广播，主页面监听
          if (data.userInfo.uid !== message.user.uid) {
            var content = ''
            if (message.type === constants.MESSAGE_TYPE_TEXT) {
              content = message.content
            } else if (message.type === constants.MESSAGE_TYPE_IMAGE) {
              content = 'img[' + message.imageUrl + ']'
            }
            data.layim.getMessage({
              id: message.gid, // 接收者：消息的来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
              username: message.user.realName, // 消息来源用户名
              avatar: message.user.avatar, // 消息来源用户头像
              type: 'group', // 聊天窗口来源类型，从发送消息传递的to里面获取
              content: content, // 消息内容
              cid: 0, // 消息id，可不传。除非你要对消息进行一些操作（如撤回）
              mine: false, // 是否我发送的消息，如果为true，则会显示在右方
              fromid: message.user.uid, // 消息的发送者id（比如群组中的某个消息发送者），可用于自动解决浏览器多窗口时的一些问题
              timestamp: moment(message.createdAt).valueOf() // 服务端时间戳毫秒数。注意：如果你返回的是标准的 unix 时间戳，记得要 *1000
            })
          }
        }
      } 

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
   * @api {} 发送消息回执
   * @apiName sendReceiptMessage
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} mid 消息mid
   * @apiParam {String} status 消息状态
   * 
   * @apiDescription 发送消息回执。长连接形式，不支持http请求
   */
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
   * @api {} 发送单聊文本消息
   * @apiName sendContactTextMessage
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} payload，格式为 var payload = { uid: '', content: '' }
   * 
   * @apiDescription 发送单聊文本消息。长连接形式，不支持http请求
   */
  sendContactTextMessage: function(payload) {
    var uid = payload.uid
    var content = payload.content
    var topic = 'contact.' + uid
    data.stompClient.send('/app/' + topic, {}, JSON.stringify({
      'type': constants.MESSAGE_TYPE_TEXT,
      'content': content,
      'localId': utils.guid(),
      'client': data.client}))
  },

  /**
   * @api {} 发送单聊图片消息
   * @apiName sendContactImageMessage
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} payload，格式为 var payload = { uid: '', content: '' }
   * 
   * @apiDescription 发送单聊图片消息。长连接形式，不支持http请求。
   */
  sendContactImageMessage: function(payload){
    var uid = payload.uid
    var imageUrl = payload.imageUrl
    var topic = 'contact.' + uid
    data.stompClient.send('/app/' + topic, {}, JSON.stringify({
      'type': constants.MESSAGE_TYPE_IMAGE,
      'imageUrl': imageUrl,
      'localId': utils.guid(),
      'client': data.client}))
  },

  /**
   * @api {} 发送单聊文件消息
   * @apiName sendContactFileMessage
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} payload，格式为 var payload = { uid: '', content: '' }
   * 
   * @apiDescription 发送单聊文件消息。长连接形式，不支持http请求。
   */
  sendContactFileMessage: function(payload) {
    var uid = payload.uid
    var fileUrl = payload.fileUrl
    var format = payload.format
    var topic = 'contact.' + uid
    data.stompClient.send('/app/' + topic, {}, JSON.stringify({
      'type': constants.MESSAGE_TYPE_FILE,
      'fileUrl': fileUrl,
      'format': format,
      'localId': utils.guid(),
      'client': data.client}))
  },

  /**
   * @api {} 发送单聊自定义类型消息
   * @apiName sendContactCustomMessage
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} payload，格式为 var payload = { uid: '', content: '' }
   * 
   * @apiDescription 发送单聊自定义类型消息。长连接形式，不支持http请求。
   */
  sendContactCustomMessage: function(payload){
    var uid = payload.uid
    var content = payload.content
    var topic = 'contact.' + uid
    data.stompClient.send('/app/' + topic, {}, JSON.stringify({
      'type': constants.MESSAGE_TYPE_CUSTOM,
      'content': content,
      'localId': utils.guid(),
      'client': data.client}))
  },

  /**
   * @api {} 发送单聊商品消息
   * @apiName sendContactCommodityMessage
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} payload，格式为 var payload = { uid: '', content: '' }
   * 实例：var contentObject = { 'type': 'commodity', 'title': '商品标题', 'content': '商品详情', 'price': '¥9.99', 'url': 'https://item.m.jd.com/product/12172344.html', 'imageUrl': 'https://m.360buyimg.com/mobilecms/s750x750_jfs/t4483/332/2284794111/122812/4bf353/58ed7f42Nf16d6b20.jpg!q80.dpg' }
   * var content = JSON.stringfy(contentObject)
   * var payload = { uid: '', content: content}
   * stompapi.sendContactCommodityMessage(payload)
   * 
   * @apiDescription 发送群聊商品消息。长连接形式，不支持http请求。
   */
  sendContactCommodityMessage: function(payload) {
    var uid = payload.uid
    var content = payload.content
    var topic = 'contact.' + uid
    data.stompClient.send('/app/' + topic, {}, JSON.stringify({
      'type': constants.MESSAGE_TYPE_COMMODITY,
      'content': content,
      'localId': utils.guid(),
      'client': data.client}))
  },

  /**
   * @api {} 发送群聊文本消息
   * @apiName sendGroupTextMessage
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} payload，格式为 var payload = { uid: '', content: '' }
   * 
   * @apiDescription 发送群聊文本消息。长连接形式，不支持http请求。
   */
  sendGroupTextMessage: function(payload) {
    var uid = payload.uid
    var content = payload.content
    var topic = 'group.' + uid
    data.stompClient.send('/app/' + topic, {}, JSON.stringify({
      'type': constants.MESSAGE_TYPE_TEXT,
      'content': content,
      'localId': utils.guid(),
      'client': data.client}))
  },

  /**
   * @api {} 发送群聊图片消息
   * @apiName sendGroupImageMessage
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} payload，格式为 var payload = { uid: '', content: '' }
   * 
   * @apiDescription 发送群聊图片消息。长连接形式，不支持http请求。
   */
  sendGroupImageMessage: function(payload) {
    var uid = payload.uid
    var imageUrl = payload.imageUrl
    var topic = 'group.' + uid
    data.stompClient.send('/app/' + topic, {}, JSON.stringify({
      'type': constants.MESSAGE_TYPE_IMAGE,
      'imageUrl': imageUrl,
      'localId': utils.guid(),
      'client': data.client}))
  },

  /**
   * @api {} 发送群聊文件消息
   * @apiName sendGroupFileMessage
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} payload，格式为 var payload = { uid: '', content: '' }
   * 
   * @apiDescription 发送群聊文件消息。长连接形式，不支持http请求。
   */
  sendGroupFileMessage: function(payload) {
    var uid = payload.uid
    var fileUrl = payload.fileUrl
    var format = payload.format
    var topic = 'group.' + uid
    data.stompClient.send('/app/' + topic, {}, JSON.stringify({
      'type': constants.MESSAGE_TYPE_FILE,
      'fileUrl': fileUrl,
      'format': format,
      'localId': utils.guid(),
      'client': data.client}))
  },

  /**
   * @api {} 发送群聊自定义类型消息
   * @apiName sendGroupCustomMessage
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} payload，格式为 var payload = { uid: '', content: '' }
   * 
   * @apiDescription 发送群聊自定义类型消息。长连接形式，不支持http请求。
   */
  sendGroupCustomMessage: function(payload) {
    var uid = payload.uid
    var content = payload.content
    var topic = 'group.' + uid
    data.stompClient.send('/app/' + topic, {}, JSON.stringify({
      'type': constants.MESSAGE_TYPE_CUSTOM,
      'content': content,
      'localId': utils.guid(),
      'client': data.client}))
  },

  /**
   * @api {} 发送群聊商品消息
   * @apiName sendGroupCommodityMessage
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} payload，格式为 var payload = { uid: '', content: '' }
   * 实例：var contentObject = { 'type': 'commodity', 'title': '商品标题', 'content': '商品详情', 'price': '¥9.99', 'url': 'https://item.m.jd.com/product/12172344.html', 'imageUrl': 'https://m.360buyimg.com/mobilecms/s750x750_jfs/t4483/332/2284794111/122812/4bf353/58ed7f42Nf16d6b20.jpg!q80.dpg' }
   * var content = JSON.stringfy(contentObject)
   * var payload = { uid: '', content: content}
   * stompapi.sendGroupCommodityMessage(payload)
   * 
   * @apiDescription 发送群聊商品消息。长连接形式，不支持http请求。
   */
  sendGroupCommodityMessage: function(payload) {
    var uid = payload.uid
    var content = payload.content
    var topic = 'group.' + uid
    data.stompClient.send('/app/' + topic, {}, JSON.stringify({
      'type': constants.MESSAGE_TYPE_COMMODITY,
      'content': content,
      'localId': utils.guid(),
      'client': data.client}))
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

        // 订阅公司信息
        var subDomainTopic = 'subDomain.' + data.userInfo.subDomain
        stompapi.subscribeTopic(subDomainTopic)

        // 订阅工作组消息
        var workGroups = data.workGroups
        for (var i = 0; i < workGroups.length; i++) {
          var workGroup = workGroups[i]
          // 工作组会话
          var topic = 'workGroup.' + workGroup.wid
          stompapi.subscribeTopic(topic)
        }

        // 添加订阅群组会话topic
        var groups = data.groups
        for (var i = 0; i < groups.length; i++) {
          const group = groups[i]
          var topicGroup = 'group.' + group.gid
          stompapi.subscribeTopic(topicGroup)
        }

        // 订阅会话thread
        var threads = data.threads
        for (var j = 0; j < threads.length; j++) {
          var thread = threads[j]
          var topic = 'thread.' + thread.tid
          stompapi.subscribeTopic(topic)
        }
        
        // 订阅同事消息
        var topic = 'contact.' + data.userInfo.uid
        stompapi.subscribeTopic(topic)
        // 订阅个人消息, 因为可能同时登录多个客户端，所以也是订阅topic...
        topic = 'user.' + data.userInfo.uid
        stompapi.subscribeTopic(topic)
        
        // 使用layim作为演示UI, 初始化layim界面
        layim.initIM();
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
