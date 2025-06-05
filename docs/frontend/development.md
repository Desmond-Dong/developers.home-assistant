---
title: "前端开发"
sidebar_label: "开发"
---

Home Assistant 的前端是使用网络组件构建的。有关我们技术选择的更多背景信息， [请参阅此博客文章](https://developers.home-assistant.io/blog/2019/05/22/internet-of-things-and-the-modern-web.html)。

:::caution
在生产环境中不要使用开发模式。Home Assistant 使用激进缓存以改善移动体验。在开发过程中禁用缓存，这样您就无需在每次更改之间重启服务器。
:::

## 设置环境

### 获取代码

第一步是分叉 [frontend repository][hass-frontend] 并添加上游远程库。您可以将分叉的存储库放置在系统的任何位置。

```shell
git clone git@github.com:YOUR_GIT_USERNAME/frontend.git
cd frontend
git remote add upstream https://github.com/home-assistant/frontend.git
```

### 配置 Home Assistant

您需要设置一个 Home Assistant 实例。有关开发实例，请参阅我们的 [设置开发环境](/development_environment.mdx) 指南。

有两种方法可以测试前端。您可以运行一个开发实例的 Home Assistant Core，或者配置前端以连接到现有的 Home Assistant 实例。第一种选项是它在生产中如何工作。第二种允许在最小干扰下运行与现有 Home Assistant 的开发前端。缺点是并不是所有功能都可以通过这种方式进行测试。例如，登录页面将始终是您 Home Assistant 中内置的页面。

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs>

<TabItem value="使用 HA Core 的开发实例">

#### 使用 Visual Studio Code + 开发容器进行开发

要配置 Home Assistant 使用前端的开发模式，请更新您的 `configuration.yaml` 中的前端配置，并设置为您在上一步中克隆的前端存储库的路径：

如果您正在使用 Visual Studio Code 配合 Home Assistant Core 的开发容器，则需要将前端存储库挂载到开发容器中。将以下部分添加到 Home Assistant Core 存储库的 `.devcontainer/devcontainer.json` 中：

```json
"mounts": [
  "source=/path/to/hass/frontend,target=/workspaces/frontend,type=bind,consistency=cached"
]
```

通过按 Shift+Command+P (Mac) / Ctrl+Shift+P (Windows/Linux) 打开命令面板，然后选择 **Dev Containers: Rebuild Container** 命令来重建开发容器。

在 Home Assistant Core 存储库的根目录编辑 `config/configuration.yaml`，添加以下条目：

```yaml
frontend:
  development_repo: /workspaces/frontend
```

:::note
这是开发容器内的挂载路径，请参见上面的 `target` 参数。如果 `source` 路径不正确，网页前端将无法工作。
:::

从 VS Code 运行 Home Assistant Core：
1. 打开命令面板：
   - Mac: `Shift+Command+P`
   - Windows/Linux: `Ctrl+Shift+P`
2. 选择 **Tasks: Run Task**
3. 选择 **Run Home Assistant Core**

:::caution
对 `.devcontainer/devcontainer.json` 的更改应从任何 PR 中排除，因为它包含您对 `frontend` 存储库的本地路径。由于 `.devcontainer/devcontainer.json` 中的设置仅在容器重建期间处理，所以您可以安全地在重建完成后回滚更改。
:::

#### 使用手动环境进行开发

如果您手动设置 Home Assistant Core 的开发环境，请在 `configuration.yaml` 中填写前端存储库路径：

```yaml
frontend:
  # 示例路径: /home/paulus/dev/hass/frontend
  development_repo: /path/to/hass/frontend
```

:::tip
`configuration.yaml` 文件可以在 Home Assistant Core 存储库根目录的 `config` 目录中找到。如果路径不正确或无法访问，网页前端将无法工作。
:::
</TabItem>

<TabItem value="使用 HA Core 的生产实例">

如果您希望将开发前端连接到现有的 Home Assistant 实例，而不完全替换 UI，则需要在与它连接的 Home Assistant 的 `configuration.yaml` 中添加您开发前端所在的网址。如下所示：

```yaml
http:
  cors_allowed_origins:
    - http://localhost:8124
```

在您设置了前端开发环境，以便可以运行 `script/develop` 脚本后，如 [开发](#development) 部分所述。您可以使用以下命令作为替代，在 http://localhost:8124 上开发和运行前端，并连接到运行在 http://localhost:8123 上的 Home Assistant。请注意，如果您从开发容器中运行此命令，则此 URL 应可从容器主机访问。

```shell
script/develop_and_serve
```

您可以通过传递 -c 选项来更改前端连接的 Home Assistant URL。这也适用于现有的生产核心实例。不需要是本地托管的开发版本。但是，如果您更改此选项的值，则需要在实际切换到新值之前从开发前端注销。例如：

```shell
script/develop_and_serve -c https://homeassistant.local:8123
```

您可以通过传递 -p 选项来更改前端提供的端口。请注意，如果您是从开发容器运行，您还需要设置端口转发，以便希望从容器主机访问。例如：

```shell
script/develop_and_serve -p 8654
```

</TabItem>

</Tabs>

### 安装 Node.js（仅限手动环境）

构建前端需要 Node.js。安装 node.js 的首选方法是使用 [nvm](https://github.com/nvm-sh/nvm)。使用 [README](https://github.com/nvm-sh/nvm#install--update-script) 中的说明安装 nvm，然后运行以下命令安装正确的 node.js：

```shell
nvm install
```

[Yarn](https://yarnpkg.com/en/) 被用作 node 模块的包管理器。[按照此处的说明安装 yarn。](https://yarnpkg.com/getting-started/install)

### 安装开发依赖项并获取最新翻译

通过安装开发依赖项并下载最新翻译来引导前端开发环境。

```shell
nvm use
script/bootstrap
script/setup_translations
```

:::note
即使您使用开发容器，也需要手动完成此操作。此外，您将被要求输入代码并授权脚本获取最新翻译。
:::

## 开发

### 运行开发服务器

运行此脚本以构建前端并运行开发服务器：

```shell
nvm use
script/develop
```

当脚本完成构建前端，并且 Home Assistant Core 正确设置后，前端将可在 `http://localhost:8123` 访问。当您对源文件进行更改时，服务器会自动重建前端。

### 在现有 HA 实例上运行开发前端

运行此命令以启动开发服务器：

```shell
nvm use
script/develop_and_serve -c https://homeassistant.local:8123
```

您可能需要将 "https://homeassistant.local:8123" 替换为您的本地 Home Assistant URL。

### 浏览器设置

打开 Google Chrome 的开发者工具，并确保您已禁用缓存并设置正确，以避免陈旧内容：

:::info
说明适用于 Google Chrome
:::

1. 在 **网络** > **禁用缓存** 中勾选框以禁用缓存

<p class='img'>
  <img src='/img/en/development/disable-cache.png' />
</p>

2. 在 **应用** > **服务工作者** > **为网络旁路** 中启用旁路

<p class='img'>
  <img src='/img/en/development/bypass-for-network.png' />
</p>

## 创建拉取请求

如果您计划向 Home Assistant 代码库提交 PR，您需要分叉前端项目并将您的分叉作为远程添加到 Home Assistant 前端库。

```shell
git remote add fork <github URL to your fork>
```

当您完成更改并准备推送时，切换到前端项目的工作目录，然后推送您的更改：

```bash
git add -A
git commit -m "添加新功能 X"
git push -u fork HEAD
```

## 构建前端

如果您对前端的打包方式进行更改，可能需要尝试在主存储库中使用新的打包构建（而不是指向前端存储库）。为此，首先通过运行 `script/build_frontend` 来构建前端的生产版本。

要在 Home Assistant 中进行测试，请从主 Home Assistant 存储库运行以下命令：

```shell
pip3 install -e /path/to/hass/frontend/ --config-settings editable_mode=compat
hass --skip-pip-packages home-assistant-frontend
```

[hass-frontend]: https://github.com/home-assistant/frontend