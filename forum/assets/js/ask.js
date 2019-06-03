/**
 * 
 */
$(document).ready(function () {
  //
  data.page = "ask";
  data.searchContent = utils.getUrlParam("content");

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
      data.forumLayer = layer;
      var form = layui.form;
      data.forumForm = form;
      var upload = layui.upload;

      // 监听选择类别
      form.on('select(category)', function(data){
        console.log(data);
      });
      
      //监听提交
      form.on('submit(formForum)', function(data){
        console.log(data.field);
        //
        var cid = data.field.category;
        var title = data.field.title;
        var content = data.field.content; 
        var mobile = data.field.mobile;
        var email = data.field.email; 
        //
        httpapi.ask(cid, title, content, mobile, email);
        //
        return false;
      });

      // 上传
      upload.render({
        elem: '#forumFileUrl', //绑定元素
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
  forum.created();
  forum.mounted();
});