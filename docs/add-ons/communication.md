---
title: "插件通信"
---

在 Home Assistant 中，插件之间有不同的通信方式。

## 网络

我们使用一个内部网络，允许与每个插件进行通信，包括与 Home Assistant 的通信，使用插件的名称或别名。只有在主机网络上运行的插件限制了它们只能通过名称与所有内部插件通信，而其他所有插件不能通过名称直接访问这些插件。然而，使用别名对两者都有效！

名称/别名用于 Home Assistant 内部的通信。
名称的生成采用以下格式：`{REPO}_{SLUG}`，例如，`local_xy` 或 `3283fh_myaddon`。在此示例中，`{SLUG}` 在插件的 `config.yaml` 文件中定义。您还可以将此名称用作 DNS 名称，但需要将任何 `_` 替换为 `-` 以获得有效的主机名。如果插件是本地安装的，`{REPO}` 将为 `local`。如果插件是从 GitHub 存储库安装的，`{REPO}` 是从 GitHub 存储库的 URL 生成的哈希标识符（例如：`https://github.com/xy/my_hassio_addons`）。请参见 [这里](https://github.com/home-assistant/supervisor/blob/4ac7f7dcf08abb6ae5a018536e57d078ace046c8/supervisor/store/utils.py#L17) 了解该标识符的生成方式。请注意，在使用 [Supervisor 插件 API][supervisor-addon-api] 的某些操作中需要使用此标识符。您可以通过对 Supervisor API `addons` 端点的 GET 请求查看所有当前安装插件的存储库标识符。

使用 `supervisor` 进行与内部 API 的通信。

## Home Assistant 核心

插件可以使用内部代理与 [Home Assistant Core API][core-api] 通信。这使得在不知道密码、端口或 Home Assistant 实例的任何其他信息的情况下，与 API 进行通信变得非常简单。使用此 URL：`http://supervisor/core/api/` 确保内部通信被重定向到正确的位置。下一步是将 `homeassistant_api: true` 添加到 `config.yaml` 文件中，并读取环境变量 `SUPERVISOR_TOKEN`。在发出请求时，使用此作为 Home Assistant Core 的 [bearer token](/auth_api.md#making-authenticated-requests)。

例如 `curl -X GET -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" -H "Content-Type: application/json" http://supervisor/core/api/config`

还有一个 [Home Assistant Websocket API][core-websocket] 的代理，它的工作原理与上述 API 代理相同，并且需要将 `SUPERVISOR_TOKEN` 作为密码。使用此 URL：`ws://supervisor/core/websocket`。

您也可以通过内部网络直接与名为 `homeassistant` 的 Home Assistant 实例进行通信。但是，您需要知道运行实例使用的配置。

我们在 Home Assistant 中有多个操作来运行任务。通过 STDIN 向插件发送数据以使用 `hassio.addon_stdin` 操作。

## Supervisor API

要启用对 [Supervisor API][supervisor-api] 的调用，请将 `hassio_api: true` 添加到 `config.yaml` 文件中，并读取环境变量 `SUPERVISOR_TOKEN`。现在您可以通过 URL 使用 API：`http://supervisor/`。使用 `SUPERVISOR_TOKEN` 作为 `Authorization: Bearer` 的头信息。您可能还需要将 Supervisor API 角色更改为 `hassio_role: default`。

插件可以在不需要设置 `hassio_api: true` 的情况下调用某些 API 命令：

- `/core/api`
- `/core/api/stream`
- `/core/websocket`
- `/addons/self/*`
- `/services*`
- `/discovery*`
- `/info`

***注意：*** 有关 Home Assistant API 访问要求，请参见上文。

## 服务 API

我们有一个内部服务 API，使其他插件可以公开服务而无需用户添加任何配置。插件可以获取服务的完整配置以供使用和连接。插件需要在其插件 [配置](configuration.md) 中标记服务的使用，以便能够访问服务。所有支持的服务，包括其可用选项，都在 [API 文档][supervisor-services-api] 中进行了记录。

支持的服务有：

- mqtt
- mysql

您可以使用 Bashio 获取该信息，以便在插件初始化时使用，如：`bashio::services <service> <query>`

例如：

```bash
MQTT_HOST=$(bashio::services mqtt "host")
MQTT_USER=$(bashio::services mqtt "username")
MQTT_PASSWORD=$(bashio::services mqtt "password")
```

[core-api]: /api/rest.md
[core-websocket]: /api/websocket.md
[supervisor-api]: /api/supervisor/endpoints.md
[supervisor-addon-api]: /api/supervisor/endpoints.md#addons
[supervisor-services-api]: /api/supervisor/endpoints.md#service