---
title: 遮盖实体
sidebar_label: 遮盖
---

遮盖实体控制一个开口或遮盖，例如车库门或窗帘。 从 [`homeassistant.components.cover.CoverEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/cover/__init__.py) 派生一个平台实体。

:::note
遮盖实体仅应用于控制开口或遮盖的设备。 对于其他类型的设备实体，应该使用 [Number](/docs/core/entity/number)，即使在过去并非如此。
:::

## 属性

:::tip
属性应始终仅从内存中返回信息，而不进行I/O（如网络请求）。 实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称 | 类型 | 默认 | 描述
| ----------------------- | ---- | ------- | -----------
| current_cover_position | <code>int &#124; None</code> | `None` | 当前遮盖的位置，其中0表示关闭，100表示完全打开。
| current_cover_tilt_position | <code>int &#124; None</code> | `None` | 当前遮盖的倾斜位置，其中0表示关闭/无倾斜，100表示打开/最大倾斜。
| is_closed | <code>bool &#124; None</code> | **必填** | 遮盖是否关闭。 用于确定 `state`。
| is_closing | <code>bool &#124; None</code> | `None` | 遮盖是否正在关闭。 用于确定 `state`。
| is_opening | <code>bool &#124; None</code> | `None` | 遮盖是否正在打开。 用于确定 `state`。

### 状态

状态通过设置上述属性来定义。 结果状态使用 `CoverState` 枚举返回以下成员之一。

| 值          | 描述                                                            |
|-------------|------------------------------------------------------------------|
| `CLOSED`    | 遮盖已关闭。                                                      |
| `CLOSING`   | 遮盖正在关闭。                                                  |
| `OPENING`   | 遮盖正在打开。                                                  |
| `OPEN`      | 遮盖已打开。                                                    |

### 设备类别

| 常量 | 描述
|----------|-----------------------|
| `CoverDeviceClass.AWNING` | 控制遮阳篷，例如外部可收回的窗户、门或露台遮盖。 |
| `CoverDeviceClass.BLIND` | 控制百叶窗，链接的百叶可展开或收起以覆盖开口，或可倾斜以部分覆盖开口，例如窗帘。 |
| `CoverDeviceClass.CURTAIN` | 控制窗帘或帷幕，通常是悬挂在窗户或门上的布料，可以拉开。 |
| `CoverDeviceClass.DAMPER` | 控制减少空气流动、声音或光线的机械阻尼器。 |
| `CoverDeviceClass.DOOR` | 控制提供进入区域的门，通常是结构的一部分。 |
| `CoverDeviceClass.GARAGE` | 控制提供进入车库的车库门。 |
| `CoverDeviceClass.GATE` | 控制提供进入车道或其他区域的门。门通常位于结构外部，通常是围栏的一部分。 |
| `CoverDeviceClass.SHADE` | 控制遮阳板，是一种材料或连接单元的连续平面，可展开或收起以覆盖开口，例如窗帘。 |
| `CoverDeviceClass.SHUTTER` | 控制百叶窗，链接的百叶可向内/外摆动以覆盖开口，或可倾斜以部分覆盖开口，例如室内或外部窗户百叶窗。 |
| `CoverDeviceClass.WINDOW` | 控制物理窗口，可以打开和关闭或倾斜。

## 支持的功能

支持的功能通过使用 `CoverEntityFeature` 枚举中的值定义，并使用位或 (`|`) 运算符组合。

| 值                   | 描述                                                                      |
| ------------------- | -------------------------------------------------------------------------------- |
| `OPEN`              | 遮盖支持被打开。                                                              |
| `CLOSE`             | 遮盖支持被关闭。                                                              |
| `SET_POSITION`      | 遮盖支持移动到打开和关闭之间的特定位置。                                      |
| `STOP`              | 遮盖支持停止当前操作（打开、关闭、设置位置）。                              |
| `OPEN_TILT`         | 遮盖支持倾斜打开。                                                            |
| `CLOSE_TILT`        | 遮盖支持倾斜关闭。                                                            |
| `SET_TILT_POSITION` | 遮盖支持移动到打开和关闭之间的特定倾斜位置。                                |
| `STOP_TILT`         | 遮盖支持停止当前倾斜操作（打开、关闭、设置位置）。                            |

## 方法

### 打开遮盖

仅当设置了标志 `SUPPORT_OPEN` 时才实现此方法。

```python
class MyCover(CoverEntity):
    # 实现以下方法之一。

    def open_cover(self, **kwargs):
        """打开遮盖。"""

    async def async_open_cover(self, **kwargs):
        """打开遮盖。"""
```

### 关闭遮盖

仅当设置了标志 `SUPPORT_CLOSE` 时才实现此方法。

```python
class MyCover(CoverEntity):
    # 实现以下方法之一。

    def close_cover(self, **kwargs):
        """关闭遮盖。"""

    async def async_close_cover(self, **kwargs):
        """关闭遮盖。"""
```

### 设置遮盖位置

仅当设置了标志 `SUPPORT_SET_POSITION` 时才实现此方法。

```python
class MyCover(CoverEntity):
    # 实现以下方法之一。

    def set_cover_position(self, **kwargs):
        """将遮盖移动到特定位置。"""

    async def async_set_cover_position(self, **kwargs):
        """将遮盖移动到特定位置。"""
```

### 停止遮盖

仅当设置了标志 `SUPPORT_STOP` 时才实现此方法。

```python
class MyCover(CoverEntity):
    # 实现以下方法之一。

    def stop_cover(self, **kwargs):
        """停止遮盖。"""

    async def async_stop_cover(self, **kwargs):
        """停止遮盖。"""
```

### 打开遮盖倾斜

仅当设置了标志 `SUPPORT_OPEN_TILT` 时才实现此方法。

```python
class MyCover(CoverEntity):
    # 实现以下方法之一。

    def open_cover_tilt(self, **kwargs):
        """打开遮盖倾斜。"""

    async def async_open_cover_tilt(self, **kwargs):
        """打开遮盖倾斜。"""
```

### 关闭遮盖倾斜

仅当设置了标志 `SUPPORT_CLOSE_TILT` 时才实现此方法。

```python
class MyCover(CoverEntity):
    # 实现以下方法之一。

    def close_cover_tilt(self, **kwargs):
        """关闭遮盖倾斜。"""

    async def async_close_cover_tilt(self, **kwargs):
        """关闭遮盖倾斜。"""
```

### 设置遮盖倾斜位置

仅当设置了标志 `SUPPORT_SET_TILT_POSITION` 时才实现此方法。

```python
class MyCover(CoverEntity):
    # 实现以下方法之一。

    def set_cover_tilt_position(self, **kwargs):
        """将遮盖倾斜移动到特定位置。"""

    async def async_set_cover_tilt_position(self, **kwargs):
        """将遮盖倾斜移动到特定位置。"""
```

### 停止遮盖倾斜

仅当设置了标志 `SUPPORT_STOP_TILT` 时才实现此方法。

```python
class MyCover(CoverEntity):
    # 实现以下方法之一。

    def stop_cover_tilt(self, **kwargs):
        """停止遮盖。"""

    async def async_stop_cover_tilt(self, **kwargs):
        """停止遮盖。"""