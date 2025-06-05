---
title: 摄像头实体
sidebar_label: 摄像头
---

摄像头实体可以显示图像，并可选地提供视频流。从 [`homeassistant.components.camera.Camera`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/camera/__init__.py) 派生一个平台实体。

## 属性

:::tip
属性应始终仅从内存中返回信息，而不进行 I/O（如网络请求）。实施 `update()` 或 `async_update()` 以获取数据。
:::

| 名称                      | 类型                                | 默认值  | 描述                                                                                              |
| ------------------------- | ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------- |
| brand                     | <code>str &#124; None</code>       | `None`  | 摄像头的品牌（制造商）。                                                                          |
| frame_interval            | `float`                            | 0.5     | 流中帧之间的间隔。                                                                                |
| is_on                     | `bool`                             | `True`  | 摄像头是否开启的指示。                                                                            |
| is_recording              | `bool`                             | `False` | 摄像头是否正在录制的指示。用于确定 `state`。                                                     |
| is_streaming              | `bool`                             | `False` | 摄像头是否正在流传输的指示。用于确定 `state`。                                                  |
| model                     | <code>str &#124; None</code>       | `None`  | 摄像头的型号。                                                                                    |
| motion_detection_enabled   | `bool`                             | `False` | 摄像头是否启用了运动检测的指示。                                                                  |
| use_stream_for_stills     | `bool`                             | `False` | 确定是否使用 `Stream` 集成来生成静态图像。                                                      |

### 状态

状态通过设置上述属性来定义。结果状态使用 `CameraState` 枚举返回以下成员之一。

| 值           | 描述                                      |
|--------------|------------------------------------------|
| `RECORDING`  | 摄像头当前正在录制。                      |
| `STREAMING`  | 摄像头当前正在流传输。                    |
| `IDLE`       | 摄像头当前处于空闲状态。                  |


## 支持的功能

支持的功能通过使用 `CameraEntityFeature` 枚举中的值来定义，并使用按位或（`|`）运算符组合。

| 值        | 描述                                            |
|-----------|-------------------------------------------------|
| `ON_OFF`  | 设备支持 `turn_on` 和 `turn_off`               |
| `STREAM`  | 设备支持流传输                                  |

## 方法

### 摄像头图像

当传入宽度和高度时，缩放应以最佳努力为原则进行。如果摄像头无法进行缩放，用户界面将回退到显示层的缩放。

- 返回满足最小宽度和最小高度的最小图像。

- 在缩放图像时，必须保持宽高比。如果宽高比与请求的高度或宽度不相同，返回的图像的宽度和/或高度预计将大于请求的值。

- 如果底层摄像头能够缩放图像，则传递宽度和高度。

- 如果集成无法缩放图像并返回 jpeg 图像，则在请求时，摄像头集成将自动缩放。

```python
class MyCamera(Camera):
    # 实现这些方法之一。

    def camera_image(
        self, width: int | None = None, height: int | None = None
    ) -> bytes | None:
        """返回摄像头图像的字节流。"""
        raise NotImplementedError()

    async def async_camera_image(
        self, width: int | None = None, height: int | None = None
    ) -> bytes | None:
        """返回摄像头图像的字节流。"""

```

### 流源

流源应返回一个可供 ffmpeg 使用的 URL（例如 RTSP URL）。需要 `CameraEntityFeature.STREAM`。

具有流源的摄像头实体默认使用 `StreamType.HLS` 来告诉前端使用带有 `stream` 组件的 HLS 源。此流源也将在录制时与 `stream` 一起使用。

```python
class MyCamera(Camera):

    async def stream_source(self) -> str | None:
        """返回流的源。"""

```

摄像头实体渲染静态图像的常见方法是将流源传递给 `ffmpeg` 组件中的 `async_get_image`。

### WebRTC 流

启用 WebRTC 的摄像头可以通过与 Home Assistant 前端建立直接连接来使用。此用法需要 `CameraEntityFeature.STREAM`，并且集成必须实现以下两种方法以支持原生 WebRTC：
- `async_handle_async_webrtc_offer`：用于初始化 WebRTC 流。所有来自异步的消息/错误应通过 `send_message` 回调转发给前端。
- `async_on_webrtc_candidate`：前端将在发送提议后调用其传入的任何候选者。
以下方法可以选择实现：
- `close_webrtc_session`（可选）：前端在流关闭时将调用此方法。可以用于清理。

WebRTC 流不使用 `stream` 组件，也不支持录制。
通过实现 WebRTC 方法，前端假设摄像头仅支持 WebRTC，因此不会回退到 HLS。

```python
class MyCamera(Camera):

    async def async_handle_async_webrtc_offer(
        self, offer_sdp: str, session_id: str, send_message: WebRTCSendMessage
    ) -> None:
        """处理异步 WebRTC 提议。

        异步意味着处理提议和响应/消息可能需要一些时间
        并将通过 send_message 回调发送。
        此方法由具有 CameraEntityFeature.STREAM 的摄像头使用。
        重写此方法的集成必须还实现 async_on_webrtc_candidate。

        集成可以用原生 WebRTC 实现来重写。
        """

    async def async_on_webrtc_candidate(self, session_id: str, candidate: RTCIceCandidate) -> None:
        """处理 WebRTC 候选者。"""

    @callback
    def close_webrtc_session(self, session_id: str) -> None:
        """关闭 WebRTC 会话。"""
```

### WebRTC 提供者

集成可以使用 `homeassistant.components.camera.webrtc` 中的库，提供现有摄像头的 WebRTC 流源。
集成可以实现 `CameraWebRTCProvider` 并通过 `async_register_webrtc_provider` 注册。

### 开启

```python
class MyCamera(Camera):
    # 实现这些方法之一。

    def turn_on(self) -> None:
        """开启摄像头。"""

    async def async_turn_on(self) -> None:
        """开启摄像头。"""
```

### 关闭

```python
class MyCamera(Camera):
    # 实现这些方法之一。

    def turn_off(self) -> None:
        """关闭摄像头。"""

    async def async_turn_off(self) -> None:
        """关闭摄像头。"""
```

### 启用运动检测

```python
class MyCamera(Camera):
    # 实现这些方法之一。

    def enable_motion_detection(self) -> None:
        """在摄像头中启用运动检测。"""

    async def async_enable_motion_detection(self) -> None:
        """在摄像头中启用运动检测。"""
```

### 禁用运动检测

```python
class MyCamera(Camera):
    # 实现这些方法之一。

    def disable_motion_detection(self) -> None:
        """在摄像头中禁用运动检测。"""

    async def async_disable_motion_detection(self) -> None:
        """在摄像头中禁用运动检测。"""