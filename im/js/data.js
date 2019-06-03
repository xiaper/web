/**
 * bytedesk.com
 */
var data = {
  // HTTP_HOST: "http://127.0.0.1:8000",
  // STOMP_HOST: "http://127.0.0.1:8000",
  HTTP_HOST: "https://api.bytedesk.com",
  STOMP_HOST: "https://stomp.bytedesk.com",
  //
  userInfo: {},
  friends: [],
  groups: [],
  threads: [],
  workGroups: [],
  queues: [],
  //
  layer: null,
  layerLogin: null,
  form: null,
  element: null,
  layerSocial: null,
  layim: null,
  layimCurrentChatType: 'friend',
  layimCurrentChatId: '',
  layimUserInfo: {
    id: '',
    username: '',
    status: 'online',
    sign: '',
    avatar: '',
    subDomain: ''
  },
  layimFriends: [],
  layimGroups: [],
  //
  imageDialogVisible: false,
  currentImageUrl: "",
  currentVoiceUrl: "",
  // 表情面板
  show_emoji: false,
  emojiBaseUrl: "https://chainsnow.oss-cn-shenzhen.aliyuncs.com/emojis/gif/",
  inputContent: "",
  messages: [],
  // 上传图片相关参数
  upload_headers: {
    "X-CSRF-TOKEN": "",
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    Authorization: "Bearer "
  },
  upload_data: {
    file_name: "test.png",
    username: ""
  },
  upload_name: "file",
  // 接收图片服务器地址
  uploadImageServerUrl: "/visitor/api/upload/image",
  // 上传图片结果集, 格式：{name: "", url: ""}
  uploadedImageList: [],
  //
  inputTipVisible: false,
  // 仅允许评价一次
  isRated: false,
  // 是否客服邀请评价
  isInviteRate: false,
  // 满意度评价对话框是否可见
  rateDialogVisible: false,
  // 满意度评分
  rateScore: 5,
  // 满意度附言
  rateContent: "",
  // 留言
  showLeaveMessage: false,
  leaveMessageForm: {
    mobile: "",
    email: "",
    content: ""
  },
  //
  isLoading: false,
  stompClient: "",
  sessionId: "",
  preSessionId: "",
  browseInviteBIid: "",
  passport: {
    token: {
      access_token: "",
      expires_in: 0,
      jti: "",
      refresh_token: "",
      scope: "",
      token_type: ""
    }
  },
  // 左上角标题title
  title: "ByteDesk.com",
  adminUid: "",
  workGroupWid: "",
  subDomain: "",
  client: "web",
  // 聊天记录
  messages: [],
  thread: {
    id: 0,
    tid: ""
  },
  // 已经订阅的topic
  subscribedTopics: [],
  // 加载聊天记录offset
  page: 0,
  // 是否是最后一批聊天记录
  last: false,
  // workGroup/visitor/contact/group
  type: "workGroup",
  // 指定客服
  agentUid: "",
  // 当前访客用户名
  uid: "",
  username: "",
  password: "",
  nickname: "",
  // 本地存储access_token的key
  token: "token",
  isConnected: false,
  answers: [],
  isRobot: false,
  isThreadStarted: false,
  isThreadClosed: false,
  //
  emotionBaseUrl: "https://chainsnow.oss-cn-shenzhen.aliyuncs.com/emojis/gif/",
  //
  showEmoji: function () {
    return !data.disabled() && data.show_emoji;
  },
  disabled: function () {
    return data.thread.tid === "";
  },
  sendButtonDisabled: function () {
    return data.inputContent.trim().length === 0;
  },
  threadTopic: function () {
    return "thread." + data.thread.tid;
  },
  show_header: function () {
    return true;
  },
  connectedImage: function () {
    return data.isConnected
      ? "https://bytedesk.oss-cn-shenzhen.aliyuncs.com/util/connected.png"
      : "https://bytedesk.oss-cn-shenzhen.aliyuncs.com/util/disconnected.png";
  }
};