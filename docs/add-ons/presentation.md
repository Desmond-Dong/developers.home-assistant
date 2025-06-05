---
title: "介绍你的附加组件"
---

如果你选择将你的附加组件公开，提供清晰的信息、图形和安全保证将有助于吸引用户。以下建议是展示你的附加组件的指南。

## 添加介绍

这部分显示在附加组件商店中，并为用户提供附加组件的简短描述。

包含介绍的文件通常被称为“README”，通常发布为 `README.md` 文件。

## 添加文档

良好的文档可以帮助你的附加组件的使用者理解其用法，解释配置选项，在用户有问题或遇到问题时指引他们，并包含附加组件发布时所采用的许可证。

包含文档的文件通常被称为“DOCS”，通常发布为 `DOCS.md` 文件。

## 附加组件图标和logo

一图胜千言。因此，通过添加合适的图像图标和logo，可以改善你的附加组件的表现。这些图像在Home Assistant Supervisor面板中展示你的附加组件时使用，并将显著提高你附加组件的视觉表现。

你附加组件logo的要求：

- logo必须为可移植网络图形格式（`.png`）。
- 文件名必须为 `logo.png`。
- 建议保持logo大小在250x100px左右。你可以选择适合你附加组件的不同大小或纵横比。

你附加组件图标的要求：

- 图标必须为可移植网络图形格式（`.png`）。
- 文件名必须为 `icon.png`。
- 图标的纵横比必须为1x1（正方形）。
- 建议使用128x128px的图标大小。

## 保持变更日志

你可能会在未来发布附加组件的新版本。如果发生这种情况，附加组件的用户将看到升级通知，并且可能想知道最新版本中做了哪些更改。

变更日志是一个包含你的附加组件每个版本的重要变化的经过审定、按时间顺序排列的列表的文件，通常发布为 `CHANGELOG.md` 文件。

