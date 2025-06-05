---
title: 加湿器实体
sidebar_label: 加湿器
---

加湿器实体是一个其主要目的是控制湿度的设备，即加湿器或除湿器。从 [`homeassistant.components.humidifier.HumidifierEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/humidifier/__init__.py) 派生实体平台。

## 属性

:::tip
属性应始终仅从内存中返回信息，而不进行 I/O（例如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称                    | 类型                                           | 默认值                               | 描述                                        |
| ----------------------- | ---------------------------------------------- | ------------------------------------- | -------------------------------------------------- |
| action                  | <code>HumidifierAction &#124; None</code>      | `None`                                | 返回设备的当前状态。                              |
| available_modes         | <code>list[str] &#124; None</code>             | **要求 MODES**                         | 可用模式。需要 `SUPPORT_MODES`。                     |
| current_humidity        | <code>float &#124; None</code>                   | `None`                                | 设备测量的当前湿度。                             |
| device_class            | <code>HumidifierDeviceClass &#124; None</code> | `None`                                | Hygrostat 类型                                    |
| is_on                   | <code>bool &#124; None</code>                  | `None`                                | 设备是否开启。                                   |
| max_humidity            | `float`                                          | `DEFAULT_MAX_HUMIDITY`（值 == 100） | 最大湿度。                                     |
| min_humidity            | `float`                                          | `DEFAULT_MIN_HUMIDITY`（值 == 0）    | 最小湿度。                                     |
| mode                    | <code>str &#124; None</code>                   | **要求**                              | 当前活动模式。需要 `SUPPORT_MODES`。                   |
| target_humidity         | <code>float &#124; None</code>                   | `None`                                | 设备试图达到的目标湿度。                         |

### 可用设备类别

| 常量                               | 描述                                  |
| ---------------------------------- | -------------------------------------- |
| `HumidifierDeviceClass.DEHUMIDIFIER` | 除湿器                                  |
| `HumidifierDeviceClass.HUMIDIFIER`   | 加湿器                                  |


### 模式

设备可以具有不同的操作模式，它可能希望向用户显示。这些可以视为预设或在特殊条件下具有减少或增强功能的一些设备状态，例如“自动”或“婴儿”。有几个内置模式将提供翻译，但如果更好地表示设备，您也可以添加自定义模式。

| 名称           | 描述                                  |
| -------------- | -------------------------------------  |
| `MODE_NORMAL`  | 没有激活预设，正常操作                |
| `MODE_ECO`     | 设备正在运行节能模式                  |
| `MODE_AWAY`    | 设备处于离家模式                      |
| `MODE_BOOST`   | 设备将所有阀门全开                    |
| `MODE_COMFORT` | 设备处于舒适模式                      |
| `MODE_HOME`    | 设备处于家居模式                      |
| `MODE_SLEEP`   | 设备为睡眠做好准备                    |
| `MODE_AUTO`    | 设备自主控制湿度                      |
| `MODE_BABY`    | 设备试图优化以适应婴儿                 |

## 支持的特性

支持的特性通过使用 `HumidifierEntityFeature` 枚举中的值定义，并使用按位或（`|`）运算符组合。

| 值      | 描述                              |
| ------- | ---------------------------------- |
| `MODES` | 设备支持不同的模式。              |

## 操作

`action` 属性可以返回设备的当前操作状态，是否正在加湿或空闲。 这是一个信息性属性。请注意，当设备关闭时，`action` 属性（如果存在）将自动替换为“off”。此外，请注意，将 `action` 设置为 `off` 不会替换 `is_on` 属性。

`HumidifierAction` 的当前值：

| 名称          | 描述                                |
| ------------- | ------------------------------------ |
| `HUMIDIFYING` | 设备正在加湿。                       |
| `DRYING`      | 设备正在除湿。                       |
| `IDLE`        | 设备开启但目前不活动。               |
| `OFF`         | 设备已关闭。                         |

## 方法

### 设置模式

```python
class MyHumidifierEntity(HumidifierEntity):
    # 实现这些方法之一。

    def set_mode(self, mode):
        """设置新的目标预设模式。"""

    async def async_set_mode(self, mode):
        """设置新的目标预设模式。"""
```

### 设置湿度

如果当前模式不允许调整目标湿度，设备应在此调用时自动将其模式更改为可以实现的那个模式。

```python
class MyHumidifierEntity(HumidifierEntity):
    # 实现这些方法之一。

    def set_humidity(self, humidity):
        """设置新的目标湿度。"""

    async def async_set_humidity(self, humidity):
        """设置新的目标湿度。"""
```

### 开启

```python
class MyHumidifierEntity(HumidifierEntity):
    # 实现这些方法之一。

    def turn_on(self, **kwargs):
        """将设备开启。"""

    async def async_turn_on(self, **kwargs):
        """将设备开启。"""
```

### 关闭

```python
class MyHumidifierEntity(HumidifierEntity):
    # 实现这些方法之一。

    def turn_off(self, **kwargs):
        """将设备关闭。"""

    async def async_turn_off(self, **kwargs):
        """将设备关闭。"""