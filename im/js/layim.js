/**
 * 
 */
var layim = {
  /**
   * 
   */
  initUI: function() {
    console.log('initLayUI');
    layui.use(['layer', 'form', 'element'], () => {
      data.layer = layui.layer
      data.form = layui.form
      data.element = layui.element
      //提交登录事件
      data.form.on('submit(login)', function (data) {
        console.log('submit login:', data);
        httpapi.login();
        utils.closeWin()
        return false;
      })
      //提交注册事件
      data.form.on('submit(register)', function (data) {
        console.log('submit register:', data);
        // httpapi.register();
        utils.closeWin()
        return false;
      })
      //
      data.element.on('tab(social)', function(element) {
        console.log('tab change index: ', element.index);
        if (element.index == 0) {
          // 测试用户
          httpapi.getContacts()
        } else if (element.index == 1) {
          // 群组
          httpapi.getGroups()
        } else if (element.index == 2) {
          // 关注
          httpapi.getFollows(0, 20)
        } else if (element.index == 3) {
          // 粉丝
          httpapi.getFans(0, 20)
        } else if (element.index == 4) {
          // 好友
          httpapi.getFriends(0, 20)
        } else if (element.index == 5) {
          // 黑名单
          httpapi.getBlocks(0, 20)
        }
      })
    })
    var device = layui.device();
    console.log('layui device:', device)
  },
  /**
   * 登录后初始化Layim
   */
  initIM: function() {
    $("#byteDesk-start").hide();
    if (data.layim !== null) {
      return
    }
    //
    layui.use('layim', function(layim){
      //基础配置
      layim.config({
        //初始化接口
        init: {
          mine: data.layimUserInfo,
          friend: data.layimFriends,
          group: data.layimGroups
        },
        // 上传图片接口（返回的数据格式见下文），若不开启图片上传，剔除该项即可
        uploadImage: {
          url: constants.UPLOAD_LAYIM_IMAGE_URL, // 接口地址
          type: 'post' // 默认post
        },
        // 上传文件接口（返回的数据格式见下文），若不开启文件上传，剔除该项即可
        // uploadFile: {
        //   url: constants.UPLOAD_LAYIM_FILE_URL, // 接口地址
        //   type: 'post' // 默认post
        // },
        //
        initSkin: '2.jpg', // 1-5 设置初始背景
        min: true, // 是否始终最小化主面板，默认false
        notice: true, // 是否开启桌面消息提醒，默认false
        // TODO: 判断是否electron客户端
        msgbox: 'url', // 消息盒子页面地址，若不开启，剔除该项即可
        find: 'url', // 发现页面地址，若不开启，剔除该项即可
        chatLog: 'url', // 聊天记录页面地址，若不开启，剔除该项即可
        copyright: true // 隐藏下面的版权信息
      });
      // 组件全局看见
      data.layim = layim
      // 监听在线状态的切换事件
      layim.on('online', data => {
        console.log('online:', data)
        layer.open({
          title: '提示'
          ,content: '设置在线状态'
        });
      })
      // 创建群组
      layim.on('find', data => {
        console.log('find:', data)
        utils.showSocialDialog()
      })
      // 查看消息通知
      layim.on('msgbox', data => {
        console.log('msgbox:', data)
        layer.open({
          title: '提示'
          ,content: '通知消息'
        }); 
      })
      // 查看聊天记录
      layim.on('chatLog', chat => {
        console.log('chatLog:', chat)
        if (chat.data.type === 'friend') {
          httpapi.getContactMessages(chat.data.id, 0, 100)
        } else if (chat.data.type === 'group') {
          httpapi.getGroupMessages(chat.data.id, 0, 100)
        }
      })
      // 查看群组成员
      layim.on('groupMembers', chat => {
        console.log('groupMembers:', chat)
        httpapi.getGroupMembers(chat.data.id);
      })
      // 监听签名修改
      layim.on('sign', value => {
        console.log('sign: ', value)
        layer.open({
          title: '提示'
          ,content: '修改签名'
        }); 
      })
      // 设置皮肤
      layim.on('setSkin', (filename, src) => {
        console.log(filename) // 获得文件名，如：1.jpg
        console.log(src) // 获得背景路径，如：http://res.layui.com/layui/src/css/modules/layim/skin/1.jpg
      })
      // 监听layim建立就绪
      layim.on('ready', res => {
        console.log('ready: ', res)
      })
      // 监听发送消息
      layim.on('sendMessage', data => {
        console.log('sendMessage: ', data)
        if (data.to.type === 'friend') {
          //
          if (data.mine.content.startsWith('img[') && data.mine.content.endsWith(']')) {
            // 图片类型: img[https://bytedesk.oss-cn-shenzhen.aliyuncs.com/images/43474809-49e5-4acf-baf7-62b8ebcf0e95]
            // TODO: 修改格式
            var content = data.mine.content.slice(4, -1)
            var payload = { uid: data.to.id, imageUrl: content }
            stompapi.sendContactImageMessage(payload)
          } else if (data.mine.content.startsWith('file(') && data.mine.content.endsWith(']')) {
            // 文件类型: file(https://bytedesk.oss-cn-shenzhen.aliyuncs.com/files/9d4b4a89-6039-46f2-b262-71f6156698f0)[9d4b4a89-6039-46f2-b262-71f6156698f0]
            var endIndex = data.mine.content.indexOf(')')
            var content = data.mine.content.slice(5, endIndex)
            // TODO: format需要根据文件类型，填写相应后缀，如：doc/exe等
            var payload = { uid: data.to.id, fileUrl: content, format: 'doc' }
            stompapi.sendContactFileMessage(payload)
          } else {
            var payload = { uid: data.to.id, content: data.mine.content }
            stompapi.sendContactTextMessage(payload)
          }
        } else if (data.to.type === 'group') {
          //
          if (data.mine.content.startsWith('img[') && data.mine.content.endsWith(']')) {
            // 图片类型: img[https://bytedesk.oss-cn-shenzhen.aliyuncs.com/images/43474809-49e5-4acf-baf7-62b8ebcf0e95]
            var content = data.mine.content.slice(4, -1)
            var payload = { uid: data.to.id, imageUrl: content }
            stompapi.sendGroupImageMessage(payload)
          } else if (data.mine.content.startsWith('file(') && data.mine.content.endsWith(']')) {
            // 文件类型: file(https://bytedesk.oss-cn-shenzhen.aliyuncs.com/files/9d4b4a89-6039-46f2-b262-71f6156698f0)[9d4b4a89-6039-46f2-b262-71f6156698f0]
            var endIndex = data.mine.content.indexOf(')')
            var content = data.mine.content.slice(5, endIndex)
            // TODO: format需要根据文件类型，填写相应后缀，如：doc/exe等
            var payload = { uid: data.to.id, fileUrl: content, format: 'doc' }
            stompapi.sendGroupFileMessage(payload)
          } else {
            var payload = { uid: data.to.id, content: data.mine.content }
            stompapi.sendGroupTextMessage(payload)
          }
        }
      })
      // 监听聊天窗口的切换
      layim.on('chatChange', res => {
        console.log('chatChange:', res)
        data.layimCurrentChatType = res.data.type
        data.layimCurrentChatId = res.data.id
      })
    });
  }
};

