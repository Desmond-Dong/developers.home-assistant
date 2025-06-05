---
title: "集成依赖支持传入 websession"
related_rules:
  - async-dependency
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

由于许多设备和服务通过 HTTP 连接，活动 web 会话的数量可能很高。
为了提高这些 web 会话的效率，建议支持将 web 会话传入集成使用的依赖客户端。

Home Assistant 支持 [`aiohttp`](https://docs.aiohttp.org/en/stable/) 和 [`httpx`](https://www.python-httpx.org/)。
这意味着集成依赖应该使用这两个库中的任意一个。

## 示例实现

在下面的示例中，一个 `aiohttp` 会话被传入客户端。
对于 `httpx` 来说，等价的用法是 `get_async_client`。

```python {4} showLineNumbers
async def async_setup_entry(hass: HomeAssistant, entry: MyConfigEntry) -> bool:
    """通过配置条目设置我的集成。"""

    client = MyClient(entry.data[CONF_HOST], async_get_clientsession(hass))
```

:::info
在某些情况下，您可能不想使用共享会话，例如当使用 cookies 时。
在这种情况下，您可以使用 `async_create_clientsession` 为 `aiohttp` 创建一个新会话，以及使用 `create_async_httpx_client` 为 `httpx` 创建一个新会话。
:::

## 例外情况

如果集成没有进行任何 HTTP 请求，则此规则不适用。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>