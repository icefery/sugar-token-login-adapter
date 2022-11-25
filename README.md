# Sugar BI token 登录方式适配器

## 需求

在已登录的业务系统中携带员工编码访问指定链接实现**非交互式自动登录**Sugar BI。

## token 登录方式

> [私有部署的安装](https://cloud.baidu.com/doc/SUGAR/s/Gjyth5q2n#5%E3%80%81token)

Sugar BI 的 token 登录方式是一种便于业务方对接的登录方式，登录流程如下：

1. Sugar BI 检测到用户未登录，跳转到业务方指定的 `sugar_token_login_ur` 进行登录操作。
2. 用户登录成功后，业务方带上一个 token 回调 Sugar BI 指定的 URL `http://${SUGAR_BASE_URL}/login/tokenLoginCallback?token=${token}`。
3. 我们会使用这个 token 调用业务方的 `sugar_token_login_getUserInfoURL` 获取登录用户的信息并在 Sugar BI 中进行登录。

## Sugar BI 配置

| key                                   | value                                 |
| ------------------------------------- | ------------------------------------- |
| `sugar_login_type`                    | `token`                               |
| `sugar_token_login_url`               | `http://192.192.192.6:8000`           |
| `sugar_token_login_getUserInfoURL`    | `http://192.192.192.6:8000/user-info` |
| `sugar_token_login_getUserInfoMethod` | `get`                                 |
