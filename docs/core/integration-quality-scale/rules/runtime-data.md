---
title: "使用 ConfigEntry.runtime_data 存储运行时数据"
related_rules:
  - strict-typing
  - test-before-setup
---
import RelatedRules from './_includes/related_rules.jsx'

## 推理

`ConfigEntry` 对象具有一个 `runtime_data` 属性，可用于存储运行时数据。
这对于存储未持久化到配置文件存储的数据但在配置条目的生命周期内需要的数据非常有用。

通过使用 `runtime_data`，我们为开发者提供了一种一致且类型化的方式来存储运行时数据。
由于增加了类型，我们可以使用工具来避免类型错误。

## 示例实现

`ConfigEntry` 的类型可以通过放入 `runtime_data` 的数据类型进行扩展。
在以下示例中，我们通过 `MyClient` 扩展 `ConfigEntry` 类型，这意味着 `runtime_data` 属性将是 `MyClient` 类型。

`__init__.py`:
```python {1,4,9} showLineNumbers
type MyIntegrationConfigEntry = ConfigEntry[MyClient]


async def async_setup_entry(hass: HomeAssistant, entry: MyIntegrationConfigEntry) -> bool:
    """从配置条目设置我的集成。"""

    client = MyClient(entry.data[CONF_HOST])

    entry.runtime_data = client

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True
```

:::info
如果集成实现了 `strict-typing`，则需要使用自定义类型的 `MyIntegrationConfigEntry`，并且必须在整个过程中使用。
:::

## 其他资源

有关配置条目及其生命周期的更多信息，请参见 [配置条目文档](/docs/config_entries_index)。

## 例外

对此规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>