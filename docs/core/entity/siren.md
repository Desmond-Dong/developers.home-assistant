---
title: 警报实体
sidebar_label: 警报
---

警报实体是一种设备，其主要目的是控制像门铃或警报器这样的警报设备。从 [`homeassistant.components.siren.SirenEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/siren/__init__.py) 派生实体平台。

## 属性

:::tip
属性应该始终仅从内存中返回信息，而不是进行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据，或构建一个机制将状态更新推送到实体类实例。
:::

| 名称                      | 类型                 | 默认值                                  | 描述                                                                                  |
| ------------------------- | -------------------- | --------------------------------------- | ------------------------------------------------------------------------------------- |
| is_on                     | bool                 | `None`                                 | 设备是开还是关。                                                                      |
| available_tones           | list or dict         | `NotImplementedError()`                 | 设备上可用音调的列表或字典，用于传递给 `turn_on` 服务操作。如果提供了字典，当用户使用音调的字典值时，将转换为相应的字典键后再传递给集成平台。需要 `SUPPORT_TONES` 功能。               |

### 音调

设备可以有不同的音调播放。集成负责在支持时提供可用的音调。

### 支持的功能

支持的功能常量使用按位或 (`|`) 运算符组合。

| 名称                          | 描述                                                                                                                 |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `SirenEntityFeature.TONES`    | 设备支持不同的音调（音调可以传递到 `turn_on` 服务操作中）。                                                          |
| `SirenEntityFeature.DURATION` | 设备支持设置音调的持续时间（持续时间可以传递到 `turn_on` 服务操作中）。                                            |
| `SirenEntityFeature.VOLUME_SET` | 设备支持设置设备的音量级别（音量级别可以传递到 `turn_on` 服务操作中）。                                         |


## 方法

### 打开

可以传递三个可选输入参数到服务操作调用中，每个参数由一个支持功能标志控制。如果在服务操作调用中提供了给定的输入参数，但相应的标志未设置，则将在基础平台中被过滤掉，然后传递给集成。

| 参数名称      | 数据验证                                   | 支持的功能标志       |
|---------------|-------------------------------------------|--------------------|
| `tone`        | `vol.Any(vol.Coerce(int), cv.string)`     | `SUPPORT_TONES`     |
| `duration`    | `cv.positive_int`                          | `SUPPORT_DURATIONS` |
| `volume_level`| `cv.small_float`                           | `SUPPORT_VOLUME_SET`  |

```python
class MySirenEntity(SirenEntity):
    # 实现其中一种方法。

    def turn_on(self, **kwargs) -> None:
        """打开设备。"""

    async def async_turn_on(self, **kwargs) -> None:
        """打开设备。"""
```

### 关闭

```python
class MySirenEntity(SirenEntity):
    # 实现其中一种方法。

    def turn_off(self, **kwargs):
        """关闭设备。"""

    async def async_turn_off(self, **kwargs):
        """关闭设备。"""