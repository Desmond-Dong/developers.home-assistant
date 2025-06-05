---
title: "事件"
---

Home Assistant 的核心是由事件驱动的。这意味着如果您想要响应某些发生的事情，您需要响应事件。在大多数情况下，您不会直接与事件系统互动，而是使用某个 [事件监听器助手][helpers]。

事件系统非常灵活。事件类型没有限制，只要它是一个字符串。每个事件可以包含数据。数据是一个字典，可以包含任何只要是 JSON 可序列化的数据。这意味着您可以使用数字、字符串、字典和列表。

[Home Assistant 触发的事件列表。][object]

## 触发事件

要触发事件，您必须与事件总线进行交互。事件总线在 Home Assistant 实例上可用，称为 `hass.bus`。请注意数据结构，如我们在 [数据科学门户](https://data.home-assistant.io/docs/events/#database-table) 上所述。

示例组件将在加载时触发事件。请注意，自定义事件名称以组件名称为前缀。

```python
DOMAIN = "example_component"


def setup(hass, config):
    """当 Home Assistant 正在加载我们的组件时调用 set up。"""

    # 触发事件 example_component_my_cool_event，事件数据为 answer=42
    hass.bus.fire("example_component_my_cool_event", {"answer": 42})

    # 返回成功设置
    return True
```

## 监听事件

大多数情况下，您不会触发事件，而是监听事件。例如，实体的状态变化会作为事件广播。

```python
DOMAIN = "example_component"


def setup(hass, config):
    """当 Home Assistant 正在加载我们的组件时调用 set up。"""
    count = 0

    # 处理触发事件的监听器
    def handle_event(event):
        nonlocal count
        count += 1
        print(f"答案 {count} 是: {event.data.get('answer')}")

    # 监听 example_component_my_cool_event 被触发的事件
    hass.bus.listen("example_component_my_cool_event", handle_event)

    # 返回成功设置
    return True
```

### 助手

Home Assistant 附带了许多捆绑助手，以便监听特定类型的事件。有助手跟踪某个时刻、跟踪时间间隔、状态变化或日落。[查看可用的方法。][helpers]

[helpers]: https://developers.home-assistant.io/docs/integration_listen_events#available-event-helpers
[object]: https://www.home-assistant.io/docs/configuration/events/