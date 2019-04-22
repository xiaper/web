/**
 * bytedesk.com
 */
/**
 * @apiDefine User 用户
 *
 * 用户相关接口
 */
/**
 * @apiDefine Group 群组
 *
 * 群组相关接口
 */
/**
 * @apiDefine SubDomainClientParam
 * @apiParam {String} subDomain 企业号，测试可填写 'vip'，上线请填写真实企业号
 * @apiParam {String} client 固定写死为 'web'
 */
/**
 * @apiDefine UserResultSuccess
 * @apiSuccess {String} uid 用户唯一uid.
 * @apiSuccess {String} username  用户名.
 * @apiSuccess {String} nickname  昵称.
 */
/**
 * @apiDefine ResponseResultSuccess
 * @apiSuccess {String} message 返回提示
 * @apiSuccess {Number} status_code 状态码
 * @apiSuccess {String} data 返回内容
 */
/**
 * @apiDefine Social 社交
 *
 * 社交关系相关接口
 */
var bd_kfe_httpapi = {
  /**
   * @api {get} /visitor/api/username 生成默认访客账号
   * @apiName requestUsername
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission none
   * 
   * @apiUse SubDomainClientParam
   * 
   * @apiDescription 1. 首先判断是否已经注册过；
   * 2. 如果已经注册过，则直接调用登录接口；
   * 3. 如果没有注册过，则从服务器请求用户名；
   * 4. FIXME: 暂未考虑浏览器不支持localStorage的情况
   *
   * @apiUse UserResultSuccess
   */
  requestUsername: function () {
    //
    bd_kfe_data.username = localStorage.bd_kfe_username;
    bd_kfe_data.password = localStorage.bd_kfe_password;
    if (bd_kfe_data.username) {
      if (bd_kfe_data.password == null) {
        bd_kfe_data.password = bd_kfe_data.username;
      }
      bd_kfe_httpapi.login();
    } else {
      //
      $.ajax({
        url: bd_kfe_data.HTTP_HOST + "/visitor/api/username",
        contentType: "application/json; charset=utf-8",
        type: "get",
        data: { 
          subDomain: bd_kfe_data.subDomain,
          client: bd_kfe_data.client
        },
        success:function(response){
          // 登录
          bd_kfe_data.uid = response.data.uid;
          bd_kfe_data.username = response.data.username;
          bd_kfe_data.password = bd_kfe_data.username;
          bd_kfe_data.nickname = response.data.nickname;
          // 本地存储
          localStorage.bd_kfe_uid = bd_kfe_data.uid;
          localStorage.bd_kfe_username = bd_kfe_data.username;
          localStorage.bd_kfe_password = bd_kfe_data.password;
          // 登录
          bd_kfe_httpapi.login();
        },
        error: function(error) {
          //Do Something to handle error
          console.log(error);
        }
      });
    }
  },
  /**
   * @api {post} /visitor/api/register/user 自定义用户名生成访客账号
   * @apiName registerUser
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission none
   * 
   * @apiParam {String} username 用户名
   * @apiParam {String} nickname 昵称
   * @apiParam {String} password 密码
   * @apiUse SubDomainClientParam
   * 
   * @apiDescription 开发者在需要跟自己业务系统账号对接的情况下，
   * 可以通过自定义用户名生成访客账号
   *
   * @apiUse UserResultSuccess
   */
  registerUser: function () {
    //
    var username = bd_kfe_utils.getUrlParam("username");
    var nickname =
      bd_kfe_utils.getUrlParam("nickname") == null
        ? username
        : bd_kfe_utils.getUrlParam("username");
    console.log("username self:", username, nickname);
    //
    $.ajax({
      url: bd_kfe_data.HTTP_HOST + "/visitor/api/register/user",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({ 
        username: username,
        nickname: nickname,
        password: username, // 用户名作为默认密码
        subDomain: bd_kfe_data.subDomain,
        client: bd_kfe_data.client
      }),
      success:function(response){
        // 登录
        bd_kfe_data.uid = response.data.uid;
        bd_kfe_data.username = response.data.username;
        bd_kfe_data.password = bd_kfe_data.username;
        bd_kfe_data.nickname = response.data.nickname;
        // 本地存储
        localStorage.bd_kfe_uid = bd_kfe_data.uid;
        localStorage.bd_kfe_username = bd_kfe_data.username;
        localStorage.bd_kfe_password = bd_kfe_data.password;
        // 登录
        bd_kfe_httpapi.login();
      },
      error: function(error) {
        //Do Something to handle error
        console.log(error);
      }
    });
  },
  /**
   * @api {post} /oauth/token 登录
   * @apiName login
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission none
   * 
   * @apiHeader {String} Authorization 值固定写死为: 'Basic Y2xpZW50OnNlY3JldA=='
   * 
   * @apiParam {String} username 用户名
   * @apiParam {String} password 密码
   * 
   * @apiDescription 登录
   *
   * @apiSuccess {String} access_token 访问令牌
   * @apiSuccess {Number} expires_in 过期时间
   * @apiSuccess {String} jti
   * @apiSuccess {String} refresh_token 刷新令牌
   * @apiSuccess {String} scope 固定值：'all'
   * @apiSuccess {String} token_type 固定值：'bearer'
   */
  login: function () {
    console.log('do login: ', bd_kfe_data.username, bd_kfe_data.password);
    //
    $.ajax({
      url: bd_kfe_data.HTTP_HOST + "/oauth/token",
      type: "post",
      data: { 
        "username": bd_kfe_data.username,
        "password": bd_kfe_data.password,
        "grant_type": "password",
        "scope": "all"
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Basic Y2xpZW50OnNlY3JldA==');
      },
      success:function(response){
        console.log("login success: ", response);
        // 本地存储，
        bd_kfe_data.passport.token = response;
        // 本地存储
        localStorage.bd_kfe_username = bd_kfe_data.username;
        localStorage.bd_kfe_password = bd_kfe_data.password;
        localStorage.bd_kfe_subDomain = bd_kfe_data.subDomain;
        // localStorage 存储
        localStorage.setItem(bd_kfe_data.token, JSON.stringify(response));
        // 建立长连接
        bd_kfe_stompapi.byteDeskConnect();
      },
      error: function(error) {
        //Do Something to handle error
        console.log(error);
      }
    });
  },
  /**
   * 获取设备指纹
   */
  fingerPrint2: function () {
    // new Fingerprint2({
    //   preprocessor(key, value) {
    //     if (key == "user_agent") {
    //       // http://github.com/faisalman/ua-parser-js
    //       var parser = new UAParser(value);
    //       var result = JSON.stringify(parser.getResult());
    //       console.log(result);
    //       return result;
    //     } else {
    //       return value;
    //     }
    //   }
    // }).get(function (result, components) {
    //   // console.log(result); //a hash, representing your device fingerprint
    //   // console.log(components); // an array of FP components
    //   var params = new URLSearchParams();
    //   params.append("hash", result);
    //   for (var index in components) {
    //     var obj = components[index];
    //     var key = obj.key;
    //     var value = obj.value;
    //     params.append(key, value.toString());
    //   }
    //   $.ajax({
    //     url: bd_kfe_data.HTTP_HOST +
    //     "/api/fingerprint2/browser?access_token=" +
    //     bd_kfe_data.passport.token.access_token,
    //     type: "post",
    //     data: params,
    //     success:function(response){
    //       console.log("fingerprint2: ", response);
    //     },
    //     error: function(error) {
    //       //Do Something to handle error
    //       console.log(error);
    //     }
    //   });
    // });
  },
  /**
   * 通知服务器，访客浏览网页中
   * TODO: 修改为POST请求方式
   */
  browse: function () {
    //
    var keywords = document.getElementsByName("keywords")[0].content;
    var description = document.getElementsByName("description")[0].content;
    var url = window.location.href;
    url = url.endsWith("#") ? url.substring(0, url.length - 1) : url;
    //
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/browse/notify?access_token=" +
      bd_kfe_data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        adminUid: bd_kfe_data.adminUid,
        workGroupWid: bd_kfe_data.workGroupWid,
        client: bd_kfe_data.client,
        sessionId: bd_kfe_data.sessionId,
        referrer: encodeURI(document.referrer),
        url: encodeURI(url),
        title: encodeURI(document.title),
        keywords: encodeURI(keywords),
        description: encodeURI(description)
      }),
      success:function(response){
        console.log("browse invite accept:", response.data);
      },
      error: function(error) {
        //Do Something to handle error
        console.log(error);
      }
    });
  },
  acceptInviteBrowse: function () {
    //
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/browse/invite/accept?access_token=" +
      bd_kfe_data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        biid: bd_kfe_data.browseInviteBIid,
        client: bd_kfe_data.client
      }),
      success:function(response){
        console.log("browse invite accept:", response.data);
      },
      error: function(error) {
        //Do Something to handle error
        console.log(error);
      }
    });
  },
  rejectInviteBrowse: function () {
    //
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/browse/invite/reject?access_token=" +
      bd_kfe_data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        biid: bd_kfe_data.browseInviteBIid,
          client: bd_kfe_data.client
      }),
      success:function(response){
        console.log("browse invite reject:", response.data);
      },
      error: function(error) {
        console.log(error);
      }
    });
  },
  /**
   * 断开重连之后更新session id
   */
  updateSessionId: function () {
    // console.log('session id:', bd_kfe_data.sessionId, ' pre session id:', bd_kfe_data.preSessionId);
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/browse/update/sessionId?access_token=" +
      bd_kfe_data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        sessionId: bd_kfe_data.sessionId,
        preSessionId: bd_kfe_data.preSessionId
      }),
      success:function(response){
        console.log("update session id:", response.data);
      },
      error: function(error) {
        console.log(error);
      }
    });
  },
  /**
   * @api {get} /api/thread/request 请求会话
   * @apiName requestThread
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} wId 工作组唯一wid
   * @apiParam {String} type 区分工作组会话 'workGroup'、指定坐席会话 'appointed'
   * @apiParam {String} aId 指定客服uid, 只有当type === 'appointed'时有效
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 请求会话
   *
   * @apiUse ResponseResultSuccess
   */
  requestThread: function () {
    console.log('start request thread')
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/thread/request",
      contentType: "application/json; charset=utf-8",
      type: "get",
      data: {
        access_token: bd_kfe_data.passport.token.access_token,
        wId: bd_kfe_data.workGroupWid,
        type: bd_kfe_data.type,
        aId: bd_kfe_data.agentUid,
        client: bd_kfe_data.client
      },
      success:function(response){
        console.log("message:", response);
        var message = response.data;
        if (response.status_code === 200) {
          //
          bd_kfe_utils.pushToMessageArray(message);
          // 1. 保存thread
          bd_kfe_data.thread = message.thread;
          // 3. 加载聊天记录
          // bd_kfe_httpapi.loadMoreMessages();
          // 4. 设置窗口左上角标题
          if (bd_kfe_data.thread.appointed) {
            bd_kfe_data.title = bd_kfe_data.thread.agent.nickname;
          } else {
            bd_kfe_data.title = bd_kfe_data.thread.workGroup.nickname;
          }
          //
          $('#byteDesk-agent-avatar').attr('src', bd_kfe_data.thread.agent.avatar)
          $('#byteDesk-agent-nickname').text(bd_kfe_data.thread.agent.nickname)
          $('#byteDesk-agent-description').text(bd_kfe_data.thread.agent.description)
        } else if (response.status_code === 201) {
          message.content = "继续之前会话";
          bd_kfe_utils.pushToMessageArray(message);
          // 1. 保存thread
          bd_kfe_data.thread = message.thread;
          // 3. 加载聊天记录
          // bd_kfe_httpapi.loadMoreMessages();
          // 4. 头像、标题、描述
          if (bd_kfe_data.thread.appointed) {
            bd_kfe_data.title = bd_kfe_data.thread.agent.nickname;
          } else {
            bd_kfe_data.title = bd_kfe_data.thread.workGroup.nickname;
          }
          //
          $('#byteDesk-agent-avatar').attr('src', bd_kfe_data.thread.agent.avatar)
          $('#byteDesk-agent-nickname').text(bd_kfe_data.thread.agent.nickname)
          $('#byteDesk-agent-description').text(bd_kfe_data.thread.agent.description)
        } else if (response.status_code === 202) {
          // 排队
          bd_kfe_utils.pushToMessageArray(message);
          // 1. 保存thread
          bd_kfe_data.thread = message.thread;
        } else if (response.status_code === 203) {
          // 当前非工作时间，请自助查询或留言
          bd_kfe_utils.pushToMessageArray(message);
          // 1. 保存thread
          bd_kfe_data.thread = message.thread;
          // 4. 设置窗口左上角标题
          if (bd_kfe_data.thread.appointed) {
            bd_kfe_data.title = bd_kfe_data.thread.agent.nickname;
          } else {
            bd_kfe_data.title = bd_kfe_data.thread.workGroup.nickname;
          }
        } else if (response.status_code === 204) {
          // 当前无客服在线，请自助查询或留言
          bd_kfe_utils.pushToMessageArray(message);
          // 1. 保存thread
          bd_kfe_data.thread = message.thread;
          // 4. 设置窗口左上角标题
          if (bd_kfe_data.thread.appointed) {
            bd_kfe_data.title = bd_kfe_data.thread.agent.nickname;
          } else {
            bd_kfe_data.title = bd_kfe_data.thread.workGroup.nickname;
          }
          // TODO: 显示留言界面
          // bd_kfe_utils.switchLeaveMessage();
        } else if (response.status_code === 205) {
          // 插入业务路由，相当于咨询前提问问卷（选择 或 填写表单）
          bd_kfe_utils.pushToMessageArray(message);
          // 1. 保存thread
          bd_kfe_data.thread = message.thread;
        } else if (response.status_code === -1) {
          bd_kfe_httpapi.login();
        } else if (response.status_code === -2) {
          // sid 或 wid 错误
          alert("siteId或者工作组id错误");
        } else if (response.status_code === -3) {
          alert("您已经被禁言");
        }
        bd_kfe_utils.scrollToBottom();
        // 建立长连接
        // bd_kfe_stompapi.byteDeskConnect();
        // 订阅会话消息，处理断开重连的情况
        if (
          bd_kfe_data.thread.tid !== null &&
          bd_kfe_data.thread.tid !== undefined &&
          bd_kfe_data.thread.tid !== ""
        ) {
          bd_kfe_stompapi.subscribeTopic(bd_kfe_data.threadTopic());
        }
      },
      error: function(error) {
        console.log(error);
      }
    });
    // 请求指纹
    bd_kfe_httpapi.fingerPrint2();
  },
  /**
   * @api {get} /api/answer/init 请求机器人问答
   * @apiName requestRobot
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} wId 工作组唯一wid
   * @apiParam {String} type 区分工作组会话 'workGroup'、指定坐席会话 'appointed'
   * @apiParam {String} aId 指定客服uid, 只有当type === 'appointed'时有效
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 加载常见问题
   *
   * @apiUse ResponseResultSuccess
   */
  requestRobot: function () {
    console.log("自助答疑");
    bd_kfe_httpapi.initAnswer();
  },
  /**
   * @api {get} /api/rate/do 满意度评价
   * @apiName rate
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uId 管理员uid
   * @apiParam {String} wId 工作组唯一wid
   * @apiParam {String} type 区分工作组会话 'workGroup'、指定坐席会话 'appointed'
   * @apiParam {String} aId 指定客服uid, 只有当type === 'appointed'时有效
   * @apiParam {String} tid 会话tid
   * @apiParam {String} score 分数
   * @apiParam {String} note 备注
   * @apiParam {String} invite 是否邀请评价
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 满意度评价
   *
   * @apiUse ResponseResultSuccess
   */
  rate: function () {
    // 隐藏满意度评价dialog
    bd_kfe_data.rateDialogVisible = false;
    // 判断是否已经评价过，避免重复评价
    if (bd_kfe_data.isRated) {
      alert("不能重复评价");
      return;
    }
    bd_kfe_data.rateContent = $("#suggestcontent").val();
    //
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/rate/do?access_token=" +
      bd_kfe_data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        uid: bd_kfe_data.adminUid,
        wid: bd_kfe_data.workGroupWid,
        aid: bd_kfe_data.agentUid,
        type: bd_kfe_data.type,
        tid: bd_kfe_data.thread.tid,
        score: bd_kfe_data.rateScore + "", // 考虑到兼容ios客户端，需要转换为字符串
        note: bd_kfe_data.rateContent,
        invite: bd_kfe_data.isInviteRate ? "1" : "0", // 考虑到兼容ios客户端，需要转换为字符串
        client: bd_kfe_data.client
      }),
      success:function(response){
        console.log("rate: ", response.data);
        bd_kfe_data.isRated = true;
        //
        if (response.status_code === 200) {
          alert("评价成功");
          $("#byteDesk-chat").show();
          $("#byteDesk-rate").hide();
        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log(error);
        alert(error);
      }
    });
  },
  /**
   * @api {get} /api/thread/visitor/close 关闭当前窗口
   * @apiName closeWebPage
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} tid 会话tid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 关闭当前窗口
   *
   * @apiUse ResponseResultSuccess
   */
  closeWebPage: function () {
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/thread/visitor/close?access_token=" +
      bd_kfe_data.passport.token.access_token,
      type: "post",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({
        tid: bd_kfe_data.thread.tid,
        client: bd_kfe_data.client
      }),
      success:function(response){
        console.log("close thread: ", response.data);
        // 关闭当前窗口
        if (navigator.userAgent.indexOf("MSIE") > 0) {
          if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null;
            window.close();
          } else {
            window.open("", "_top");
            window.top.close();
          }
        } else if (navigator.userAgent.indexOf("Firefox") > 0) {
          window.location.href = "about:blank ";
          window.opener = null;
          window.open("", "_self", "");
          window.close();
        } else {
          window.opener = null;
          window.open("", "_self", "");
          window.close();
        }
      },
      error: function(error) {
        console.log(error);
        alert(error);
      }
    });
  },
  /**
   * @api {get} /api/messages/user 加载更多聊天记录
   * @apiName loadMoreMessages
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} wId 工作组唯一wid
   * @apiParam {String} type 区分工作组会话 'workGroup'、指定坐席会话 'appointed'
   * @apiParam {String} aId 指定客服uid, 只有当type === 'appointed'时有效
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 加载更多聊天记录
   * TODO: 访客端暂时不开放聊天记录
   *
   * @apiUse ResponseResultSuccess
   */
  loadMoreMessages: function () {
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/messages/user?access_token=" +
      bd_kfe_data.passport.token.access_token,
      type: "get",
      data: {
        uid: bd_kfe_data.uid,
        page: bd_kfe_data.page,
        size: 100,
        client: bd_kfe_data.client
      },
      success:function(response){
        console.log(response.data);
        if (response.status_code === 200) {
          //
          for (var i = 0; i < response.data.content.length; i++) {
            var message = response.data.content[i];
            //
            var contains = false;
            for (var j = 0; j < bd_kfe_data.messages.length; j++) {
              var msg = bd_kfe_data.messages[j];
              if (msg.id === message.id) {
                contains = true;
              }
            }
            if (!contains) {
              bd_kfe_data.messages.push(message);
            }
          }
          bd_kfe_utils.scrollToBottom();
        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log(error);
        alert(error);
      }
    });
  },
  /**
   * @api {get} /api/answer/init 加载常见问题
   * @apiName initAnswer
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} wId 工作组唯一wid
   * @apiParam {String} type 区分工作组会话 'workGroup'、指定坐席会话 'appointed'
   * @apiParam {String} aId 指定客服uid, 只有当type === 'appointed'时有效
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 加载常见问题
   *
   * @apiUse ResponseResultSuccess
   */
  initAnswer: function () {
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/answer/init?access_token=" +
      bd_kfe_data.passport.token.access_token,
      type: "get",
      data: {
        uid: bd_kfe_data.adminUid,
        tid: bd_kfe_data.thread.tid,
        client: bd_kfe_data.client
      },
      success:function(response){
        console.log("query answer success:", response.data);
        if (response.status_code === 200) {
          //
          var queryMessage = response.data;
          //
          bd_kfe_utils.pushToMessageArray(queryMessage);
          bd_kfe_utils.scrollToBottom();
        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log("query answers error:", error);
      }
    });
  },
  /**
   * @api {get} /api/answer/top 获取热门问题
   * @apiName getTopAnswers
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 工作组唯一wid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 获取热门问题
   *
   * @apiUse ResponseResultSuccess
   */
  getTopAnswers: function () {
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/answer/top?access_token=" +
      bd_kfe_data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      type: "get",
      data: {
        uid: bd_kfe_data.adminUid,
        client: bd_kfe_data.client
      },
      success:function(response){
        console.log("fetch answers success:", response.data);
        if (response.status_code === 200) {
          bd_kfe_data.answers = response.data;
          bd_kfe_utils.pushAnswers(bd_kfe_data.answers.content);
        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log("fetch answers error:", error);
      }
    });
  },
  /**
   * @api {get} /api/answer/query 根据问题qid请求智能问答答案
   * @apiName getAnswer
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 管理员uid
   * @apiParam {String} tid 会话tid
   * @apiParam {String} aId 问题aid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 请求会话
   *
   * @apiUse ResponseResultSuccess
   */
  getAnswer: function (aid) {
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/answer/query?access_token=" +
      bd_kfe_data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      type: "get",
      data: {
        uid: bd_kfe_data.adminUid,
        tid: bd_kfe_data.thread.tid,
        aid: aid,
        client: bd_kfe_data.client
      },
      success:function(response){
        console.log("query answer success:", response.data);
        if (response.status_code === 200) {
          //
          var queryMessage = response.data.query;
          var replyMessage = response.data.reply;
          //
          bd_kfe_utils.pushToMessageArray(queryMessage);
          bd_kfe_utils.pushToMessageArray(replyMessage);
          bd_kfe_utils.scrollToBottom();
        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log("query answers error:", error);
      }
    });
  },
  /**
   * @api {get} /api/answer/message 输入内容，请求智能答案
   * @apiName messageAnswer
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 管理员uid
   * @apiParam {String} tid 会话tid
   * @apiParam {String} content 内容
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 输入内容，请求智能答案
   *
   * @apiUse ResponseResultSuccess
   */
  messageAnswer: function (content) {
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/answer/message?access_token=" +
      bd_kfe_data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      type: "get",
      data: {
        uid: bd_kfe_data.adminUid,
        tid: bd_kfe_data.thread.tid,
        content: content,
        client: bd_kfe_data.client
      },
      success:function(response){
        console.log("query answer success:", response.data);
        if (
          response.status_code === 200 ||
          response.status_code === 201
        ) {
          //
          var queryMessage = response.data.query;
          var replyMessage = response.data.reply;
          //
          bd_kfe_utils.pushToMessageArray(queryMessage);
          bd_kfe_utils.pushToMessageArray(replyMessage);
          bd_kfe_utils.scrollToBottom();
        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log("query answers error:", error);
      }
    });
  },
  /**
   * @api {post} /api/thread/request 评价智能问答结果(TODO，未上线)
   * @apiName rateAnswer
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 管理员uid
   * @apiParam {String} aId 指定客服uid, 只有当type === 'appointed'时有效
   * @apiParam {String} rate 是否有用
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 评价智能问答结果，是否有用
   *
   * @apiUse ResponseResultSuccess
   */
  rateAnswer: function (rate) {
    //
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/answer/rate?access_token=" +
      bd_kfe_data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        uid: bd_kfe_data.adminUid,
        aid: bd_kfe_data.aid,
        rate: rate,
        client: bd_kfe_data.client
      }),
      success:function(response){
        console.log("success:", response.data);
        if (response.status_code === 200) {
          //
        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log("query answers error:", error);
      }
    });
  },
  /**
   * @api {post} /api/leavemsg/save 留言
   * @apiName leaveMessage
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} wId 工作组唯一wid
   * @apiParam {String} aId 指定客服uid, 只有当type === 'appointed'时有效 
   * @apiParam {String} type 区分工作组会话 'workGroup'、指定坐席会话 'appointed'
   * @apiParam {String} mobile 手机
   * @apiParam {String} email 邮箱
   * @apiParam {String} content 留言内容
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 留言
   *
   * @apiUse ResponseResultSuccess
   */
  leaveMessage: function () {
    var mobile = $("#leavemsgmobile").val();
    var email = $("#leavemsgemail").val();
    var content = $("#leavemsgcontent").val();
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/leavemsg/save?access_token=" +
      bd_kfe_data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        uid: bd_kfe_data.adminUid,
        wid: bd_kfe_data.workGroupWid,
        aid: bd_kfe_data.agentUid,
        type: bd_kfe_data.type,
        mobile: mobile,
        email: email,
        content: content,
        client: bd_kfe_data.client
      }),
      success:function(response){
        console.log("leave message: ", response.data);
        if (response.status_code === 200) {
          alert("留言成功");
          $("#byteDesk-chat").show();
          $("#byteDesk-leave").hide();
        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log(error);
        alert("留言失败");
      }
    });
  },
  /**
   * @api {get} /api/thread/questionnaire 选择问卷答案
   * @apiName chooseQuestionnaire
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} tId 会话唯一tid
   * @apiParam {String} itemQid 选择qid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 选择问卷答案
   *
   * @apiUse ResponseResultSuccess
   */
  chooseQuestionnaire: function (itemQid) {
    console.log("choose questionnaire: " + itemQid);
    // 只允许同时进行一个会话
    if (bd_kfe_data.isThreadStarted) {
      alert("不能重复请求");
      return;
    }
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/thread/questionnaire?access_token=" +
      bd_kfe_data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      type: "get",
      data: {
        tId: bd_kfe_data.thread.tid,
        itemQid: itemQid,
        client: bd_kfe_data.client
      },
      success:function(response){
        console.log("choose questionnaire success:", response.data);
        if (
          response.status_code === 200 ||
          response.status_code === 201
        ) {
          //
          var message = response.data;
          // 添加消息
          bd_kfe_utils.pushToMessageArray(message);
          // 滚动到底部
          bd_kfe_utils.scrollToBottom();
        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log("choose questionnaire error:", error);
      }
    });
  },
  /**
   * @api {get} /api/thread/country 选择要留学国家
   * @apiName chooseCountry
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} companyCid 公司cid
   * @apiParam {String} countryCid 国家cid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 选择要留学国家
   *
   * @apiUse ResponseResultSuccess
   */
  chooseCountry: function (companyCid, countryCid) {
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/thread/country?access_token=" +
      bd_kfe_data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      type: "get",
      data: {
        tId: bd_kfe_data.thread.tid,
        companyCid: companyCid,
        countryCid: countryCid,
        client: bd_kfe_data.client
      },
      success:function(response){
        console.log("choose country success:", response.data);
        if (
          response.status_code === 200 ||
          response.status_code === 201
        ) {
          //
          var message = response.data;
          // 添加消息
          bd_kfe_utils.pushToMessageArray(message);
          // 滚动到底部
          bd_kfe_utils.scrollToBottom();
        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log("choose country error:", error);
      }
    });
  },
  /**
   * @api {get} /api/thread/choose/workGroup 选择工作组
   * @apiName chooseWorkGroup
   * @apiGroup User
   * @apiVersion 1.4.7
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} wId 工作组唯一wid
   * @apiParam {String} tId 当前会话tid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 选择工作组
   *
   * @apiUse ResponseResultSuccess
   */
  chooseWorkGroup: function (wId) {
    console.log("choose workgroup:", wId);
    // 只允许同时进行一个会话
    if (bd_kfe_data.isThreadStarted) {
      alert("不能重复请求");
      return;
    }
    $.ajax({
      url: bd_kfe_data.HTTP_HOST +
      "/api/thread/choose/workGroup?access_token=" +
      bd_kfe_data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      type: "get",
      data: {
        tId: bd_kfe_data.thread.tid,
        wId: wId,
        client: bd_kfe_data.client
      },
      success:function(response){
        console.log("choose workGroup success:", response.data);
        var message = response.data;
        if (response.status_code === 200) {
          //
          bd_kfe_utils.pushToMessageArray(message);
          // 1. 保存thread
          bd_kfe_data.thread = message.thread;
          // 2. 订阅会话消息
          bd_kfe_stompapi.subscribeTopic(bd_kfe_data.threadTopic());
          // 3. 加载聊天记录
          bd_kfe_httpapi.loadMoreMessages();
          // 4. 头像、标题、描述
          if (bd_kfe_data.thread.appointed) {
            bd_kfe_data.title = bd_kfe_data.thread.agent.nickname;
          } else {
            bd_kfe_data.title = bd_kfe_data.thread.workGroup.nickname;
          }
          // 防止重复点击
          bd_kfe_data.isThreadStarted = true;
        } else if (response.status_code === 201) {
          // message.content = '继续之前会话';
          bd_kfe_utils.pushToMessageArray(message);
          // 1. 保存thread
          bd_kfe_data.thread = message.thread;
          // 2. 订阅会话消息
          bd_kfe_stompapi.subscribeTopic(bd_kfe_data.threadTopic());
          // 3. 加载聊天记录
          bd_kfe_httpapi.loadMoreMessages();
          // 4. 头像、标题、描述
          if (bd_kfe_data.thread.appointed) {
            bd_kfe_data.title = bd_kfe_data.thread.agent.nickname;
          } else {
            bd_kfe_data.title = bd_kfe_data.thread.workGroup.nickname;
          }
          // 防止重复点击
          bd_kfe_data.isThreadStarted = true;
        } else if (response.status_code === 202) {
          // 排队
          bd_kfe_utils.pushToMessageArray(message);
          // 1. 保存thread
          bd_kfe_data.thread = message.thread;
          // 防止重复点击
          bd_kfe_data.isThreadStarted = true;
        } else if (response.status_code === 203) {
          // 当前非工作时间，请自助查询或留言
          bd_kfe_utils.pushToMessageArray(message);
          // 1. 保存thread
          bd_kfe_data.thread = message.thread;
        } else if (response.status_code === 204) {
          // 当前无客服在线，请自助查询或留言
          bd_kfe_utils.pushToMessageArray(message);
          // 1. 保存thread
          bd_kfe_data.thread = message.thread;
        } else if (response.status_code === 205) {
          // 插入业务路由，相当于咨询前提问问卷（选择 或 填写表单）
          bd_kfe_utils.pushToMessageArray(message);
          // 1. 保存thread
          bd_kfe_data.thread = message.thread;
        } else if (response.status_code === -1) {
          // access token invalid
          bd_kfe_httpapi.login();
        } else if (response.status_code === -2) {
          // sid 或 wid 错误
          alert("siteId或者工作组id错误");
        } else if (response.status_code === -3) {
          alert("您已经被禁言");
        }
        //
        bd_kfe_utils.scrollToBottom();
      },
      error: function(error) {
        console.log("choose workGroup error:", error);
      }
    });
  }
};

