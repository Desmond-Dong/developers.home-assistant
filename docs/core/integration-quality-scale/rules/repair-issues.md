---
title: "维修问题和维修流程在需要用户干预时使用"
---

## 理由

维修问题和维修流程是一种非常用户友好的方式，让用户知道出现了问题，并且他们可以采取行动解决。
维修问题仅仅是让用户知道他们可以自己修复，而维修流程则可以为他们进行修复。

维修问题和维修流程应该是可操作的，并且提供有关问题的信息。
因此，我们不应该仅仅因为让用户知道出现了问题而提出维修问题，特别是那些他们无法自行修复的问题。

## 示例实现

在下面的示例中，我们有一个本地托管服务的集成。
在启动时，我们检查是否支持正在运行的服务版本。
如果不支持，我们会提出一个维修问题，提醒用户在再次使用集成之前需要更新他们的服务。

`__init__.py`
```python {6-14} showLineNumbers
async def async_setup_entry(hass: HomeAssistant, entry: MyConfigEntry) -> None:
    """根据配置条目设置集成。"""
    client = MyClient(entry.data[CONF_HOST])
    version = await client.get_version()
    if version < MINIMUM_VERSION:
        ir.async_create_issue(
            hass,
            DOMAIN,
            "outdated_version",
            is_fixable=False,
            issue_domain=DOMAIN,
            severity=ir.IssueSeverity.ERROR,
            translation_key="outdated_version",
        )
        raise ConfigEntryError(
            "MyService 的版本为 %s，低于最低版本 %s",
            version,
            MINIMUM_VERSION,
        )
```

## 额外资源

有关维修问题和维修流程的更多信息，请参阅 [维修](/docs/core/platform/repairs) 文档。

## 例外

对此规则没有例外。