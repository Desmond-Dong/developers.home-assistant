---
title: "服务操作在遇到失败时引发异常"
related_rules:
  - exception-translations
  - action-setup
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

在执行服务操作时可能会出现问题。
当这种情况发生时，集成应引发异常以指示发生了错误。
异常消息将在用户界面中显示给用户，并可用于帮助诊断问题。
该消息将从附加的翻译字符串生成或从异常参数生成。

## 示例实现

当问题由于不正确的使用造成时（例如输入不正确或引用不存在的内容），我们应该引发 `ServiceValidationError`。
当问题由于服务操作本身的错误造成时（例如，网络错误或服务中的错误），我们应该引发 `HomeAssistantError`。

在这个示例中，我们展示了一个在 Home Assistant 中注册为服务操作的函数。
如果输入不正确（当结束日期早于开始日期时），将引发 `ServiceValidationError`，如果我们无法连接到服务，则引发 `HomeAssistantError`。

```python {8,12} showLineNumbers
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError

async def async_set_schedule(call: ServiceCall) -> ServiceResponse:
    """设置一天的日程表。"""
    start_date = call.data[ATTR_START_DATE]
    end_date = call.data[ATTR_END_DATE]
    if end_date < start_date:
        raise ServiceValidationError("结束日期必须晚于开始日期")
    try:
        await client.set_schedule(start_date, end_date)
    except MyConnectionError as err:
        raise HomeAssistantError("无法连接到日程表") from err
```

## 其他资源

有关引发异常的更多信息，请查看 [文档](../../platform/raising_exceptions)。

## 异常

对此规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>