---
title: "附加组件配置"
---

每个附加组件存储在一个文件夹中。文件结构如下所示：

```text
addon_name/
  translations/
    en.yaml
  apparmor.txt
  build.yaml
  CHANGELOG.md
  config.yaml
  DOCS.md
  Dockerfile
  icon.png
  logo.png
  README.md
  run.sh
```

:::note
翻译文件、`config` 和 `build` 都支持 `.json`、`.yml` 和 `.yaml` 作为文件类型。

为了简单起见，所有示例都使用 `.yaml`
:::

## 附加组件脚本

与每个 Docker 容器一样，您需要一个在容器启动时运行的脚本。用户可能会运行多个附加组件，因此如果您正在做简单的事情，建议尽量坚持使用 Bash 脚本。

我们的所有镜像也安装了 [bashio][bashio]。它包含一组常用操作，可以在附加组件中使用，以减少跨附加组件的代码重复，从而使开发和维护附加组件变得更容易。

编写脚本时：

- `/data` 是一个用于持久存储的卷。
- `/data/options.json` 包含用户配置。您可以使用 Bashio 解析这些数据。

```shell
CONFIG_PATH=/data/options.json

TARGET="$(bashio::config 'target')"
```

因此，如果您的 `options` 包含

```json
{ "target": "beer" }
```

那么在您的 bash 文件的环境中将会有一个变量 `TARGET`，值为 `beer`。

[bashio]: https://github.com/hassio-addons/bashio

## 附加组件 Dockerfile

所有附加组件都基于最新的 Alpine Linux 镜像。Home Assistant 将根据机器架构自动替换正确的基础镜像。如果您需要在不同的时区运行，请添加 `tzdata`。`tzdata` 已经添加到我们的基础镜像中。

```dockerfile
ARG BUILD_FROM
FROM $BUILD_FROM

# 安装附加组件的要求
RUN \
  apk add --no-cache \
    example_alpine_package

# 复制附加组件的数据
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
```

如果您不使用设备上的本地构建或我们的构建脚本，请确保 Dockerfile 还包含一组包含以下内容的标签：

```dockerfile
LABEL \
  io.hass.version="VERSION" \
  io.hass.type="addon" \
  io.hass.arch="armhf|aarch64|i386|amd64"
```

您可以使用 `build.yaml` 使用自己的基础镜像，或者如果您不需要支持自动多架构构建，您也可以使用简单的 docker `FROM`。您还可以使用特定架构后缀 Dockerfile，以针对特定架构使用特定 Dockerfile，例如 `Dockerfile.amd64`。

### 构建参数

默认情况下，我们支持以下构建参数：

| ARG | 描述 |
|-----|-------------|
| `BUILD_FROM` | 持有动态构建或在我们的系统上构建的镜像。 |
| `BUILD_VERSION` | 附加组件版本（从 `config.yaml` 读取）。 |
| `BUILD_ARCH` | 持有当前构建架构。 |

## 附加组件配置

附加组件的配置存储在 `config.yaml` 中。

```yaml
name: "Hello world"
version: "1.1.0"
slug: folder
description: >-
  "长描述"
arch:
  - amd64
url: "有关该附加组件的更多信息的网页（例如支持的论坛主题）"
ports:
  123/tcp: 123
map:
  - type: share
    read_only: False
  - type: ssl
  - type: homeassistant_config
    read_only: False
    path: /custom/config/path
image: repo/{arch}-my-custom-addon
```

:::note
避免在您的附加组件中将 `config.yaml` 作为文件名用于附加组件配置以外的任何内容。Supervisor 会递归搜索附加组件存储库中的 `config.yaml`。
:::

### 必需的配置选项

| 键 | 类型 | 描述 |
| --- | ---- | ----------- |
| `name` | string | 附加组件的名称。 |
| `version` | string | 附加组件的版本。如果您使用带有 `image` 选项的 Docker 镜像，则需要与将使用的镜像的标签匹配。 |
| `slug` | string | 附加组件的 slug。此项在附加组件发布的 [存储库](/docs/add-ons/repository) 范围内需要唯一，并且 URI 友好。 |
| `description` | string | 附加组件的描述。 |
| `arch` | list | 支持的架构列表：`armhf`，`armv7`，`aarch64`，`amd64`，`i386`。 |

### 可选配置选项

