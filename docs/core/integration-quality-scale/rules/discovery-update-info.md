---
title: "集成使用发现信息更新网络信息"
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

大多数最终用户的网络使用动态IP地址。
这意味着设备和服务可能会获得与最初设置时不同的IP地址。
为了避免用户需要将设备设置为静态IP地址（这并不总是可行），集成应该使用发现信息来更新设备或服务的网络信息。

只有当集成确认设备或服务与之前设置的相同时，我们才会更新设备或服务的IP地址。

## 示例实现

在以下示例中，我们有一个使用mDNS发现设备的集成。
每次开始zeroconf发现流程时，集成会将流程的唯一ID设置为设备的序列号。
如果唯一ID已经设置，则设备的IP地址将在更改时更新，并且流程将被中止。

`manifest.json`:
```json
{
  "zeroconf": ["_mydevice._tcp.local."]
}
```

`config_flow.py`:
```python {14-15} showLineNumbers
class MyConfigFlow(ConfigFlow, domain=DOMAIN):
    """我的配置流程。"""

    def __init__(self) -> None:
        """初始化配置流程。"""
        self.data: dict[str, Any] = {}

    async def async_step_zeroconf(
        self, discovery_info: zeroconf.ZeroconfServiceInfo
    ) -> ConfigFlowResult:
        """处理zeroconf发现。"""
        self.data[CONF_HOST] = host = discovery_info.host

        await self.async_set_unique_id(discovery_info.properties["serialno"])
        self._abort_if_unique_id_configured(updates={CONF_HOST: host})

        client = MyClient(host)
        try:
            await client.get_data()
        except MyClientError:
            return self.async_abort(reason="无法连接")

        return await self.async_step_discovery_confirm()
```

:::info
如果您使用DHCP发现，并且想要接收更新IP地址的发现流程，请确保在设备信息中注册MAC地址，并在清单中将`registered_devices`设置为`true`。
这将为这些设备创建发现流程。
:::

## 附加资源

要了解有关配置流程的更多信息，请查看[配置流程文档](/docs/config_entries_config_flow_handler)。
要了解有关网络协议和发现的更多信息，请查看[网络和发现文档](/docs/network_discovery)。

## 例外

该规则的例外是并非每个设备都可以被发现。
无法发现设备的集成不受此规则的限制。