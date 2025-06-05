---
title: "异常信息是可翻译的"
related_rules:
  - entity-translations
  - action-exceptions
---
import RelatedRules from './_includes/related_rules.jsx'

## 推理

有时候会出现问题，我们希望向用户显示错误信息。  
由于Home Assistant被全球各地的人使用，确保这些错误信息是可翻译的非常重要。  
这提高了Home Assistant对不使用英语的用户的可用性。

Home Assistant内置了对来自`HomeAssistantError`异常的消息翻译的支持。

## 示例实现

在这个示例中，我们展示了一个注册为Home Assistant服务动作的函数。  
集成领域和翻译的关键在引发异常时传递。  
异常应该继承`HomeAssistantError`以支持翻译。  
错误信息随后在集成的`strings.json`文件中定义。

```python {6-9,13-16} showLineNumbers
async def async_set_schedule(call: ServiceCall) -> ServiceResponse:
    """设置一天的日程安排。"""
    start_date = call.data[ATTR_START_DATE]
    end_date = call.data[ATTR_END_DATE]
    if end_date < start_date:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="end_date_before_start_date",
        )
    try:
        await client.set_schedule(start_date, end_date)
    except MyConnectionError as err:
        raise HomeAssistantError(
            translation_domain=DOMAIN,
            translation_key="cannot_connect_to_schedule",
        ) from err
```

`strings.json`:
```json
{
    "exceptions": {
        "end_date_before_start_date": {
            "message": "结束日期不能早于开始日期。"
        },
        "cannot_connect_to_schedule": {
            "message": "无法连接到日程安排。"
        }
    }
}
```

## 附加资源

有关引发异常的更多信息，请查看[文档](/docs/core/platform/raising_exceptions)。

## 异常

对于此规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>