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
 * @apiDefine Social 社交
 *
 * 社交关系相关接口
 */
/**
 * @apiDefine Thread 会话
 *
 * 会话相关接口
 */
/**
 * @apiDefine Message 消息
 *
 * 消息相关接口
 */
/**
 * @apiDefine SubDomainClientParam
 * @apiParam {String} subDomain 企业号，测试可填写 'vip'，上线请填写真实企业号
 * @apiParam {String} client 固定写死为 'web'
 */
/**
 * @apiDefine PageSizeClientParam
 * @apiParam {String} page 起始页面，首页为: 0
 * @apiParam {String} size 每页消息条数，如: 20
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
var httpapi = {
  /**
   * @api {post} /visitor/api/register/user 注册
   * @apiName register
   * @apiGroup User
   * @apiVersion 1.5.6
   * @apiPermission none
   * 
   * @apiParam {String} username 用户名
   * @apiParam {String} nickname 昵称
   * @apiParam {String} password 密码
   * @apiUse SubDomainClientParam
   * 
   * @apiDescription httpapi.register('my_test_im', '昵称mytest', '123456', 'vip');
   *
   * @apiUse UserResultSuccess
   */
  register: function(username, nickname, password, subDomain) {
    //
    $.ajax({
      url: data.HTTP_HOST + "/visitor/api/register/user",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        username: username,
        nickname: nickname,
        password: password,
        subDomain: subDomain,
        client: data.client
      }),
      success:function(response) {
        console.log("register:", response.data);
      },
      error: function(error) {
        console.log(error);
      }
    });
  },
  /**
   * @api {post} /visitor/api/register/user/uid 自定义用户名生成访客账号, 自定义uid
   * @apiName registerUserUid
   * @apiGroup User
   * @apiVersion 1.5.6
   * @apiPermission none
   * 
   * @apiParam {String} username 用户名
   * @apiParam {String} nickname 昵称
   * @apiParam {String} avatar 头像
   * @apiParam {String} uid 用户唯一标示
   * @apiParam {String} password 密码
   * @apiUse SubDomainClientParam
   * 
   * @apiDescription 开发者在需要跟自己业务系统账号对接的情况下，
   * 可以通过自定义用户名生成访客账号
   *
   * @apiUse UserResultSuccess
   */
  registerUid: function (username, nickname, avatar, uid, password) {
    //
    $.ajax({
      url: data.HTTP_HOST + "/visitor/api/register/user/uid",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({ 
        username: username,
        nickname: nickname,
        avatar: avatar,
        uid: uid,
        password: password,
        subDomain: data.subDomain,
        client: data.client
      }),
      success:function(response){
        // 登录
        data.uid = response.data.uid;
        data.username = response.data.username;
        data.password = data.username;
        data.nickname = response.data.nickname;
        // 本地存储
        localStorage.uid = data.uid;
        localStorage.username = data.username;
        localStorage.password = data.password;
        // 登录
        httpapi.login();
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
   * @apiVersion 1.5.6
   * @apiPermission none
   * 
   * @apiHeader {String} Authorization 值固定写死为: 'Basic Y2xpZW50OnNlY3JldA=='
   * 
   * @apiParam {String} username 用户名
   * @apiParam {String} password 密码
   * @apiParam {String} subDomain 企业号
   * 
   * @apiDescription 函数内部实际调用doLogin函数
   * 测试用户：
   * 用户名：test1、test2、...., test15
   * 密码：123456
   * 企业号：vip
   *
   * @apiSuccess {String} access_token 访问令牌
   * @apiSuccess {Number} expires_in 过期时间
   * @apiSuccess {String} jti
   * @apiSuccess {String} refresh_token 刷新令牌
   * @apiSuccess {String} scope 固定值：'all'
   * @apiSuccess {String} token_type 固定值：'bearer'
   */
  login: function () {
    //
    var subDomain = $("#subdomain").val();
    var username = $("#username").val();
    var password = $("#password").val();
    //
    data.username = username + "@" + subDomain;
    data.password = password;
    data.subDomain = subDomain;
    //
    httpapi.doLogin();
  },
  /**
   * @api {post} /oauth/token 调用授权接口
   * @apiName doLogin
   * @apiGroup User
   * @apiVersion 1.5.6
   * @apiPermission none
   * 
   * @apiHeader {String} Authorization 值固定写死为: 'Basic Y2xpZW50OnNlY3JldA=='
   * 
   * @apiParam {String} username 用户名
   * @apiParam {String} password 密码
   * @apiParam {String} subDomain 企业号
   * 
   * @apiDescription 测试用户：
   * 用户名：test1、test2、...., test15
   * 密码：123456
   * 企业号：vip
   *
   * @apiSuccess {String} access_token 访问令牌
   * @apiSuccess {Number} expires_in 过期时间
   * @apiSuccess {String} jti
   * @apiSuccess {String} refresh_token 刷新令牌
   * @apiSuccess {String} scope 固定值：'all'
   * @apiSuccess {String} token_type 固定值：'bearer'
   */
  doLogin: function () {
    console.log('do login: ', data.username, data.password);
    //
    $.ajax({
      url: data.HTTP_HOST + "/oauth/token",
      type: "post",
      data: { 
        "username": data.username,
        "password": data.password,
        "grant_type": "password",
        "scope": "all"
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Basic Y2xpZW50OnNlY3JldA==');
      },
      success:function(response){
        console.log("login success: ", response);
        // 本地存储，
        data.passport.token = response;
        // 本地存储
        localStorage.username = data.username;
        localStorage.password = data.password;
        localStorage.subDomain = data.subDomain;
        // localStorage 存储
        localStorage.setItem(data.token, JSON.stringify(response));
        // TODO: 显示聊天窗口, 暂未启用
        utils.switchChat();
        // 初始化加载基本信息
        httpapi.init();
      },
      error: function(error) {
        console.log(error);
      }
    });
  },

  /**
   * @api {get} /api/user/init 初始化加载基本信息
   * @apiName init
   * @apiGroup User
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} username 用户名
   * @apiParam {String} password 密码
   * @apiParam {String} subDomain 企业号
   * 
   * @apiDescription 初始化加载基本信息: 
   * 1. 用户个人资料；
   * 2. 联系人；
   * 3.群组等
   *
   * @apiUse ResponseResultSuccess
   */
  init: function() {
    console.log("init");
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/init?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        client: data.client
      },
      success:function(response){
        console.log(response.data);
        // 用户信息
        var info = response.data.info
        utils.storeUserinfo(info);

        // 全部联系人
        var contacts = response.data.contacts
        // 本地存储
        utils.storeFriends(contacts);
        // 界面显示
        utils.appendTestUsers(contacts);

        // 群组
        var groups = response.data.groups
        utils.storeGroups(groups);

        // 用户工作组
        var workGroups = response.data.workGroups
        utils.storeWorkGroups(workGroups);

        // 用户会话
        var agentThreads = response.data.agentThreads
        utils.storeThreads(agentThreads);

        // 联系人会话
        var contactThreads = response.data.contactThreads
        utils.storeThreads(contactThreads);

        // 群组会话
        var groupThreads = response.data.groupThreads
        utils.storeGroups(groupThreads);

        // 排队
        var queues = response.data.queues
        utils.storeQueues(queues);

        // 建立长连接
        stompapi.byteDeskConnect()
      },
      error: function(xhr, textStatus, errorThrown){
        console.log(xhr, textStatus, errorThrown)
    　　if (xhr.status == 401) {
    　　　　console.log('is 401');
      　} else{
          console.log('other error')
    　　 }
  　　}
    });
  },

  /**
   * @api {get} /api/user/profile 加载用户个人资料
   * @apiName userProfile
   * @apiGroup User
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * 
   * @apiDescription 加载用户个人资料
   *
   * @apiUse ResponseResultSuccess
   */
  userProfile: function() {
    console.log("userProfile");
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/profile?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        client: data.client
      },
      success:function(response){
        console.log(response.data);
      },
      error: function(xhr, textStatus, errorThrown){
        console.log(xhr, textStatus, errorThrown)
    　　if (xhr.status == 401) {
    　　　　console.log('is 401');
      　} else{
          console.log('other error')
    　　 }
  　　}
    });
  },

  /**
   * @api {get} /api/user/detail 加载用户个人资料
   * @apiName userDetail
   * @apiGroup User
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 对方uid
   * 
   * @apiDescription 加载用户个人资料
   *
   * @apiUse ResponseResultSuccess
   */
  userDetail: function(uid) {
    console.log("userDetail");
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/detail?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        uid: uid,
        client: data.client
      },
      success:function(response){
        console.log(response.data);
      },
      error: function(xhr, textStatus, errorThrown){
        console.log(xhr, textStatus, errorThrown)
    　　if (xhr.status == 401) {
    　　　　console.log('is 401');
      　} else{
          console.log('other error')
    　　 }
  　　}
    });
  },

  /**
   * @api {post} /api/user/logout 退出登录
   * @apiName logout
   * @apiGroup User
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 退出登录
   *
   * @apiUse ResponseResultSuccess
   */
  logout: function() {
    //
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/logout?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        client: data.client
      }),
      success:function(response){
        console.log("logout:", response.data);
        // 清空本地缓存
        localStorage.removeItem('access_token')
      },
      error: function(error) {
        console.log(error);
      }
    });
  },

  /**
   * @api {post} /api/user/nickname 设置、修改用户昵称
   * @apiName setNickname
   * @apiGroup User
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} nickname 用户新昵称
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 设置、修改用户昵称
   *
   * @apiUse ResponseResultSuccess
   */
  setNickname: function(nickname) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/nickname?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        nickname: nickname,
        client: data.client
      }),
      success:function(response){
        console.log("set nickname success: ", response);
      },
      error: function(error) {
        console.log("set nickname error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/user/avatar 设置、修改用户头像
   * @apiName setAvatar
   * @apiGroup User
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} avatar 用户新头像
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 设置、修改用户头像
   *
   * @apiUse ResponseResultSuccess
   */
  setAvatar: function(avatar) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/avatar?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        avatar: avatar,
        client: data.client
      }),
      success:function(response){
        console.log("set avatar success: ", response);
      },
      error: function(error) {
        console.log("set avatar error: ", error);
      }
    });
  },

  /**
   * @api {get} /api/messages/user 加载客服会话访客聊天记录
   * @apiName getMessages
   * @apiGroup User
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 访客uid
   * @apiUse PageSizeClientParam
   * 
   * @apiDescription 加载客服会话访客聊天记录
   *
   * @apiUse ResponseResultSuccess
   */
  getMessages: function(uid, page, size) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/messages/user?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        uid: uid,
        page: page,
        size: size,
        client: data.client
      },
      success:function(response){
        console.log("get user messages success:", response);
      },
      error: function(error) {
        console.log("get user messages error:", error);
      }
    });
  },

  /**
   * @api {get} /api/messages/contact 加载单聊聊天记录
   * @apiName getContactMessages
   * @apiGroup User
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} cid 联系人uid
   * @apiUse PageSizeClientParam
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 加载单聊聊天记录
   *
   * @apiUse ResponseResultSuccess
   */
  getContactMessages: function(cid, page, size) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/messages/contact?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        cid: cid,
        page: page,
        size: size,
        client: data.client
      },
      success:function(response){
        console.log("get contacts messages success:", response);
      },
      error: function(error) {
        console.log("get contacts messages error:", error);
      }
    });
  },

  /**
   * @api {get} /api/messages/group 加载群组聊天记录
   * @apiName getGroupMessages
   * @apiGroup User
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} gid 群组gid
   * @apiUse PageSizeClientParam
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 加载群组聊天记录
   *
   * @apiUse ResponseResultSuccess
   */
  getGroupMessages: function(gid, page, size) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/messages/group?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        gid: gid,
        page: page,
        size: size,
        client: data.client
      },
      success:function(response){
        console.log("get group messages success:", response);
      },
      error: function(error) {
        console.log("get group messages error:", error);
      }
    });
  },

  /**
   * @api {get} /api/user/contacts 获取客服全部联系人
   * @apiName getContacts
   * @apiGroup User
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 获取客服全部联系人
   *
   * @apiUse ResponseResultSuccess
   */
  getContacts: function() {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/contacts?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        client: data.client
      },
      success:function(response){
        console.log("get contacts success:", response);
        var contacts = response.data
        // 界面显示
        utils.appendTestUsers(contacts);
      },
      error: function(error) {
        console.log("get contacts error:", error);
      }
    });
  },

  /**
   * @api {get} /api/user/contacts 获取全部群组
   * @apiName getGroups
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 获取全部群组
   *
   * @apiUse ResponseResultSuccess
   */
  getGroups: function() {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/get?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        client: data.client
      },
      success:function(response){
        console.log("get groups success:", response);
        var groups = response.data;
        utils.appendGroups(groups);
      },
      error: function(error) {
        console.log("get groups error:", error);
      }
    });
  },

  /**
   * @api {get} /api/group/detail 获取群组详情
   * @apiName getGroupDetail
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} gid 群组唯一gid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 获取群组详情
   *
   * @apiUse ResponseResultSuccess
   */
  getGroupDetail: function(gid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/detail?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        gid: gid,
        client: data.client
      },
      success:function(response){
        console.log("get group detail success:", response);
      },
      error: function(error) {
        console.log("get group detail error:", error);
      }
    });
  },

  /**
   * @api {get} /api/group/members 获取群组全部成员
   * @apiName getContacts
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} gid 群组唯一gid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 获取群组全部成员
   *
   * @apiUse ResponseResultSuccess
   */
  getGroupMembers: function(gid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/members?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        gid: gid,
        client: data.client
      },
      success:function(response){
        console.log("get group detail success:", response);
      },
      error: function(error) {
        console.log("get group detail error:", error);
      }
    });
  },

  /**
   * @api {post} /api/group/create 创建群组
   * @apiName createGroup
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} nickname 群组昵称
   * @apiParam {String} type 群组类型
   * @apiParam {String} selectedContacts 群组成员uid数组，如 [1111, 2222, 3333]
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 创建群组
   *
   * @apiUse ResponseResultSuccess
   */
  createGroup: function(nickname, type, selectedContacts) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/create?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        nickname: nickname,
        type: type,
        selectedContacts: selectedContacts,
        client: data.client
      }),
      success:function(response){
        console.log("create group success: ", response);
      },
      error: function(error) {
        console.log("create group error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/update/nickname 更新群组: 群名称等
   * @apiName updateGroupNickname
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} gid 群组唯一gid
   * @apiParam {String} nickname 群组新昵称
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 更新群组: 群名称等
   *
   * @apiUse ResponseResultSuccess
   */
  updateGroupNickname: function(gid, nickname) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/update/nickname?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        gid: gid,
        nickname: nickname,
        client: data.client
      }),
      success:function(response){
        console.log("update group nickname success: ", response);
      },
      error: function(error) {
        console.log("update group nickname error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/create 更新群组公告
   * @apiName updateGroupAnnouncement
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} gid 群组唯一gid
   * @apiParam {String} announcement 群组公告
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 更新群组公告
   *
   * @apiUse ResponseResultSuccess
   */
  updateGroupAnnouncement: function(gid, announcement) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/update/announcement?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        gid: gid,
        announcement: announcement,
        client: data.client
      }),
      success:function(response){
        console.log("update group announcement success: ", response);
      },
      error: function(error) {
        console.log("update group announcement error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/update/description 更新群组简介
   * @apiName updateGroupDescription
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} gid 群组唯一gid
   * @apiParam {String} description 群简介
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 更新群组简介
   *
   * @apiUse ResponseResultSuccess
   */
  updateGroupDescription: function(gid, description) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/update/description?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        gid: gid,
        description: description,
        client: data.client
      }),
      success:function(response){
        console.log("update group description success: ", response);
      },
      error: function(error) {
        console.log("update group description error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/invite 邀请一个人/直接拉入群
   * @apiName inviteToGroup
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 被邀请人uid
   * @apiParam {String} gid 群组唯一gid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 邀请/直接拉入群，仅支持一个人
   *
   * @apiUse ResponseResultSuccess
   */
  inviteToGroup: function(uid, gid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/invite?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        gid: gid,
        uid: uid,
        client: data.client
      }),
      success:function(response){
        console.log("invite group success: ", response);
      },
      error: function(error) {
        console.log("invite group error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/invite/list 邀请多人/直接拉入群
   * @apiName inviteListToGroup
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uidList 被邀请人uid数组，格式如：[111, 222, 333]
   * @apiParam {String} gid 群组唯一gid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 邀请/直接拉入群，支持多个人
   *
   * @apiUse ResponseResultSuccess
   */
  inviteListToGroup: function(uidList, gid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/invite/list?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        gid: gid,
        uidList: uidList,
        client: data.client
      }),
      success:function(response){
        console.log("invite group success: ", response);
      },
      error: function(error) {
        console.log("invite group error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/join 主动申请入群，不需要审核
   * @apiName joinGroup
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} gid 群组唯一gid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 主动申请入群, 不需要审核
   *
   * @apiUse ResponseResultSuccess
   */
  joinGroup: function(gid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/apply?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        gid: gid,
        client: data.client
      }),
      success:function(response){
        console.log("apply group success: ", response);
      },
      error: function(error) {
        console.log("apply group error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/apply 主动申请入群，需要审核
   * @apiName applyGroup
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} gid 群组唯一gid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 主动申请入群，需要审核
   *
   * @apiUse ResponseResultSuccess
   */
  applyGroup: function(gid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/apply?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        gid: gid,
        client: data.client
      }),
      success:function(response){
        console.log("apply group success: ", response);
      },
      error: function(error) {
        console.log("apply group error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/apply/approve 主动申请入群：同意
   * @apiName applyGroupApprove
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} nid 通知唯一nid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 主动申请入群：同意
   *
   * @apiUse ResponseResultSuccess
   */
  applyGroupApprove: function(nid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/apply/approve?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        nid: nid,
        client: data.client
      }),
      success:function(response){
        console.log("apply group success: ", response);
      },
      error: function(error) {
        console.log("apply group error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/apply/deny 主动申请入群:拒绝
   * @apiName applyGroupDeny
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} nid 通知唯一nid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 主动申请入群:拒绝
   *
   * @apiUse ResponseResultSuccess
   */
  applyGroupDeny: function(nid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/apply/deny?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        nid: nid,
        client: data.client
      }),
      success:function(response){
        console.log("apply group deny success: ", response);
      },
      error: function(error) {
        console.log("deny group error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/kick 踢人
   * @apiName kickGroupMember
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} gid 群组唯一gid
   * @apiParam {String} uid 被踢用户唯一uid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 踢人
   *
   * @apiUse ResponseResultSuccess
   */
  kickGroupMember: function(gid, uid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/kick?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        gid: gid,
        uid: uid,
        client: data.client
      }),
      success:function(response){
        console.log("kick group member success: ", response);
      },
      error: function(error) {
        console.log("kick group member error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/mute 禁言
   * @apiName muteGroupMember
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} gid 群组唯一gid
   * @apiParam {String} uid 被禁言用户唯一uid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 禁言
   *
   * @apiUse ResponseResultSuccess
   */
  muteGroupMember: function(gid, uid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/mute?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        gid: gid,
        uid: uid,
        client: data.client
      }),
      success:function(response){
        console.log("mute group success: ", response);
      },
      error: function(error) {
        console.log("mute group error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/transfer 移交群组
   * @apiName transferGroup
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} gid 群组唯一gid
   * @apiParam {String} uid 被移交用户uid
   * @apiParam {Boolean} need_approve 是否需要对方同意。是：true; 否：false
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 移交群组
   *
   * @apiUse ResponseResultSuccess
   */
  transferGroup: function(gid, uid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/transfer?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        gid: gid,
        uid: uid,
        need_approve: false,
        client: data.client
      }),
      success:function(response){
        console.log("transfer group success: ", response);
      },
      error: function(error) {
        console.log("transfer group error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/transfer/approve 移交群组：同意
   * @apiName transferGroupApprove
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} nid 通知唯一nid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 移交群组：同意
   *
   * @apiUse ResponseResultSuccess
   */
  transferGroupApprove: function(nid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/transfer/approve?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        nid: nid,
        client: data.client
      }),
      success:function(response){
        console.log("transfer group approve success: ", response);
      },
      error: function(error) {
        console.log("transfer group approve error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/transfer/deny 移交群组: 拒绝
   * @apiName transferGroupDeny
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} nid 通知唯一nid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 移交群组: 拒绝
   *
   * @apiUse ResponseResultSuccess
   */
  transferGroupDeny: function(nid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/transfer/deny?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        nid: nid,
        client: data.client
      }),
      success:function(response){
        console.log("transfer group deny success: ", response);
      },
      error: function(error) {
        console.log("transfer group deny error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/withdraw 退出群组
   * @apiName withdrawGroup
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} gid 群组唯一gid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 退出群组
   *
   * @apiUse ResponseResultSuccess
   */
  withdrawGroup: function(gid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/withdraw?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        gid: gid,
        client: data.client
      }),
      success:function(response){
        console.log("withdraw group success: ", response);
      },
      error: function(error) {
        console.log("withdraw group error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/group/dismiss 解散群组
   * @apiName dismissGroup
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} gid 群组唯一gid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 解散群组
   *
   * @apiUse ResponseResultSuccess
   */
  dismissGroup: function(gid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/dismiss?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        gid: gid,
        client: data.client
      }),
      success:function(response){
        console.log("dismiss group success: ", response);
      },
      error: function(error) {
        console.log("dismiss group error: ", error);
      }
    });
  },

  /**
   * @api {get} /api/group/filter 搜索过滤群组
   * @apiName filterGroup
   * @apiGroup Group
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} keyword 关键词
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 搜索过滤群组
   *
   * @apiUse ResponseResultSuccess
   */
  filterGroup: function(keyword) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/group/filter?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        keyword: keyword,
        client: data.client
      },
      success:function(response){
        console.log("filter group success:", response);
      },
      error: function(error) {
        console.log("filter group error:", error);
      }
    });
  },

  /**
   * @api {get} /api/user/follows 获取关注
   * @apiName getFollows
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 访客uid
   * @apiUse PageSizeClientParam
   * 
   * @apiDescription 获取关注
   *
   * @apiUse ResponseResultSuccess
   */
  getFollows: function(page, size) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/follows?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        page: page,
        size: size,
        client: data.client
      },
      success:function(response){
        console.log("get follows success:", response);
        var follows = response.data;
        utils.appendFollows(follows);
      },
      error: function(error) {
        console.log("get follows error:", error);
      }
    });
  },

  /**
   * @api {get} /api/user/fans 获取粉丝
   * @apiName getMessages
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 访客uid
   * @apiUse PageSizeClientParam
   * 
   * @apiDescription 获取粉丝
   *
   * @apiUse ResponseResultSuccess
   */
  getFans: function(page, size) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/fans?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        page: page,
        size: size,
        client: data.client
      },
      success:function(response){
        console.log("get fans success:", response);
        var fans = response.data;
        utils.appendFans(fans);
      },
      error: function(error) {
        console.log("get fans error:", error);
      }
    });
  },

  /**
   * @api {get} /api/user/friends 获取好友
   * @apiName getFriends
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiUse PageSizeClientParam
   * 
   * @apiDescription 获取好友
   *
   * @apiUse ResponseResultSuccess
   */
  getFriends: function(page, size) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/friends?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        page: page,
        size: size,
        client: data.client
      },
      success:function(response){
        console.log("get friends success:", response);
        var friends = response.data;
        utils.appendFriends(friends);
      },
      error: function(error) {
        console.log("get friends error:", error);
      }
    });
  },

  /**
   * @api {post} /api/user/follow 添加关注
   * @apiName addFollow
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 用户唯一uid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 添加关注
   *
   * @apiUse ResponseResultSuccess
   */
  addFollow: function(uid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/follow?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        uid: uid,
        client: data.client
      }),
      success:function(response){
        console.log("addFollow success: ", response);
      },
      error: function(error) {
        console.log("addFollow error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/user/unfollow 取消关注
   * @apiName unFollow
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 用户唯一uid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 取消关注
   *
   * @apiUse ResponseResultSuccess
   */
  unFollow: function(uid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/unfollow?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        uid: uid,
        client: data.client
      }),
      success:function(response){
        console.log("unfollow success: ", response);
      },
      error: function(error) {
        console.log("unfollow error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/user/friend/add 添加好友
   * @apiName addFriend
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 用户唯一uid
   * @apiParam {String} notify 是否通知对方TODO，默认设置为true
   * @apiParam {String} approve 是否需要对方同意TODO，默认设置为false
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 添加好友
   *
   * @apiUse ResponseResultSuccess
   */
  addFriend: function(uid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/friend/add?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        uid: uid,
        notify: true,
        approve: false,
        client: data.client
      }),
      success:function(response){
        console.log("add friend success: ", response);
      },
      error: function(error) {
        console.log("add friend error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/user/friend/remove 删除好友
   * @apiName removeFriend
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 用户唯一uid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 删除好友
   *
   * @apiUse ResponseResultSuccess
   */
  removeFriend: function(uid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/friend/remove?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        uid: uid,
        client: data.client
      }),
      success:function(response){
        console.log("remove friend success: ", response);
      },
      error: function(error) {
        console.log("remove friend error: ", error);
      }
    });
  },

  /**
   * @api {get} /api/user/isfollowed 判断是否关注
   * @apiName isFollowed
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 访客uid
   * @apiUse PageSizeClientParam
   * 
   * @apiDescription 判断是否关注
   *
   * @apiUse ResponseResultSuccess
   */
  isFollowed: function(uid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/isfollowed?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        uid,
        client: data.client
      },
      success:function(response){
        console.log("isfollowed success:", response);
      },
      error: function(error) {
        console.log("isfollowed error:", error);
      }
    });
  },

  /**
   * @api {get} /api/user/relation 判断好友关系
   * @apiName getRelation
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 用户唯一uid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 判断好友关系
   *
   * @apiUse ResponseResultSuccess
   */
  getRelation: function(uid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/relation?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        uid,
        client: data.client
      },
      success:function(response){
        console.log("get relation success:", response);
      },
      error: function(error) {
        console.log("get relation error:", error);
      }
    });
  },

  /**
   * @api {get} /api/user/shield 判断自己是否已经屏蔽对方
   * @apiName isShield
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 用户唯一uid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 判断自己是否已经屏蔽对方
   *
   * @apiUse ResponseResultSuccess
   */
  isShield: function(uid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/shield?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        uid: uid,
        client: data.client
      },
      success:function(response){
        console.log("get shield success:", response);
      },
      error: function(error) {
        console.log("get shield error:", error);
      }
    });
  },

  /**
   * @api {get} /api/user/shielded 判断自己是否已经被对方屏蔽
   * @apiName isShielded
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 用户唯一uid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 判断自己是否已经被对方屏蔽
   *
   * @apiUse ResponseResultSuccess
   */
  isShielded: function(uid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/shielded?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        uid: uid,
        client: data.client
      },
      success:function(response){
        console.log("get shield success:", response);
      },
      error: function(error) {
        console.log("get shield error:", error);
      }
    });
  },

  /**
   * @api {post} /api/user/shield 屏蔽对方，则对方无法给自己发送消息。但自己仍然可以给对方发送消息
   * @apiName shield
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 用户uid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 屏蔽对方，则对方无法给自己发送消息。但自己仍然可以给对方发送消息
   *
   * @apiUse ResponseResultSuccess
   */
  shield: function(uid, type, note) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/shield?access_token=" +
      data.passport.token.access_token,
      type: "post",
      data: {
        uid: uid,
        client: data.client
      },
      success:function(response){
        console.log("shield success:", response);
      },
      error: function(error) {
        console.log("shield error:", error);
      }
    });
  },

  /**
   * @api {post} /api/user/unshield 取消屏蔽
   * @apiName unshield
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 用户uid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 取消屏蔽
   *
   * @apiUse ResponseResultSuccess
   */
  unshield: function(uid, type, note) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/user/unshield?access_token=" +
      data.passport.token.access_token,
      type: "post",
      data: {
        uid: uid,
        client: data.client
      },
      success:function(response){
        console.log("unshield success:", response);
      },
      error: function(error) {
        console.log("unshield error:", error);
      }
    });
  },

  /**
   * @api {get} /api/messages/user 分页获取拉黑访客
   * @apiName getBlocks
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiUse PageSizeClientParam
   * 
   * @apiDescription 分页获取拉黑访客
   *
   * @apiUse ResponseResultSuccess
   */
  getBlocks: function(page, size) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/block/get?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        page: page,
        size: size,
        client: data.client
      },
      success:function(response){
        console.log("get relation success:", response);
        var blocks = response.data;
        utils.appendBlocks(blocks);
      },
      error: function(error) {
        console.log("get relation error:", error);
      }
    });
  },

  /**
   * @api {post} /api/block/add 添加黑名单
   * @apiName addBlock
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 用户uid
   * @apiParam {String} type 写死固定值：'默认类型'
   * @apiParam {String} note 备注
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 添加黑名单
   *
   * @apiUse ResponseResultSuccess
   */
  addBlock: function(uid, type, note) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/block/add?access_token=" +
      data.passport.token.access_token,
      type: "post",
      data: {
        uid,
        type,
        note,
        client: data.client
      },
      success:function(response){
        console.log("isfollowed success:", response);
      },
      error: function(error) {
        console.log("isfollowed error:", error);
      }
    });
  },

  /**
   * @api {post} /api/block/remove 取消黑名单
   * @apiName removeBlock
   * @apiGroup Social
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 用户uid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 取消黑名单
   *
   * @apiUse ResponseResultSuccess
   */
  removeBlock: function(uid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/block/remove?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        uid,
        client: data.client
      },
      success:function(response){
        console.log("isfollowed success:", response);
      },
      error: function(error) {
        console.log("isfollowed error:", error);
      }
    });
  },

  /**
   * @api {get} /api/thread/get 加载会话列表
   * @apiName getThreads
   * @apiGroup Thread
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 加载会话列表
   *
   * @apiUse ResponseResultSuccess
   */
  getThreads: function(uid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/thread/get?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        client: data.client
      },
      success:function(response){
        console.log("get threads success:", response);
      },
      error: function(error) {
        console.log("get thread error:", error);
      }
    });
  },

  /**
   * @api {post} /api/thread/mark/top 置顶会话
   * @apiName markThreadTop
   * @apiGroup Thread
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} tid 会话tid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 置顶会话
   *
   * @apiUse ResponseResultSuccess
   */
  markThreadTop: function(tid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/thread/mark/top?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        tid: tid,
        client: data.client
      }),
      success:function(response){
        console.log("mark thread top success: ", response);
      },
      error: function(error) {
        console.log("mark thread top error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/thread/unmark/top 取消置顶会话
   * @apiName unmarkThreadTop
   * @apiGroup Thread
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} tid 会话tid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 取消置顶会话
   *
   * @apiUse ResponseResultSuccess
   */
  unmarkThreadTop: function(tid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/thread/unmark/top?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        tid: tid,
        client: data.client
      }),
      success:function(response){
        console.log("unmark thread top success: ", response);
      },
      error: function(error) {
        console.log("unmark thread top error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/thread/mark/nodisturb 设置会话免打扰
   * @apiName markThreadNoDisturb
   * @apiGroup Thread
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} tid 会话tid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 设置会话免打扰
   *
   * @apiUse ResponseResultSuccess
   */
  markThreadNoDisturb: function(tid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/thread/mark/nodisturb?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        tid: tid,
        client: data.client
      }),
      success:function(response){
        console.log("mark thread nodisturb success: ", response);
      },
      error: function(error) {
        console.log("mark thread nodisturb error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/thread/unmark/nodisturb 取消会话免打扰
   * @apiName unmarkThreadNoDisturb
   * @apiGroup Thread
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} tid 会话tid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 取消会话免打扰
   *
   * @apiUse ResponseResultSuccess
   */
  unmarkThreadNoDisturb: function(tid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/thread/unmark/nodisturb?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        tid: tid,
        client: data.client
      }),
      success:function(response){
        console.log("mark thread nodisturb success: ", response);
      },
      error: function(error) {
        console.log("mark thread nodisturb error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/thread/mark/unread 标记未读会话
   * @apiName markThreadUnread
   * @apiGroup Thread
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} tid 会话tid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 标记未读会话
   *
   * @apiUse ResponseResultSuccess
   */
  markThreadUnread: function(tid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/thread/mark/unread?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        tid: tid,
        client: data.client
      }),
      success:function(response){
        console.log("mark thread unread success: ", response);
      },
      error: function(error) {
        console.log("mark thread unread error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/thread/unmark/unread 取消标记未读会话
   * @apiName unmarkThreadUnread
   * @apiGroup Thread
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} tid 会话tid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 取消标记未读会话
   *
   * @apiUse ResponseResultSuccess
   */
  unmarkThreadUnread: function(tid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/thread/unmark/unread?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        tid: tid,
        client: data.client
      }),
      success:function(response){
        console.log("unmark thread unread success: ", response);
      },
      error: function(error) {
        console.log("unmark thread unread error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/thread/mark/deleted 标记会话已删除
   * @apiName markThreadDeleted
   * @apiGroup Thread
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} tid 会话tid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 标记会话已删除
   *
   * @apiUse ResponseResultSuccess
   */
  markThreadDeleted: function(tid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/thread/mark/deleted?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        tid: tid,
        client: data.client
      }),
      success:function(response){
        console.log("mark thread deleted success: ", response);
      },
      error: function(error) {
        console.log("mark thread deleted error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/messages/mark/clear/thread 清空客服会话聊天记录
   * @apiName markClearThreadMessages
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} tid 会话tid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 清空客服会话聊天记录
   *
   * @apiUse ResponseResultSuccess
   */
  markClearThreadMessages: function(tid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/messages/mark/clear/thread?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        tid: tid,
        client: data.client
      }),
      success:function(response){
        console.log("clear thread messages success: ", response);
      },
      error: function(error) {
        console.log("clear thread messageserror: ", error);
      }
    });
  },

  /**
   * @api {post} /api/messages/mark/clear/contact 清空单聊聊天记录
   * @apiName markClearContactMessages
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 用户uid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 清空单聊聊天记录
   *
   * @apiUse ResponseResultSuccess
   */
  markClearContactMessages: function(uid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/messages/mark/clear/contact?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        uid: uid,
        client: data.client
      }),
      success:function(response){
        console.log("clear contact messages success: ", response);
      },
      error: function(error) {
        console.log("clear contact messages error: ", error);
      }
    });
  },

  /**
   * @api {post} /api/messages/mark/clear/group 清空群聊聊天记录
   * @apiName markClearGroupMessages
   * @apiGroup Message
   * @apiVersion 1.5.6
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} gid 群组gid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 清空群聊聊天记录
   *
   * @apiUse ResponseResultSuccess
   */
  markClearGroupMessages: function(gid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/messages/mark/clear/group?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        gid: gid,
        client: data.client
      }),
      success:function(response){
        console.log("clear group messages success: ", response);
      },
      error: function(error) {
        console.log("clear group messages error: ", error);
      }
    });
  }

};