有关保持变更日志的建议，我们推荐访问 [keep a changelog](http://keepachangelog.com) 网站。他们制定了许多全球开源项目使用的标准。

## 提供稳定版和金丝雀版

你可能考虑提供稳定版和“下一个”或“金丝雀”分支。这些分支可以通过不同的分支提供。在Home Assistant中添加附加组件时，用户可以通过在后面附加其名称和#来选择所需的分支。

```text
https://github.com/home-assistant/hassio-addons-example#next
```

你应该将此信息添加到文档中。此外，你还应考虑在每个分支中使用不同的 [仓库名称](/docs/add-ons/repository#repository-configuration)，例如“超级附加组件（稳定版）”和“超级附加组件（测试版）”。

## AppArmor

如果API调用返回一些你作为开发者没有预料到的内容，访问过多的资源可能会对你的用户造成潜在的风险。作为附加组件的开发者，你有责任确保你的附加组件不会破坏用户的机器或执行你永远不会预期的操作。这就是AppArmor的作用。

虽然这里不对你的输入验证、处理敏感数据和其他防御性编程策略的才能进行评判，但AppArmor是你附加组件对恶意API调用、格式错误的设置或其他形式的系统劫持的第二道防线。

默认情况下，AppArmor通过限制某些被认为不适合Docker容器的一般操作，为你提供了一定水平的安全性。你可以在 [Docker安全页面](https://docs.docker.com/engine/security/apparmor/) 上了解有关Docker的AppArmor实现的更多信息。

至于Home Assistant的实现，你可以通过将 `apparmor.txt` 文件放入你的附加组件文件夹中激活自己的自定义AppArmor配置。添加自己的 `apparmor.txt` 将加载该文件作为主要的AppArmor配置，而不是默认实现。除了知道你的附加组件将在一个受限和有效的方式下运行，编写自己的自定义 `apparmor.txt` 文件还将在你的附加组件安装后为其赢得一个安全分，这样可以提高用户对你的附加组件的信心和印象。

`apparmor.txt` 文件与 `config.yaml` 文件位于同一文件夹。下面是一个 `apparmor.txt` 的示例。将 `ADDON_SLUG` 替换为在附加组件配置中定义的slug。

apparmor.txt

```txt
#include <tunables/global>

profile ADDON_SLUG flags=(attach_disconnected,mediate_deleted) {
  #include <abstractions/base>

  # 能力
  file,
  signal (send) set=(kill,term,int,hup,cont),

  # S6-Overlay
  /init ix,
  /bin/** ix,
  /usr/bin/** ix,
  /run/{s6,s6-rc*,service}/** ix,
  /package/** ix,
  /command/** ix,
  /etc/services.d/** rwix,
  /etc/cont-init.d/** rwix,
  /etc/cont-finish.d/** rwix,
  /run/{,**} rwk,
  /dev/tty rw,

  # Bashio
  /usr/lib/bashio/** ix,
  /tmp/** rwk,

  # 访问options.json和你附加组件内的其他文件
  /data/** rw,

  # 为服务启动新配置
  /usr/bin/myprogram cx -> myprogram,

  profile myprogram flags=(attach_disconnected,mediate_deleted) {
    #include <abstractions/base>

    # 接收来自S6-Overlay的信号
    signal (receive) peer=*_ADDON_SLUG,

    # 访问options.json和你附加组件内的其他文件
    /data/** rw,

    # 访问config.json中指定的映射卷
    /share/** rw,

    # 服务功能所需的访问权限
    /usr/bin/myprogram r,
    /bin/bash rix,
    /bin/echo ix,
    /etc/passwd r,
    /dev/tty rw,
  }
}
```

在为自己的附加组件工作时，以下提示应有助于你入门：

1. 这部分的S6相对标准。你可能需要添加一些内容来适应你的设置脚本，但通常不应删除任何内容。
2. 如果运行的服务提供了AppArmor配置，请将其应用于该服务。始终优先使用开发者编写的配置。
3. 如果某个服务没有提供配置，而你想自己制作一个，请按照以下步骤进行：
  a. 添加你知道的服务所需的最小权限。你绝对知道服务需要的内容
  b. 将`complain`作为标志添加到配置中
  c. 运行附加组件并使用 `journalctl _TRANSPORT="audit" -g 'apparmor="ALLOWED"'` 查看审核日志
  d. 逐步添加权限，直到使用附加组件不再生成任何审核警告
  e. 移除`complain`标志，以便未授权访问被DENIED而不是ALLOWED
4. 更新服务时重复步骤#3，因为可能需要新权限

## Ingress

Ingress允许用户通过Home Assistant UI访问附加组件的Web界面。身份验证由Home Assistant处理，因此用户和附加组件开发者都无需关心安全性或端口转发。用户非常喜欢这个功能！它直接将用户连接到附加组件，可以在Home Assistant中提供无缝的用户体验，并为你的附加组件提供两点安全性。

以下是Ingress的要求：
- 必须启用Ingress。在 [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) 中设置 `ingress: true`。
- 你的服务器可能运行在8099端口。如果它不运行在8099，你必须在 [`config.yaml`](/docs/add-ons/configuration/#add-on-config) 中设置 `ingress_port: PORT_NUMBER` 以匹配你的配置。
- 只允许来自 `172.30.32.2` 的连接。你应该拒绝对附加组件服务器中所有其他IP地址的访问。
- 用户在Home Assistant中经过身份验证。身份验证不是必需的。

:::tip
路径和端口信息的配置可以通过 [附加组件信息API端点](/docs/api/supervisor/endpoints/#addons) 查询。如果你的附加组件需要Home Assistant的URL，Ingress会添加请求头 `X-Ingress-Path`，可以过滤以获取基本URL。
:::

Ingress API网关支持以下内容：

- HTTP/1.x
- 流媒体内容
- Websockets

## 使用Nginx的基本Ingress示例

以下是使用Nginx服务器的基本Ingress实现。包含示例 `Dockerfile`， `config.yaml` 和 `ingress.conf` 配置。

`ingress.conf` 配置为仅接受来自IP地址 `172.30.32.2` 的连接，因为我们仅期望此IP地址的Ingress连接。任何其他IP地址将被拒绝。Ingress端口8099被用于减少配置工作。如果你希望配置不同的Ingress端口可以这样做，但 `config.yaml` 的选项 `ingress_port` 必须定义以匹配。

ingress.conf

```nginx
server {
    listen 8099;
    allow  172.30.32.2;
    deny   all;
}
```

我们的示例 `Dockerfile` 只支持我们的Nginx服务器，且与大多数附加组件不同，不支持 `run.sh`。你可以用自己的命令替换 `CMD` 以允许在启动附加组件时有更多的配置选项。此Dockerfile将 `RUN` 安装我们的Nginx依赖项， `COPY` 上面的示例 `ingress.conf` 到附加组件容器，然后 `CMD` 启动Nginx。

Dockerfile

```dockerfile
ARG BUILD_FROM
FROM $BUILD_FROM

# 添加nginx并为nginx创建运行文件夹。
RUN \
  apk --no-cache add \
    nginx \
  \
  && mkdir -p /run/nginx

# 将我们的配置复制到nginx http.d文件夹中。
COPY ingress.conf /etc/nginx/http.d/

# 带有调试选项启动nginx。
CMD [ "nginx","-g","daemon off;error_log /dev/stdout debug;" ]
```

为了启用Ingress，我们的 `config.yaml` 文件 _必须_ 包含 `ingress: true` ，并 _可以_ 指定 `ingress_port`，以及其他必需的信息。

config.yaml

```yaml
name: "Ingress示例"
version: "1.0.0"
slug: "nginx-ingress-example"
description: "Ingress测试"
arch:
  - amd64
  - armhf
  - armv7
  - i386
ingress: true
```

附加组件启动后，你应该能够通过点击附加组件信息屏幕中的“打开Web UI”来查看你的Ingress服务器。

## 安全性

附加组件的安全性应该是自豪的事情。你应该努力达到尽可能最高的安全级别。如果你的附加组件的安全评分较低，用户就不太可能信任它。

每个附加组件的基础评分为5，满分为6。根据开发过程中做出的决定，你将根据某些操作获得评分。有些操作会产生额外的后果。这些额外的后果在下表的注释部分中列出。

| 操作 | 更改 | 注释 |
|---|---|---|
| 在 [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) 中使用 `ingress: true` | +2 | 覆盖 `auth_api` 评分 |
| 在 [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) 中使用 `auth_api: true` | +1 | 被 `ingress` 覆盖 |
| 附加组件由 [CodeNotary](https://cas.codenotary.com/) 签名 | +1 | |
| 使用自定义 [`apparmor.txt`](/docs/add-ons/presentation#apparmor) | +1 | 安装后应用评分 |
| 在 [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) 中设置 `apparmor: false` | -1 | |
| 在 [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) 中使用 `privileged: NET_ADMIN`, `SYS_ADMIN`, `SYS_RAWIO`, `SYS_PTRACE`, `SYS_MODULE`, 或 `DAC_READ_SEARCH`，或者使用 `kernel_modules:` | -1 | 评分仅在使用多个时应用一次。 |
| 在 [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) 中使用 `hassio_role: manager` | -1 | |
| 在 [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) 中使用 `host_network: true` | -1 | |
| 在 [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) 中使用 `hassio_role: admin` | -2 | |
| 在 [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) 中使用 `host_pid: true` | -2 | |
| 在 [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) 中使用 `host_uts: true` 和 `privileged: SYS_ADMIN` | -1 | |
| 在 [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) 中使用 `full_access: true` | 安全性设为1 | 覆盖所有其他调整 |
| 在 [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) 中使用 `docker_api: true` | 安全性设为1 | 覆盖所有其他调整 |