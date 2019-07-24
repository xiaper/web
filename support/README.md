# 5分钟集成帮助中心

## 准备工作

- 到[萝卜丝官网](https://www.bytedesk.com/admin#/register)注册管理员账号，并登录管理后台。
- 到 所有设置->客服管理->客服账号 添加客服账号。注意：生成记录中有一列 ‘唯一ID(uid)’ 会在指定客服接口中使用
- 到 所有设置->客服管理->技能组 添加技能组，并可将客服账号添加到相关技能组。注意：生成记录中有一列 ‘唯一ID（wId）’ 会在工作组会话中用到

## 开始集成

> 第一步：获取管理员uid

打开 所有设置->客服管理->客服账号 页面，找到管理员账号，查看列 ‘唯一ID(uid）’，即为管理员uid

> 第二步：组成帮助中心链接

```javascript
https://support.bytedesk.com/support?uid=替换为管理员uid&ph=ph"
// 例如：https://support.bytedesk.com/support?uid=201808221551193&ph=ph
```

> 第三步：集成到自己网站

## 集成完毕
