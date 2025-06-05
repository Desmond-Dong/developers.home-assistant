---
title: "扩展 WebSocket API"
---

作为一个组件，你可能有一些信息希望能够提供给前端。例如，媒体播放器会希望将专辑封面提供给前端展示。我们的前端通过 websocket API 与后端进行通信，该 API 可以通过自定义命令进行扩展。

## 注册一个命令 (Python)

要注册一个命令，你需要有一个消息类型、一个消息架构和一个消息处理器。你的组件不需要将 websocket API 作为依赖添加。你注册你的命令，如果用户正在使用 websocket API，该命令将可用。

### 定义你的命令架构

命令架构由消息类型和我们期望在命令被调用时接收到的数据类型组成。你通过装饰器在命令处理器上定义命令类型和数据架构。消息处理器是运行在事件循环中的回调函数。

```python
from homeassistant.components import websocket_api

@websocket_api.websocket_command(
    {
        vol.Required("type"): "frontend/get_panels",
        vol.Optional("preload_panels"): bool,
    }
)
@callback
def ws_get_panels(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """处理 websocket 命令."""
    panels = ...
    connection.send_result(msg["id"], {"panels": panels})
```

#### 进行 I/O 或发送延迟响应

如果你的命令需要与网络、设备交互或需要计算信息，你将需要排队一个作业来完成工作并发送响应。为此，使你的函数为异步并用 `@websocket_api.async_response` 装饰。

```python
from homeassistant.components import websocket_api

@websocket_api.websocket_command(
    {
        vol.Required("type"): "camera/get_thumbnail",
        vol.Optional("entity_id"): str,
    }
)
@websocket_api.async_response
async def ws_handle_thumbnail(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict
) -> None:
    """处理获取媒体播放器封面命令."""
    # 使用传入的实体 ID 获取媒体播放器。
    player = hass.data[DOMAIN].get_entity(msg["entity_id"])

    # 如果播放器不存在，发送错误消息。
    if player is None:
        connection.send_error(
                msg["id"], "entity_not_found", "实体未找到"
        )
        return

    data, content_type = await player.async_get_media_image()

    # 没有媒体播放器缩略图可用
    if data is None:
        connection.send_error(
            msg["id"], "thumbnail_fetch_failed", "获取缩略图失败"
        )
        return

    connection.send_result(
        msg["id"],
        {
            "content_type": content_type,
            "content": base64.b64encode(data).decode("utf-8"),
        },
    )
```

### 在 Websocket API 中注册

所有部分定义完毕，现在是时候注册命令了。这在你的设置方法中完成。

```python
from homeassistant.components import websocket_api

async def async_setup(hass, config):
    """设置你的组件."""
    websocket_api.async_register_command(hass, ws_get_panels)
    websocket_api.async_register_command(hass, ws_handle_thumbnail)
```

## 从前端调用命令 (JavaScript)

定义完命令后，现在是时候从前端调用它了！这可以通过 JavaScript 完成。你需要访问 `hass` 对象，该对象保存与后端的 WebSocket 连接。然后只需调用 `hass.connection.sendMessagePromise`。如果命令成功，该方法将返回一个解析的 Promise，如果命令失败，则返回错误。

```js
hass.connection.sendMessagePromise({
    type: 'media_player/thumbnail',
    entity_id: 'media_player.living_room_tv',
}).then(
    (resp) => {
        console.log('消息成功!', resp.result);
    },
    (err) => {
        console.error('消息失败!', err);
    }
);
```

如果你的命令没有发送响应，你可以使用 `hass.connection.sendMessage`。