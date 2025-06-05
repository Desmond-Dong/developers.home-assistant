---
title: "创建一个附加组件仓库"
---

附加组件仓库可以包含一个或多个附加组件。每个附加组件都存储在其独特的文件夹中。为了被识别为一个仓库，仓库必须包含一个配置文件。

请查看[示例附加组件仓库](https://github.com/home-assistant/addons-example)以获取更多详细信息。

## 安装仓库

用户可以通过前往Home Assistant的Supervisor面板，点击右上角的商店图标，将您的仓库URL复制/粘贴到仓库文本框中，然后点击**保存**来添加仓库。

:::tip
您可以为您的用户生成一个[my.home-assistant.io](https://my.home-assistant.io/create-link/)，使他们能够通过在您的readme文件中点击一个按钮来完成此操作。
:::

## 仓库配置

每个仓库都需要在git仓库的根目录中包含`repository.yaml`。

```yaml
name: 仓库名称
url: http://www.example/addons
maintainer: HomeAssistant团队 <info@home-assistant.io>
```

| 键 | 必需 | 描述 |
| --- | -------- | ----------- |
| `name` | 是 | 仓库的名称 |
| `url` | 否 | 仓库的主页。在这里您可以解释各种附加组件。 |
| `maintainer` | 否 | 维护者的联系信息。 |