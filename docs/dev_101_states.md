---
title: "状态"
---

Home Assistant 跟踪状态机中实体的状态。状态机的要求非常少：

- 每个状态与通过实体 ID 识别的实体相关。这个 ID 由一个域和一个对象 ID 组成。例如 `light.kitchen_ceiling`。您可以随意组合域和对象 ID，甚至可以覆盖现有状态。
- 每个状态都有一个主要属性描述实体的状态。对于灯来说，这个状态可以是“开”和“关”。您可以在状态中存储任何您想要的内容，只要它是字符串（如果不是，将被转换）。
- 您可以通过设置属性存储更多关于实体的信息。属性是一个字典，可以包含您想要的任何数据。唯一的要求是它必须是 JSON 可序列化的，因此您只能使用数字、字符串、字典和列表。

[状态对象的描述。](https://www.home-assistant.io/docs/configuration/state_object/)

## 在组件中使用状态

这是一个关于如何创建和设置状态的简单教程/示例。我们将在一个叫做 "hello_state" 的组件中进行工作。此组件的目的是在前端显示给定的文本。

要开始，请创建文件 `<config dir>/custom_components/hello_state.py` 并复制以下示例代码。

```python
"""
支持在前端显示文本。

有关此组件的更多详细信息，请参考文档：
https://developers.home-assistant.io/docs/dev_101_states
"""
import logging

_LOGGER = logging.getLogger(__name__)

DOMAIN = "hello_state"


def setup(hass, config):
    """设置 Hello State 组件。 """
    _LOGGER.info("‘hello state’ 组件已经准备好！")

    return True
```

1. 在文件头部，我们决定添加一些细节：一个简短的描述和文档的链接。
2. 我们希望进行一些日志记录。这意味着我们导入 Python 的日志模块并创建一个别名。
3. 组件名称等同于域名。
4. `setup` 函数将负责初始化我们的组件。
   该组件只会写一条日志消息。请记住，以后您有多个严重程度的选项：

   - `_LOGGER.info(msg)`
   - `_LOGGER.warning(msg)`
   - `_LOGGER.error(msg)`
   - `_LOGGER.critical(msg)`
   - `_LOGGER.exception(msg)`

5. 如果一切正常，我们返回 `True`。

将组件添加到您的 `configuration.yaml` 文件中。

```yaml
hello_state:
```

在启动或重启 Home Assistant 后，组件将在日志中创建一个条目。

```log
16-03-12 14:16:42 INFO (MainThread) [custom_components.hello_state] ‘hello state’ 组件已经准备好！
```

下一步是引入配置选项。用户可以通过 `configuration.yaml` 向我们的组件传递配置选项。为了使用它们，我们将使用传入的 `config` 变量到我们的 `setup` 方法中。

```python
import logging

_LOGGER = logging.getLogger(__name__)

DOMAIN = "hello_state"

CONF_TEXT = "text"
DEFAULT_TEXT = "没有文本！"


def setup(hass, config):
    """设置 Hello State 组件。 """
    # 从配置中获取文本。如果未提供名称，则使用 DEFAULT_TEXT。
    text = config[DOMAIN].get(CONF_TEXT, DEFAULT_TEXT)

    # 状态格式为 DOMAIN.OBJECT_ID
    hass.states.set("hello_state.Hello_State", text)

    return True
```

要使用我们组件的最新功能，请更新您的 `configuration.yaml` 文件中的条目。

```yaml
hello_state:
  text: '你好，世界！'
```

由于 `DEFAULT_TEXT` 变量，即使在 `configuration.yaml` 文件中未使用 `text:` 字段，组件仍然会启动。通常会有一些必需的变量。检查是否提供了所有的强制配置变量很重要。如果没有，设置应该失败。我们将使用 `voluptuous` 作为辅助工具来实现这一点。下一段列出了重要部分。

```python
import voluptuous as vol

import homeassistant.helpers.config_validation as cv

CONFIG_SCHEMA = vol.Schema(
    {DOMAIN: vol.Schema({vol.Required(CONF_TEXT): cv.string,})}, extra=vol.ALLOW_EXTRA
)
```

现在，当配置中缺少 `text:` 时，Home Assistant 会提醒用户并不会设置您的组件。

在启动或重启 Home Assistant 后，如果 `configuration.yaml` 文件是最新的，组件将在前端可见。

<p class='img'>
<img src='/img/en/development/create-component01.png' />
</p>

为了在一个平台上暴露属性，您需要在实体类中定义一个名为 `extra_state_attributes` 的属性，该属性将返回一个属性字典：

```python
@property
def extra_state_attributes(self):
    """返回实体特定的状态属性。"""
    return self._attributes
```

:::tip
实体还有一个类似的属性 `state_attributes`，该属性不应被集成覆盖。此属性由基础实体组件用于向状态添加标准属性集。示例：灯光组件使用 `state_attributes` 将亮度添加到状态字典中。如果您正在设计一个新的集成，您应该定义 `extra_state_attributes`。
:::

要让您的集成包含在 Home Assistant 发布中，请按照 [提交您的工作](development_submitting.md) 部分中描述的步骤进行操作。基本上，您只需将您的集成移动到您的分叉的 `homeassistant/component/` 目录中并创建一个拉取请求。