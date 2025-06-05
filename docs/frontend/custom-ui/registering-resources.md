---
title: "注册资源"
---

如果您想通过自定义卡片、策略或视图扩展Home Assistant界面，您需要加载外部资源。

第一步是使其对Home Assistant前端可访问。这是通过在您的配置文件夹中创建一个名为`www`的新目录来完成的。创建该目录并重启Home Assistant。

重启后，您可以将文件放入该目录中。每个文件都可以通过UI在`/local`下无身份验证访问。

下一步是将这些资源注册到Home Assistant界面。这是通过访问资源页面来完成的，按照以下链接操作：

[![打开您的Home Assistant实例并显示您的资源。](https://my.home-assistant.io/badges/lovelace_resources.svg)](https://my.home-assistant.io/redirect/lovelace_dashboards/) （注意：重定向后，点击右上角的三个点菜单。）

:::note

当活动用户的个人资料启用了“高级模式”时，此区域才可用。

:::

![在个人资料页面上找到的高级模式选择器的截图](/img/en/frontend/frontend-profile-advanced-mode.png)

另外，您也可以通过将其添加到配置中的`lovelace`的`resources`部分来注册资源：

```yaml
resources:
  - url: /local/<资源名称>.js
    type: module