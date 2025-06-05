---
title: "教程：创建你的第一个插件"
---

所以你已经启动了 Home Assistant，并且一直在享受内置的插件，但你缺少这个应用程序。是时候制作你自己的插件了！

要开始开发插件，我们首先需要访问 Home Assistant 查找本地插件的位置。你可以使用 [Samba](https://my.home-assistant.io/redirect/supervisor_addon/?addon=core_samba) 或者 [SSH](https://my.home-assistant.io/redirect/supervisor_addon/?addon=core_ssh) 插件。

对于 Samba，一旦你启用并启动它，你的 Home Assistant 实例将在你的本地网络标签中显示，并共享一个名为 "addons" 的文件夹。这是存储你自定义插件的文件夹。

:::tip
如果你使用的是 macOS 而文件夹没有自动显示，请打开 Finder 并按 CMD+K，然后输入 `smb://homeassistant.local`
:::

对于 SSH，你需要安装它。在启动之前，你需要有一对私钥/公钥，并将你的公钥存储在插件配置中（[查看更多信息](https://github.com/home-assistant/addons/blob/master/ssh/DOCS.md#configuration)）。一旦启动，你可以通过 SSH 连接到 Home Assistant，并将你的自定义插件存储在 `/addons` 目录中。

一旦你找到插件目录，就可以开始了！

## 第一步：基本信息

- 创建一个名为 `hello_world` 的新目录
- 在该目录内创建三个文件：
  - `Dockerfile`
  - `config.yaml`
  - `run.sh`

### `Dockerfile` 文件

这是将用于构建你的插件的镜像。

```dockerfile
ARG BUILD_FROM
FROM $BUILD_FROM

# 复制插件的数据
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
```

### `config.yaml` 文件

这是你的插件配置，用于告诉 Supervisor 做什么以及如何展示你的插件。

有关所有有效插件配置选项的概览，请查看 [这里](/docs/add-ons/configuration#add-on-configuration)

```yaml
name: "Hello world"
description: "我的第一个真正的插件！"
version: "1.0.0"
slug: "hello_world"
init: false
arch:
  - aarch64
  - amd64
  - armhf
  - armv7
  - i386
```

### `run.sh` 文件

这是你的插件启动时将运行的脚本。

```shell
#!/usr/bin/with-contenv bashio

echo "Hello world!"
```

:::note
确保你的编辑器使用 UNIX 风格的换行符 (LF)，而不是 DOS/Windows 风格 (CRLF)。
:::

## 第二步：安装和测试你的插件

现在进入有趣的部分，打开 Home Assistant 界面，安装和运行你的插件。

- 打开 Home Assistant 前端
- 前往 "设置"
- 点击 "插件"
- 在右下角点击 "插件商店"。

[![打开你的 Home Assistant 实例并显示 Supervisor 插件商店。](https://my.home-assistant.io/badges/supervisor_store.svg)](https://my.home-assistant.io/redirect/supervisor_store/)

- 在右上角的溢出菜单中，点击 "检查更新" 按钮
- 根据需要刷新你的网页
- 现在你应该在商店顶部看到一个名为 "本地插件" 的新部分，其中列出了你的插件！

![本地库卡片的截图](/img/en/hass.io/screenshots/local_repository.png)

- 点击你的插件以查看插件详情页面。
- 安装你的插件
- 启动你的插件
- 点击 "日志" 标签，并刷新你的插件日志，你应该现在在日志中看到 "Hello world!"。

![插件日志的截图](/img/en/hass.io/tutorial/addon_hello_world_logs.png)

### 我看不到我的插件?!

哎呀！你在商店中点击了 "检查更新"，但你的插件没有显示。或者你刚刚更新了一个选项，点击刷新后看到了你的插件消失。

发生这种情况时，首先尝试通过按 `Ctrl + F5` 刷新浏览器的缓存。如果这没有帮助，说明你的 `config.yaml` 无效。它可能是 [无效的 YAML](http://www.yamllint.com/) 或者指定的某个选项不正确。要查看发生了什么错误，请转到 Supervisor 面板，在 Supervisor 卡片上点击 "查看日志"。这将带你到一个显示 Supervisor 日志的页面。滚动到底部，你应该能够找到验证错误。

一旦你修正了错误，转到插件商店再次点击 "检查更新"。

## 第三步：托管服务器

到目前为止我们已经能够做一些基本的事情，但这还不够有用。接下来我们进一步，托管一个服务器并在一个端口上公开它。为此我们将使用 Python 3 自带的 HTTP 服务器。

为此，我们需要按如下方式更新文件：

- `Dockerfile`：安装 Python 3
- `config.yaml`：让容器中的端口可在主机上使用
- `run.sh`：运行 Python 3 命令以启动 HTTP 服务器

更新你的 `Dockerfile`：

```dockerfile
ARG BUILD_FROM
FROM $BUILD_FROM

# 安装插件的需求
RUN \
  apk add --no-cache \
    python3

# Python 3 HTTP 服务器提供当前工作目录
# 所以我们将它设置为我们的插件持久数据目录。
WORKDIR /data

# 复制插件的数据
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
```

在 `config.yaml` 中添加 "ports"。这将使容器内的 TCP 端口 8000 在主机上的 8000 端口上可用。

```yaml
name: "Hello world"
description: "我的第一个真正的插件！"
version: "1.1.0"
slug: "hello_world"
init: false
arch:
  - aarch64
  - amd64
  - armhf
  - armv7
  - i386
startup: services
ports:
  8000/tcp: 8000
```

更新 `run.sh` 以启动 Python 3 服务器：

```shell
#!/usr/bin/with-contenv bashio

echo "Hello world!"

python3 -m http.server 8000
```

## 第四步：安装更新

由于我们在 `config.yaml` 中更新了版本号，Home Assistant 在查看插件详情时会显示更新按钮。你可能需要刷新浏览器或在插件商店中点击 "检查更新" 按钮以使其显示。如果你没有更新版本号，你也可以卸载并再次安装插件。再次安装插件后，请确保启动它。

现在导航到 [http://homeassistant.local:8000](http://homeassistant.local:8000) 以查看我们的服务器在运行！

![插件提供的文件索引的截图](/img/en/hass.io/tutorial/python3-http-server.png)

## 附加内容：处理插件选项

在截图中，你可能看到我们的服务器只服务了一个文件：`options.json`。该文件包含此插件的用户配置。因为我们在 `config.yaml` 中为键 "options" 和 "schema" 指定了两个空对象，所以结果文件当前是空的。

让我们看看能否在该文件中获取一些数据！

为此，我们需要指定默认选项以及一个让用户更改选项的模式。在 `config.yaml` 中将选项和模式条目更改为以下内容：

```yaml
...
options:
  beer: true
  wine: true
  liquor: false
  name: "world"
  year: 2017
schema:
  beer: bool
  wine: bool
  liquor: bool
  name: str
  year: int
...
```

重新加载插件商店并重新安装你的插件。现在你会在插件配置屏幕中看到可用的选项。当你现在返回到我们的 Python 3 服务器并下载 `options.json` 时，你会看到你设置的选项。[在 `run.sh` 中使用 options.json 的示例](https://github.com/home-assistant/addons/blob/master/dhcp_server/data/run.sh#L10-L13)

## 附加内容：模板插件库

我们维护了一个完整的插件模板示例库，你可以使用它来入门。你可以在 [`home-assistant/addons-example` 仓库](https://github.com/home-assistant/addons-example) 中找到它。