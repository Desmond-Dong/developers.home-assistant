---
title: "如果这是一个轮询集成，请设置适当的轮询间隔"
related_rules:
  - parallel-updates
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

在理想的世界中，所有集成都将具有基于推送的数据接口，设备或服务会通知我们新数据何时可用。
这将减少家庭助手的请求数量。

然而，在现实世界中，许多设备和服务无法进行基于推送的通信，因此我们不得不采用轮询的方式。
为了负责任地做到这一点，我们应该设置一个适当的轮询间隔，以服务大多数用户。

适当的轮询间隔没有真实的定义，因为这取决于被轮询的设备或服务。
例如，我们不应该每5秒钟轮询一次空气质量传感器，因为数据不会那么频繁地变化。
在这种情况下，超过99%的用户会对每分钟或更长时间的轮询间隔感到满意。

再举一个例子，如果我们轮询一个每小时更新数据的云服务以获取太阳能板的数据。
每分钟轮询一次是不合适的，因为数据在轮询之间不会发生变化。

对于那些希望获得更频繁更新的用户，他们可以[定义自定义轮询间隔](https://www.home-assistant.io/common-tasks/general/#defining-a-custom-polling-interval)。

## 示例实现

设置轮询间隔有两种方法。
使用哪种方法取决于集成如何轮询数据。
使用更新协调器时，可以通过在协调器中设置`update_interval`参数或属性来设置轮询间隔。
使用内置实体更新方法时，若将`should_poll`实体属性设置为`True`，则可以通过在平台模块中设置`SCAN_INTERVAL`常量来设置轮询间隔。

`coordinator.py`:
```python {10} showLineNumbers
class MyCoordinator(DataUpdateCoordinator[MyData]):
    """管理数据获取的类。"""

    def __init__(self, hass: HomeAssistant) -> None:
        """初始化协调器。"""
        super().__init__(
            hass,
            logger=LOGGER,
            name=DOMAIN,
            update_interval=timedelta(minutes=1),
        )
```

`sensor.py`:
```python {1} showLineNumbers
SCAN_INTERVAL = timedelta(minutes=1)

class MySensor(SensorEntity):
    """传感器的表现。"""

    _attr_should_poll = True
```

## 额外资源

有关轮询的更多信息可以在[文档](/docs/integration_fetching_data)中找到。

## 例外情况

此规则没有例外情况。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>