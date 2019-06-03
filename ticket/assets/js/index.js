/**
 * 
 */
$(document).ready(function () {

  data.page = "index";

  // ie Ajax cross domain requests
  $.support.cors = true;
  // 使ie支持startsWith
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
       position = position || 0;
      return this.indexOf(searchString, position) === position;
    };
  }
  // 使ie支持includes
  if (!String.prototype.includes) {
    String.prototype.includes = function (str) {
      var returnValue = false;
      if (this.indexOf(str) !== -1) {
        returnValue = true;
      }
      return returnValue;
    };
  }
  //
  layui.use(['layer', 'form', 'upload'], function(){
    var layer = layui.layer;
    data.ticketLayer = layer;
    var form = layui.form;
    data.ticketForm = form;
    var upload = layui.upload;

    // 监听选择类别
    form.on('select(category)', function(data){
      console.log(data);
    });
    
    //监听提交
    form.on('submit(formTicket)', function(data){
      console.log(data.field);
      //
      var urgent = data.field.urgent;
      var cid = data.field.category;
      var content = data.field.content; 
      var mobile = data.field.mobile;
      var email = data.field.email; 
      // 下一版本添加
      var fileUrl = '';
      //
      httpapi.createTicket(urgent, cid, content, mobile, email, fileUrl);
      //
      return false;
    });

    // 上传
    upload.render({
      elem: '#ticketFileUrl', //绑定元素
      url: data.HTTP_HOST + "/visitor/api/upload/image",
      data: { file_name: utils.guid(), username: data.username, client: data.client},
      done: function(response){
        //上传完毕回调
        console.log(response);
        var fileName = response.message;
        var fileUrl = response.data;

      },
      error: function() {
        //请求异常回调
        console.log('上传错误');
      }
    });
  });

  // 初始化
  ticket.created();
  ticket.mounted();
});