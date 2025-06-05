---
title: "获取实例 URL"
---

在某些情况下，集成需要知道用户的 Home Assistant 实例的 URL，以满足当前使用案例的要求。例如，因为某个设备需要向 Home Assistant 发送数据，或外部服务或设备需要从 Home Assistant 获取数据（例如，生成的图像或音频文件）。

获取实例 URL 可能相当复杂，因为用户可能会有多个不同的 URL 可用：

- 用户配置的内部家庭网络 URL。
- 自动检测到的内部家庭网络 URL。
- 用户配置的、可公开访问的外部 URL，从互联网可用。
- 由 Nabu Casa 提供的 Home Assistant Cloud URL，如果用户订阅了该服务。

由于 URL 可以在非标准端口（例如，不是 80 或 443）上提供，并且可以使用或不使用 SSL（`http://` 与 `https://`），因此增加了额外的复杂性。

幸运的是，Home Assistant 提供了一个助手方法来稍微简化这个过程。

## URL 助手

Home Assistant 提供了一个网络助手方法来获取与集成需求匹配的实例 URL，称为 `get_url`。

助手方法的签名：

```py
# homeassistant.helpers.network.get_url
def get_url(
    hass: HomeAssistant,
    *,
    require_current_request: bool = False,
    require_ssl: bool = False,
    require_standard_port: bool = False,
    allow_internal: bool = True,
    allow_external: bool = True,
    allow_cloud: bool = True,
    allow_ip: bool = True,
    prefer_external: bool = False,
    prefer_cloud: bool = False,
) -> str:
```

该方法的不同参数：

- `require_current_request`
  要求返回的 URL 与用户当前在其浏览器中使用的 URL 匹配。如果没有当前请求，将引发错误。

- `require_ssl`:
  要求返回的 URL 使用 `https` 协议。

- `require_standard_port`:
  要求返回的 URL 使用标准 HTTP 端口。因此，对于 `http` 协议，它要求端口 80，对于 `https` 协议，它要求端口 443。

- `allow_internal`:
  允许 URL 是用户设置的内部 URL，或是内部网络上检测到的 URL。如果需要仅限外部 URL，请将此选项设置为 `False`。

- `allow_external`:
  允许 URL 是用户设置的外部 URL，或是 Home Assistant Cloud URL。如果需要仅限内部 URL，请将此选项设置为 `False`。

- `allow_cloud`:
  允许返回一个 Home Assistant Cloud URL，如果需要任何其他类型的 URL，请将其设置为 `False`。

- `allow_ip`:
  允许 URL 的主机部分是 IP 地址，如果这不适用于使用案例，请将其设置为 `False`。

- `prefer_external`:
  默认情况下，我们优先选择内部 URL 而不是外部 URL。将此选项设置为 `True` 以改变这一逻辑，优先选择外部 URL 而不是内部 URL。

- `prefer_cloud`:
  默认情况下，用户设置的外部 URL 被优先选择，但在少数情况下，云 URL 可能更可靠。将此选项设置为 `True` 可以优先选择 Home Assistant Cloud URL 而不是用户定义的外部 URL。

## 默认行为

默认情况下，未传递其他参数（`get_url(hass)`），它将尝试：

- 获取用户设置的内部 URL，或者如果不可用，则尝试从网络接口检测一个（基于 `http` 设置）。

- 如果内部 URL 失败，它将尝试获取外部 URL。它优先选择用户设置的外部 URL，若失败，则获取可用的 Home Assistant Cloud URL。

默认设置的目标是：允许任何 URL，但优先选择本地 URL，无需任何要求。

## 示例用法

使用助手的最基本示例：

```py
from homeassistant.helpers.network import get_url

instance_url = get_url(hass)
```

此示例对助手方法的调用将返回一个内部 URL，优选地，是用户设置或检测到的。如果无法提供该 URL，它将尝试用户的外部 URL。最后，如果用户未设置该 URL，它将尝试使用 Home Assistant Cloud URL。

如果绝对没有可用的 URL（或没有符合给定要求的 URL），将引发异常：`NoURLAvailableError`。

```py
from homeassistant.helpers import network

try:
    external_url = network.get_url(
        hass,
        allow_internal=False,
        allow_ip=False,
        require_ssl=True,
        require_standard_port=True,
    )
except network.NoURLAvailableError:
    raise MyInvalidValueError("无法为我的集成找到合适的 URL")
```

上述示例显示了 URL 助手的更复杂用法。在这种情况下，请求的 URL 不能是内部地址，URL 不能包含 IP 地址，要求使用 SSL，并且必须在标准端口上提供。

如果没有可用的 URL，可以捕获并处理 `NoURLAvailableError` 异常。