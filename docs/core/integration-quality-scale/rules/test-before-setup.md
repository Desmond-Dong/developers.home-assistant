---
title: "在集成初始化期间检查我们是否能够正确设置它"
related_rules:
  - runtime-data
---
import RelatedRules from './_includes/related_rules.jsx'

## 推理

当我们初始化一个集成时，我们应该检查是否能够正确地设置它。
这样我们可以立即让用户知道它无法工作。

实施这些检查可以增加集成正常工作的信心，并提供用户友好的错误显示方式。
这将改善用户体验。

## 示例实现

当失败的原因是暂时性的（例如临时离线设备）时，我们应该引发 `ConfigEntryNotReady`，Home Assistant 将在稍后重试设置。
如果失败的原因是密码不正确或 API 密钥无效，则应引发 `ConfigEntryAuthFailed`，Home Assistant 将要求用户重新认证（如果实现了重新认证流程）。
如果我们不期望集成在可预见的未来内正常工作，则应引发 `ConfigEntryError`。

`__init__.py`:
```python {6-13} showLineNumbers
async def async_setup_entry(hass: HomeAssistant, entry: MyIntegrationConfigEntry) -> bool:
    """从配置条目设置我的集成。"""

    client = MyClient(entry.data[CONF_HOST])

    try:
        await client.async_setup()
    except OfflineException as ex:
        raise ConfigEntryNotReady("设备离线") from ex
    except InvalidAuthException as ex:
        raise ConfigEntryAuthFailed("认证无效") from ex
    except AccountClosedException as ex:
        raise ConfigEntryError("账户已关闭") from ex

    entry.runtime_data = client

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True
```

:::info
请注意，使用数据更新协调器通过 `await coordinator.async_config_entry_first_refresh()` 时，这也可能被隐式实现。
:::

## 其他资源

有关配置条目及其生命周期的更多信息，请参阅 [配置条目文档](/docs/config_entries_index)。

## 异常

此规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>