| 键 | 类型 | 默认值 | 描述 |
| --- | ---- | -------- | ----------- |
| `machine` | list | | 默认支持所有机器类型。 您可以配置附加组件仅在特定机器上运行。 您可以在机器类型前使用 `!` 来否定它。 |
| `url` | url | | 附加组件的主页。在这里，您可以解释附加组件和选项。 |
| `startup` | string | `application` | `initialize` 将在 Home Assistant 设置时启动附加组件。 `system` 用于像数据库这样的东西，不依赖于其他事物。 `services` 将在 Home Assistant 之前启动，而 `application` 在之后启动。最后，`once` 是用于不会作为守护进程运行的应用程序。 |
| `webui` | string | | 此附加组件的 Web 界面的 URL。像 `http://[HOST]:[PORT:2839]/dashboard`，端口需要内部端口，将用有效端口替换。还可以将协议部分绑定到配置选项，格式为: `[PROTO:option_name]://[HOST]:[PORT:2839]/dashboard`，并在其为 `true` 时查找，并将其转换为 `https`。 |
| `boot` | string | `auto` | `auto` 启动时由系统控制，`manual` 配置附加组件仅在手动时启动。如果附加组件不应在启动时自动启动，请使用 `manual_only` 来防止用户更改它。 |
| `ports` | dict | | 从容器暴露的网络端口。格式为 `"container-port/type": host-port`。如果主机端口为 `null`，则禁用映射。 |
| `ports_description` | dict | | 网络端口描述映射。格式为 `"container-port/type": "该端口的描述"`。另外使用 [端口描述翻译](#port-description-translations)。 |
| `host_network` | bool | `false` | 如果为 `true`，附加组件将在主机网络上运行。 |
| `host_ipc` | bool | `false` | 允许与其他人共享 IPC 命名空间。 |
| `host_dbus` | bool | `false` | 将主机 D-Bus 服务映射到附加组件中。 |
| `host_pid` | bool | `false` | 允许容器在主机 PID 命名空间上运行，仅适用于未保护的附加组件。 **警告:** 不与 S6 Overlay 一起使用。如果需要将此设置为 `true`，并且您使用正常的附加组件基础镜像，您可以通过覆盖 `/init` 禁用 S6。或使用替代基础镜像。 |
| `host_uts` | bool | `false` | 使用主机的 UTS 命名空间。 |
| `devices` | list | | 映射到附加组件中的设备列表。格式为: `<path_on_host>`。例如，`/dev/ttyAMA0` |
| `homeassistant` | string | | 为附加组件固定所需的最低 Home Assistant Core 版本。值为如 `2022.10.5` 的版本字符串。 |
| `hassio_role` | str | `default` | 根据角色访问 Supervisor API。可用: `default`，`homeassistant`，`backup`，`manager` 或 `admin` |
| `hassio_api` | bool | `false` | 此附加组件可以访问 Supervisor 的 REST API。使用 `http://supervisor`。 |
| `homeassistant_api` | bool | `false` | 此附加组件可以访问 Home Assistant REST API 代理。使用 `http://supervisor/core/api`。 |
| `docker_api` | bool | `false` | 允许对附加组件的 Docker API 只读访问。仅适用于未保护的附加组件。 |
| `privileged` | list | | 对硬件/系统的访问权限。可用的访问权限包括: `BPF`，`CHECKPOINT_RESTORE`，`DAC_READ_SEARCH`，`IPC_LOCK`，`NET_ADMIN`，`NET_RAW`，`PERFMON`，`SYS_ADMIN`，`SYS_MODULE`，`SYS_NICE`，`SYS_PTRACE`，`SYS_RAWIO`，`SYS_RESOURCE` 或 `SYS_TIME`。 |
| `full_access` | bool | `false` | 给予对硬件的完全访问权限，如 Docker 中的特权模式。仅适用于未保护的附加组件。考虑使用其他附加组件选项而不是此选项，如 `devices`。如果您启用此选项，请不要添加 `devices`，`uart`，`usb` 或 `gpio`，因为这没必要。 |
| `apparmor` | bool/string | `true` | 启用或禁用 AppArmor 支持。如果它已启用，您还可以使用自定义配置文件。 |
| `map` | list | | 需要绑定装载到容器中的 Home Assistant 目录类型列表。可能的值包括: `homeassistant_config`，`addon_config`，`ssl`，`addons`，`backup`，`share`，`media`，`all_addon_configs` 和 `data`。默认为只读，您可以通过添加属性 `read_only: false` 来更改。默认情况下，所有路径映射到附加组件容器内部的 `/<type-name>`，但也可以提供一个可选的 `path` 属性来配置路径（示例: `path: /custom/config/path`）。如果使用，路径必须为空、与附加组件定义的任何其他路径唯一且不是根路径。请注意，`data` 目录始终映射并可写，但 `path` 属性可以使用相同的约定进行设置。 |
| `environment` | dict | | 用于运行附加组件的环境变量字典。 |
| `audio` | bool | `false` | 标记该附加组件使用内部音频系统。我们将工作中的 PulseAudio 设置映射到容器中。如果您的应用程序不支持 PulseAudio，您可能需要安装: Alpine Linux 的 `alsa-plugins-pulse` 或 Debian/Ubuntu 的 `libasound2-plugins`。 |
| `video` | bool | `false` | 标记该附加组件使用内部视频系统。所有可用设备都将映射到附加组件中。 |
| `gpio` | bool | `false` | 如果设置为 `true`，`/sys/class/gpio` 将映射到附加组件中，以便从内核访问 GPIO 接口。一些库还需要 `/dev/mem` 和 `SYS_RAWIO` 以实现对该设备的读/写访问。在启用了 AppArmor 的系统上，您需要禁用 AppArmor 或为附加组件提供自己的配置文件，这对安全更有利。 |
| `usb` | bool | `false` | 如果设置为 `true`，它将把原始 USB 访问 `/dev/bus/usb` 映射到附加组件中，并提供即插即用支持。 |
| `uart` | bool | `false` | 默认 `false`。自动映射来自主机的所有 UART/串行设备到附加组件中。 |
| `udev` | bool | `false` | 默认 `false`。将其设置为 `true` 将使主机的 udev 数据库以只读方式挂载到附加组件中。 |
| `devicetree` | bool | `false` | 如果设置为 `true`，`/device-tree` 将映射到附加组件中。 |
| `kernel_modules` | bool | `false` | 将主机内核模块和配置映射到附加组件中（只读），并给予您 `SYS_MODULE` 权限。 |
| `stdin` | bool | `false` | 如果启用，您可以使用 Home Assistant API 的 STDIN。 |
| `legacy` | bool | `false` | 如果 Docker 镜像没有 `hass.io` 标签，您可以启用遗留模式以使用配置数据。 |
| `options` | dict | | 附加组件的默认选项值。 |
| `schema` | dict | | 附加组件选项值的模式。可以设置为 `false` 以禁用模式验证和选项。 |
| `image` | string | | 用于 Docker Hub 和其他容器注册中心。这应设置为镜像的名称（例如，`ghcr.io/home-assistant/{arch}-addon-example`）。如果您使用此选项，请使用 `version` 选项设置活动的 docker 标签。 |
| `codenotary` | string | | 用于 Codenotary CAS 的使用。此邮箱地址用于验证您的镜像与 Codenotary（例如，`example@home-assistant.io`）。这应与在 [附加组件的扩展构建选项](#add-on-extended-build) 中用作签名者的邮箱地址匹配。 |
| `timeout` | integer | 10 | 默认 10（秒）。等待 Docker 守护进程完成或将被杀死的超时时间。 |
| `tmpfs` | bool | `false` | 如果设置为 `true`，则容器的 `/tmp` 使用 tmpfs，一个内存文件系统。 |
| `discovery` | list | | 此附加组件为 Home Assistant 提供的服务列表。 |
| `services` | list | | 此附加组件将提供或使用的服务列表。格式为 `service`:`function`，函数为：`provide`（此附加组件可以提供此服务）、`want`（此附加组件可以使用此服务）或 `need`（此附加组件需要此服务才能正常工作）。 |
| `auth_api` | bool | `false` | 允许访问 Home Assistant 用户后端。 |
| `ingress` | bool | `false` | 启用附加组件的 ingress 功能。 |
| `ingress_port` | integer | `8099` | 对于在主机网络上运行的附加组件，您可以使用 `0` 并稍后通过 API 读取端口。 |
| `ingress_entry` | string | `/` | 修改 URL 入口点。 |
| `ingress_stream` | bool | `false` | 启用时，附加组件的请求会被流式传输。 |
| `panel_icon` | string | `mdi:puzzle` | [MDI 图标](https://materialdesignicons.com/) 用于菜单面板集成。 |
| `panel_title` | string | | 默认为附加组件名称，但可以通过该选项进行修改。 |
| `panel_admin` | bool | `true` | 使菜单项仅对管理员组中的用户可用。 |
| `backup` | string | `hot` | `hot` 或 `cold`。如果为 `cold`，则 Supervisor 在备份之前关闭附加组件（使用 `cold` 时忽略 `pre/post` 选项）。 |
| `backup_pre` | string | | 在备份之前在附加组件上下文中执行的命令。 |
| `backup_post` | string | | 在备份之后在附加组件上下文中执行的命令。 |
| `backup_exclude` | list | | 从备份中排除的文件/路径列表（支持通配符）。 |
| `advanced` | bool | `false` | 将此设置为 `true` 以要求用户启用“高级”模式以显示。 |
| `stage` | string | `stable` | 标记附加组件，具有以下属性: `stable`、`experimental` 或 `deprecated`。标记为 `experimental` 或 `deprecated` 的附加组件将在商店中不显示，除非用户启用高级模式。 |
| `init` | bool | `true` | 将此设置为 `false` 以禁用 Docker 默认的系统初始化。如果镜像有自己的初始化系统（如 [s6-overlay](https://github.com/just-containers/s6-overlay)），请使用此选项。 *注意: 从 S6 的 V3 开始，将此设置为 `false` 是必需的，否则附加组件将无法启动，更多信息请见 [这里](https://developers.home-assistant.io/blog/2022/05/12/s6-overlay-base-images)。* |
| `watchdog` | string | | 监控附加组件健康的 URL。像 `http://[HOST]:[PORT:2839]/dashboard`，端口需要内部端口，将用有效端口替换。也可以将协议部分绑定到配置选项，格式为: `[PROTO:option_name]://[HOST]:[PORT:2839]/dashboard`，并在其为 `true` 时查找，并将其转换为 `https`。对于简单的 TCP 端口监控，您可以使用 `tcp://[HOST]:[PORT:80]`。它适用于主机或内部网络上的附加组件。 |
| `realtime` | bool | `false` | 给予附加组件访问主机调度的权限，包括 `SYS_NICE` 用于更改执行时间/优先级。 |
| `journald` | bool | `false` | 如果设置为 `true`，主机的系统日志将以只读方式映射到附加组件中。大多数时候，日志将在 `/var/log/journal` 中，但在某些主机上，您会发现它在 `/run/log/journal` 中。依赖此能力的附加组件应检查目录 `/var/log/journal` 是否已填充，如果没有则回退到 `/run/log/journal`。 |
| `breaking_versions` | list | | 附加组件的破坏性版本列表。如果更新到破坏性版本或跨越破坏性版本，手动更新将始终是必需的，即使用户已启用附加组件的自动更新。 |

### 选项 / 模式

`options` 字典包含所有可用选项及其默认值。将默认值设置为 `null` 或在 `schema` 字典中定义数据类型，以使选项为必需。这样选项必须由用户在附加组件启动之前提供。支持嵌套数组和字典，最大深度为二。

要真正使选项可选（没有默认值），需要使用 `schema` 字典。将 `?` 放在数据类型的末尾，并且 *不要* 在 `options` 字典中定义任何默认值。如果给出了任何默认值，则该选项将变为必填值。

```yaml
message: "custom things"
logins:
  - username: beer
    password: "123456"
  - username: cheep
    password: "654321"
random:
  - haha
  - hihi
link: "http://example.com/"
size: 15
count: 1.2
```

:::note
如果您从已经部署到用户的附加组件中移除配置选项，建议删除该选项以避免警告，如 `Option '<options_key>' does not exist in the schema for <Add-on Name> (<add-on slug>)`。

要删除选项，可以使用 Supervisor addons API。使用 bashio 这归结为 `bashio::addon.option '<options_key>'`（不带额外参数以删除此选项键）。通常，这应该在一个检查选项是否仍然设置的 if 块中调用，使用 `bashio::config.exists '<options_key>'`。
:::

`schema` 看起来与 `options` 相似，但描述我们应如何验证用户输入。例如：

```yaml
message: str
logins:
  - username: str
    password: str
random:
  - "match(^\\w*$)"
link: url
size: "int(5,20)"
count: float
not_need: "str?"
```

我们支持：

- `str` / `str(min,)` / `str(,max)` / `str(min,max)`
- `bool`
- `int` / `int(min,)` / `int(,max)` / `int(min,max)`
- `float` / `float(min,)` / `float(,max)` / `float(min,max)`
- `email`
- `url`
- `password`
- `port`
- `match(REGEX)`
- `list(val1|val2|...)`
- `device` / `device(filter)`：设备过滤器可以采用以下格式: `subsystem=TYPE`，例如 `subsystem=tty` 表示串行设备。

## 附加组件扩展构建

附加组件的附加构建选项存储在 `build.yaml` 中。此文件将从我们的构建系统读取。
仅在您没有使用默认镜像或需要其他东西时需要此文件。

```yaml
build_from:
  armhf: mycustom/base-image:latest
squash: false
args:
  my_build_arg: xy
```

| 键 | 必需 | 描述 |
| --- | -------- | ----------- |
| build_from | 否 | 一个字典，键为硬件架构，值为基础 Docker 镜像。 |
| squash | 否 | 默认 `False`。小心使用此选项，因为您不能在那之后将镜像用于缓存内容！ |
| args | 否 | 允许作为字典的附加 Docker 构建参数。 |
| labels | 否 | 允许作为字典的附加 Docker 标签。 |
| codenotary | 否 | 启用与 codenotary CAS 的容器签名。 |
| codenotary.signer | 否 | 此镜像的所有者签署者邮箱地址。 |
| codenotary.base_image | 否 | 验证基础容器镜像。如果您使用我们的官方镜像，请使用 `notary@home-assistant.io`。 |

我们提供一组 [基础镜像][docker-base]，应该能覆盖很多需求。如果您不想使用基于 Alpine 的版本或需要特定的镜像标签，请随意使用 `build_from` 选项固定此要求。

[docker-base]: https://github.com/home-assistant/docker-base

## 附加组件翻译

附加组件可以提供用于 UI 的配置选项的翻译文件。

翻译文件的示例路径: `addon/translations/{language_code}.yaml`

对于 `{language_code}` 使用有效的语言代码，例如 `en`，有关完整列表，请查看 [这里](https://github.com/home-assistant/frontend/blob/dev/src/translations/translationMetadata.json)，`en.yaml` 将是一个有效的文件名。

此文件支持两个主要键 `configuration` 和 `network`。

### 配置翻译

```yaml
configuration:
  ssl:
    name: 启用 SSL
    description: 启用附加组件内 Web 服务器上的 SSL 使用
```

_在这种情况下，`configuration` 下的键 (`ssl`) 需要与您的 `schema` 配置中的键匹配（在 [`config.yaml`](#add-on-configuration) 中）。_

### 端口描述翻译

```yaml
network:
  80/TCP: Web 服务器端口（未用于 Ingress）
```

_在这种情况下，`network` 下的键 (`80/TCP`) 需要与您的 `ports` 配置中的键匹配（在 [`config.yaml`](#add-on-configuration) 中）。_

## 附加组件高级选项

有时，附加组件开发者可能希望允许用户配置提供他们自己的文件，这些文件随后会直接提供给内部服务作为其配置的一部分。一些示例包括：

1. 内部服务想要一个已配置项目的列表，并且每个项目的架构很复杂，但服务没有提供 UI 来实现，因此更容易指引用户查阅其文档并要求提供该架构的文件。
2. 内部服务需要一个二进制文件或一些外部配置的文件作为其配置的一部分。
3. 内部服务支持在配置更改时实时重新加载，您希望支持此功能以便于其某些或所有配置，要求用户提供一个文件以从中实时重新加载。

在这种情况下，您应该在附加组件的配置文件中将 `addon_config` 添加到 `map` 中。然后，您应该指导用户将此文件放入 `/addon_configs/{REPO}_<your addon's slug>` 文件夹中。 如果附加组件是本地安装的，则 `{REPO}` 将为 `local`。 如果附加组件是从 Github 存储库安装的，则 `{REPO}` 是从 GitHub 存储库 URL 生成的哈希标识符（例如: `https://github.com/xy/my_hassio_addons`）。
此文件夹将在附加组件的 Docker 容器运行时挂载到 `/config`。您应该在附加组件的架构中提供一个选项，以收集从该文件夹开始的文件的相对路径，或者依赖于固定的文件名并将其包含在文档中。

`addon_config` 的另一个用例可能是，如果您的附加组件想要提供基于文件的输出或让用户访问内部文件以进行调试。一些示例包括：

1. 内部服务将日志写入文件，您希望允许用户访问该日志文件。
2. 内部服务使用数据库，您希望允许用户访问该数据库以进行调试。
3. 内部服务生成的文件旨在用于其自己的配置，您希望允许用户也可以访问它们。

在这种情况下，您应该添加 `addon_config:rw` 到 `map`，以便您的附加组件能够从该文件夹读取和写入。同时，在附加组件运行时，您应该将在 `/config` 输出这些文件，以便用户可以查看和访问它们。