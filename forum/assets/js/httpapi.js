/**
 * http rest api
 * v1.0
 */
/**
 * @apiDefine User 用户
 *
 * 用户相关接口
 */
/**
 * @apiDefine Forum 问答社区
 *
 * 意见反馈相关接口
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
var httpapi = {
  /**
   * @api {get} /visitor/api/username 生成默认访客账号
   * @apiName requestUsername
   * @apiGroup User
   * @apiVersion 1.5.6
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
    data.username = localStorage.username;
    data.password = localStorage.password;
    if (data.username) {
      if (data.password == null) {
        data.password = data.username;
      }
      httpapi.login();
    } else {
      //
      $.ajax({
        url: data.HTTP_HOST + "/visitor/api/username",
        contentType: "application/json; charset=utf-8",
        type: "get",
        data: { 
          subDomain: data.subDomain,
          client: data.client
        },
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
    }
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
    // console.log('do login: ', data.username, data.password);
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
        // FIXME: 判断是首页
        if (data.page === "index") {
          // 加载类别
          // httpapi.getForumCategories();
          $("#forumAskButton").append("<a href='ask.html?uid=" + data.adminUid + "' target='_blank' class='uk-button uk-button-primary uk-width-1-1 uk-width-auto@s'>提问</a>");
          // 加载文章
          httpapi.getArticles();
        } else if (data.page === "category") {
          // 加载类别详情
          httpapi.getCategoryDetail(data.cid);
        } else if (data.page === "article") {
          // 加载文章详情
          httpapi.getArticleDetail(data.aid);
        } else if (data.page === "search") {
          // 加载搜索结果
          httpapi.searchArticle(data.searchContent);
        } else if (data.page === 'ask') {
          // 提问
          // 加载类别
          httpapi.getForumCategories();
        }
      },
      error: function(error) {
        //Do Something to handle error
        console.log(error);
      }
    });
  },
  /**
   * @api {get} /visitor/api/category/forum 加载类别
   * @apiName getForumCategories
   * @apiGroup Support
   * @apiVersion 1.0
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 后台管理员唯一uid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 加载类别
   *
   * @apiUse ResponseResultSuccess
   */
  getForumCategories: function () {
    $.ajax({
      url: data.HTTP_HOST +
      "/visitor/api/category/forum?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        uid: data.adminUid,
        client: data.client
      },
      success:function(response){
        console.log("get forum categories success:", response.data);
        if (response.status_code === 200) {
          //
          for (var i = 0; i < response.data.length; i++) {
            var category = response.data[i];
            if (data.page === "index") {
              // 其中href参数&ph=ph为占位符，无实际用途
              $("#supportCategory").append("<div>" +
                "<a href='category.html?uid=" + data.adminUid + "&cid=" + category.cid + "&ph=ph' class='box uk-border-rounded' target='_blank'>" +
                  "<h3>" + category.name + "</h3>" +
                "</a>" +
              "</div>"); 
            } else if (data.page === "category") {
              // 分类页面
              if (category.cid === data.currentCategory.cid) {
                // 当前分类
                $("#supportCategory").append("<li><a href='category.html?uid=" + data.adminUid + "&cid=" + category.cid + "&ph=ph'>" + category.name + "</a></li>")
              } else {
                // 其他分类
                $("#supportCategory").append("<li><a class=‘uk-text-bold' href='category.html?uid=" + data.adminUid + "&cid=" + category.cid + "&ph=ph'>" + category.name + "</a> <span uk-icon='icon: chevron-right'></span></li>")
              }
            } else if (data.page === 'ask') {
              // 提问
              $("#forumCategory").append("<option value="+category.cid+">"+category.name+"</option>"); 
              // 表单重新渲染，要不然添加完显示不出来新的option
              data.forumForm.render();
            }
          }
          
        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log("get Support categories error:", error);
      }
    });
  },
  /**
   * @api {get} /visitor/api/articles 加载文章
   * @apiName getArticles
   * @apiGroup Support
   * @apiVersion 1.0
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} uid 后台管理员唯一uid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 加载类别
   *
   * @apiUse ResponseResultSuccess
   */
  getArticles: function () {
    $.ajax({
      url: data.HTTP_HOST +
      "/visitor/api/articles?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        uid: data.adminUid,
        type: 'forum',
        page: 0,
        size: 20,
        client: data.client
      },
      success:function(response){
        console.log("get articles success:", response.data);
        if (response.status_code === 200) {
          //
          if (data.page === "index") {
            // 置顶
            for (var i = 0; i < response.data.content.length; i++) {
              var article = response.data.content[i];
              if (article.recommend) {
                $("#supportLatestArtcle").append("<li>" + 
                  "<div class='author-box uk-card'>" +
                    "<div class='uk-card-header uk-padding-remove'>" +
                      "<div class='uk-grid-small uk-flex-middle  uk-position-relative' uk-grid>" +
                          "<div class='uk-width-auto'>" +
                            "<img id='supportArticleUserAvatar' class='uk-border-circle' width='40' height='40' src='" + article.user.avatar + "'>" +
                          "</div>" +
                          "<div class='uk-width-expand'>" +
                            "<h5 id='supportArticleUserNickname' class='uk-card-title'>" + article.user.nickname + "</h5>" +
                            "<a href='article.html?uid=" + data.adminUid + "&aid=" + article.aid + "&ph=ph' target='_blank'>" +
                              "<span>[置顶] " + article.title + "</span>" +
                            "</a>" +
                            "<p id='supportArticleUpdatedAt' class='uk-article-meta uk-margin-remove-top'>" +
                              "<span>评论数: " + article.comments.length + " </span>" +
                              "<span style='margin-left: 20px;'>阅读数: " + article.readCount + " </span>" +
                              "<span style='margin-left: 20px;'>创建时间: " + article.createdAt + "</span>" +
                            "</p>" +
                          "</div>" +
                        "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>");
              }
            }
            // 非置顶
            for (var j = 0; j < response.data.content.length; j++) {
              var article2 = response.data.content[j];
              if (!article2.recommend) {
                $("#supportLatestArtcle").append("<li>" + 
                  "<div class='author-box uk-card'>" +
                    "<div class='uk-card-header uk-padding-remove'>" +
                      "<div class='uk-grid-small uk-flex-middle  uk-position-relative' uk-grid>" +
                          "<div class='uk-width-auto'>" +
                            "<img id='supportArticleUserAvatar' class='uk-border-circle' width='40' height='40' src='" + article2.user.avatar + "'>" +
                          "</div>" +
                          "<div class='uk-width-expand'>" +
                            "<h5 id='supportArticleUserNickname' class='uk-card-title'>" + article2.user.nickname + "</h5>" +
                            "<a href='article.html?uid=" + data.adminUid + "&aid=" + article2.aid + "&ph=ph' target='_blank'>" +
                              "<span>" + article2.title + "</span>" +
                            "</a>" +
                            "<p id='supportArticleUpdatedAt' class='uk-article-meta uk-margin-remove-top'>" +
                              "<span>评论数: " + article2.comments.length + " </span>" +
                              "<span style='margin-left: 20px;'>阅读数: " + article2.readCount + " </span>" +
                              "<span style='margin-left: 20px;'>创建时间: " + article2.createdAt+ "</span>" +
                            "</p>" +
                          "</div>" +
                        "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>");
              }
            }
          } else if (data.page === "category") {
            // 分类页面

          }
          
        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log("get articles error:", error);
      }
    });
  },
  /**
   * @api {get} /api/category/detail 加载类别详情
   * @apiName getCategoryDetail
   * @apiGroup Support
   * @apiVersion 1.0
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} cid 类别cid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 加载类别详情
   *
   * @apiUse ResponseResultSuccess
   */
  getCategoryDetail: function (cid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/category/detail?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        cid: cid,
        client: data.client
      },
      success:function(response){
        console.log("get category detail success:", response.data);
        if (response.status_code === 200) {
          //
          data.currentCategory = response.data.category;
          $("#supportCategoryName").text(data.currentCategory.name)
          $("#supportCategoryName2").text(data.currentCategory.name)
          //
          for (var i = 0; i < response.data.articles.length; i++) {
            var article = response.data.articles[i];
            $("#supportCategoryArticle").append("<li>" +
                "<h3><a href='article.html?uid=" + data.adminUid + "&aid=" + article.aid + "&ph=ph' target='_blank'>" + article.title + "</span></a></h3>" +
              "</li>")
          }
          // 加载帮助类别
          httpapi.getForumCategories();

        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log("get category detail error:", error);
      }
    });
  },
  /**
   * @api {get} /api/article/detail 加载类别详情
   * @apiName getArticleDetail
   * @apiGroup Support
   * @apiVersion 1.0
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} aid 文章aid
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 加载类别详情
   *
   * @apiUse ResponseResultSuccess
   */
  getArticleDetail: function (aid) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/article/detail?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        aid: aid,
        client: data.client
      },
      success:function(response){
        console.log("get article detail success:", response.data);
        if (response.status_code === 200) {
          //
          data.currentArticle = response.data.article;
          data.currentCategory = data.currentArticle.categories[0];
          // 面包屑导航breadcrumb
          $("#supportArticleBreadcrumb").append("<li><a href='category.html?uid=" + data.adminUid + "&cid=" + data.currentCategory.cid + "&ph=ph'>" + data.currentCategory.name + "</a></li>");
          $("#supportArticleBreadcrumb").append("<li><span href=''>" + data.currentArticle.title + "</span></li>");
          // 文章作者
          $("#supportArticleTitle").html(data.currentArticle.title);
          $("#supportArticleUserAvatar").attr("src",data.currentArticle.user.avatar);
          $("#supportArticleUserNickname").html(data.currentArticle.user.nickname);
          $("#supportArticleUpdatedAt").html(data.currentArticle.createdAt);
          //
          $("#supportArticleReadCount").html("阅读次数:" + data.currentArticle.readCount);
          // 文章内容
          $("#supportArticleSummary").html(data.currentArticle.summary != null ? data.currentArticle.summary : "");
          $("#supportArticleContent").html(data.currentArticle.content);
          // 评价
          data.articleRate = response.data.rate;
          $("#supportArticleRateHelpfull").html("<span class='uk-margin-small-right' uk-icon='icon: check; ratio: 0.8'></span>是的(" + data.currentArticle.rateHelpful + ")");
          $("#supportArticleRateHelpless").html("<span class='uk-margin-small-right uk-inline' uk-icon='icon: close; ratio: 0.8'></span>没有(" + data.currentArticle.rateUseless + ")");
          // $("#supportArticleRateThanks").html();
          // 评论
          for (var i = 0; i < response.data.article.comments.length; i++) {
            var comment = response.data.article.comments[i];
            $("#forumCommentList").append("<li>" +
              "<article class='uk-comment uk-visible-toggle'>" + 
                  "<header class='uk-comment-header uk-position-relative'>" + 
                      "<div class='uk-grid-medium uk-flex-middle' uk-grid>" +
                          "<div class='uk-width-auto'>" +
                              "<img class='uk-comment-avatar uk-border-circle' src='" + comment.user.avatar + "' width='50' height='50' alt=''>" +
                          "</div>" +
                          "<div class='uk-width-expand'>" +
                              "<h4 class='uk-comment-title uk-margin-remove'><a class='uk-link-reset' href='#'>" + comment.user.nickname + "</a></h4>" +
                              "<p class='uk-comment-meta uk-margin-remove-top'><a class='uk-link-reset' href='#'>" + comment.createdAt + "</a></p>" +
                          "</div>" +
                      "</div>" +
                      "<div class='uk-position-top-right uk-position-small uk-hidden-hover'><a class='uk-link-muted' href='#'>回复</a></div>" +
                  "</header>" +
                  "<div class='uk-comment-body'>" +
                      "<p>" + comment.content + "</p>" +
                  "</div>" +
              "</article>" +
            "</li>");
          }
          // // 最近阅读
          // if (response.data.recent.length > 0) {
          //   //
          //   for (var i = 0; i < response.data.recent.length; i++) {
          //     var article = response.data.recent[i].article;
          //     $("#supportArticleRecent").append("<li><a href='article.html?uid=" + data.adminUid + "&aid=" + article.aid + "&ph=ph' target='_blank'>" + article.title + "</span></a></li>");
          //   }
          // } else {
          //   $("#supportArticleRecent").append("暂无");
          // }
          // // 相关文章
          // if (response.data.related.length > 0) {
          //   //
          //   for (var j = 0; j < response.data.related.length; j++) {
          //     var article2 = response.data.related[j];
          //     $("#supportArticleRelated").append("<li><a href='article.html?uid=" + data.adminUid + "&aid=" + article2.aid + "&ph=ph' target='_blank'>" + article2.title + "</span></a></li>");
          //   }
          // } else {
          //   $("#supportArticleRelated").append("暂无");
          // }
          // 
          
        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log("get article detail error:", error);
      }
    });
  },
  /**
   * @api {get} /api/article/search 搜索文章
   * @apiName searchArticle
   * @apiGroup Support
   * @apiVersion 1.0
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} content 搜索内容
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 搜索文章
   *
   * @apiUse ResponseResultSuccess
   */
  searchArticle: function (content) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/article/search?access_token=" +
      data.passport.token.access_token,
      type: "get",
      data: {
        uid: data.adminUid,
        content: content,
        client: data.client
      },
      success:function(response){
        console.log("search article success:", response.data);
        if (response.status_code === 200) {
          //
          if (response.data.content.length == 0) {
            // 搜索结果为空
            $("#supportSearchArticle").append("未找到结果");
          } else {
            // 搜索结果不为空
            for (var i = 0; i < response.data.content.length; i++) {
              var article = response.data.content[i];
              $("#supportSearchArticle").append("<li><a href='article.html?uid=" + data.adminUid + "&aid=" + article.aid + "&ph=ph' target='_blank'>" + article.title + "</a></li>");
            }
          }
        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log("search article detail error:", error);
      }
    });
  },
  /**
   * @api {post} /api/article/rate 评价文章是否有用
   * @apiName leaveMessage
   * @apiGroup Support
   * @apiVersion 1.0
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} aid 文章aid
   * @apiParam {String} rate 是否有帮助 boolean, 有: true， 无: false
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 评价文章是否有用
   *
   * @apiUse ResponseResultSuccess
   */
  rateArticle: function (aid, rate) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/article/rate?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        aid: aid,
        rate: rate,
        client: data.client
      }),
      success:function(response){
        console.log("rate article success:", response.data);
        if (response.status_code === 200) {

        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log(error);
        alert("评价失败");
      }
    });
  },
  /**
   * @api {post} /api/comment/create 评论文章
   * @apiName commentArticle
   * @apiGroup Support
   * @apiVersion 1.0
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} aid 文章aid
   * @apiParam {String} content 评论内容
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 评论文章
   * TODO: 微信登录后添加评论
   * TODO: 限制评论频率，过滤评论内容敏感词等
   *
   * @apiUse ResponseResultSuccess
   */
  commentArticle: function (aid, content) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/comment/create?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        aid: aid,
        content: content,
        client: data.client
      }),
      success:function(response){
        console.log("comment article success:", response.data);
        if (response.status_code === 200) {
          //
          var comment = response.data;
          $("#forumCommentList").append("<li>" +
              "<article class='uk-comment uk-visible-toggle'>" + 
                  "<header class='uk-comment-header uk-position-relative'>" + 
                      "<div class='uk-grid-medium uk-flex-middle' uk-grid>" +
                          "<div class='uk-width-auto'>" +
                              "<img class='uk-comment-avatar uk-border-circle' src='" + comment.user.avatar + "' width='50' height='50' alt=''>" +
                          "</div>" +
                          "<div class='uk-width-expand'>" +
                              "<h4 class='uk-comment-title uk-margin-remove'><a class='uk-link-reset' href='#'>" + comment.user.nickname + "</a></h4>" +
                              "<p class='uk-comment-meta uk-margin-remove-top'><a class='uk-link-reset' href='#'>" + comment.createdAt + "</a></p>" +
                          "</div>" +
                      "</div>" +
                      "<div class='uk-position-top-right uk-position-small uk-hidden-hover'><a class='uk-link-muted' href='#'>回复</a></div>" +
                  "</header>" +
                  "<div class='uk-comment-body'>" +
                      "<p>" + comment.content + "</p>" +
                  "</div>" +
              "</article>" +
            "</li>");
            //
            $("#forumComment").val('');

        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log(error);
        alert("评论失败");
      }
    });
  },
  /**
   * @api {post} /api/article/ask 提问
   * @apiName ask
   * @apiGroup Support
   * @apiVersion 1.0
   * @apiPermission afterLogin
   * 
   * @apiParam {String} access_token 访问令牌
   * @apiParam {String} aid 文章aid
   * @apiParam {String} content 评论内容
   * @apiParam {String} client 固定写死为 'web'
   * 
   * @apiDescription 提问
   * TODO: 微信登录后添加评论
   * TODO: 限制评论频率，过滤评论内容敏感词等
   *
   * @apiUse ResponseResultSuccess
   */
  ask: function (cid, title, content, mobile, email) {
    $.ajax({
      url: data.HTTP_HOST +
      "/api/article/ask?access_token=" +
      data.passport.token.access_token,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "post",
      data: JSON.stringify({
        uid: data.adminUid,
        cid: cid,
        title: title,
        content: content,
        mobile: mobile, 
        email: email,
        client: data.client
      }),
      success:function(response){
        console.log("ask article success:", response.data);
        if (response.status_code === 200) {
            alert("提问成功");
        } else {
          alert(response.message);
        }
      },
      error: function(error) {
        console.log(error);
        alert("提问失败");
      }
    });
  },
};
