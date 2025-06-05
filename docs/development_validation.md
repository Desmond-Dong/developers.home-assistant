---
title: "验证输入"
---

`configuration.yaml` 文件包含组件和平台的配置选项。我们使用 [voluptuous](https://pypi.python.org/pypi/voluptuous) 确保用户提供的配置是有效的。一些条目是可选的，或者可能是设置平台或组件所必需的。其他条目必须是定义的类型或来自已定义的列表。

我们测试配置，以确保用户拥有良好的体验，并在 Home Assistant 运行之前最小化平台或组件设置出现问题时的通知。

除了 [voluptuous](https://pypi.python.org/pypi/voluptuous) 的默认类型之外，还有许多自定义类型可用。有关概述，请查看 [config_validation.py](https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/config_validation.py) 辅助程序。

- 类型：`string`， `byte` 和 `boolean`
- 实体 ID：`entity_id` 和 `entity_ids`
- 数字：`small_float` 和 `positive_int`
- 时间：`time`， `time_zone`
- 杂项：`template`， `slug`， `temperature_unit`， `latitude`， `longitude`， `isfile`， `sun_event`， `ensure_list`， `port`， `url` 和 `icon`

要验证使用 [MQTT](https://www.home-assistant.io/components/mqtt/) 的平台，可以使用 `valid_subscribe_topic` 和 `valid_publish_topic`。

需要记住的一些事项：

- 使用 `const.py` 中定义的常量
- 从您要集成的集成中导入 `PLATFORM_SCHEMA` 并扩展它。
- 首选顺序是 `required` 在前，`optional` 在后
- 可选配置键的默认值需要是有效值。不要使用默认值为 `None` 的选项，例如 `vol.Optional(CONF_SOMETHING, default=None): cv.string`，如果需要，将默认值设置为 `default=''`。

### 代码片段

本节包含我们使用的验证代码片段。

#### 默认名称

如果用户没有提供要使用的名称，通常会为传感器设置一个默认值。

```python
DEFAULT_NAME = "传感器名称"

PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend(
    {
        # ...
        vol.Optional(CONF_NAME, default=DEFAULT_NAME): cv.string,
    }
)
```

#### 限制值

您可能希望限制用户的输入为几个选项。

```python
DEFAULT_METHOD = "GET"

PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend(
    {
        # ...
        vol.Optional(CONF_METHOD, default=DEFAULT_METHOD): vol.In(["POST", "GET"]),
    }
)
```

#### 端口

所有端口号的范围为 1 到 65535。

```python
DEFAULT_PORT = 993

PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend(
    {
        # ...
        vol.Optional(CONF_PORT, default=DEFAULT_PORT): cv.port,
    }
)
```

#### 列表

如果传感器有一个预定义的可用选项列表，请测试以确保配置条目与列表匹配。

```python
SENSOR_TYPES = {
    "article_cache": ("文章缓存", "MB"),
    "average_download_rate": ("平均速度", "MB/s"),
}

PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend(
    {
        # ...
        vol.Optional(CONF_MONITORED_VARIABLES, default=[]): vol.All(
            cv.ensure_list, [vol.In(SENSOR_TYPES)]
        ),
    }
)