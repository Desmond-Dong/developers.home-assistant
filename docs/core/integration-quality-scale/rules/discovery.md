---
title: "设备可以被发现"
related_rules:
  - config-flow
  - test-before-configure
  - unique-config-entry
  - config-flow-test-coverage
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

许多设备具有被发现的能力。
这可以通过以下一种方法进行：
- 插件
- 蓝牙
- DHCP
- HomeKit
- mDNS
- MQTT
- SSDP
- USB

这是一种极好的方式，使用户更容易找到和设置设备，因为他们不必手动查找使用哪个集成，然后输入主机。
这大大减少了设置设备所需的努力，从而改善了用户体验。

使用基于网络的设置，还允许在设备接收到新的IP地址后更新集成的配置。

## 示例实现

在以下示例中，集成可以通过mDNS进行发现。
设备会通过提供一个 `_mydevice._tcp.local.` 服务使自己可被发现。
Home Assistant会捕捉到这一点并为用户启动发现流程。
用户然后可以确认发现并设置集成。

`manifest.json`:
```json {2} showLineNumbers
{
  "zeroconf": ["_mydevice._tcp.local."]
}
```

`config_flow.py`:
```python {8-23,25-36} showLineNumbers
class MyConfigFlow(ConfigFlow, domain=DOMAIN):
    """我的配置流程."""

    def __init__(self) -> None:
        """初始化配置流程."""
        self.data: dict[str, Any] = {}

    async def async_step_zeroconf(
        self, discovery_info: zeroconf.ZeroconfServiceInfo
    ) -> ConfigFlowResult:
        """处理zeroconf发现."""
        self.data[CONF_HOST] = host = discovery_info.host

        await self.async_set_unique_id(discovery_info.properties["serialno"])
        self._abort_if_unique_id_configured(updates={CONF_HOST: host})

        client = MyClient(host)
        try:
            await client.get_data()
        except MyClientError:
            return self.async_abort(reason="无法连接")

        return await self.async_step_discovery_confirm()

    async def async_step_discovery_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """确认发现."""
        if user_input is not None:
            return self.async_create_entry(
                title="我的集成",
                data={CONF_HOST: self.data[CONF_HOST]},
            )

        self._set_confirm_only()
        return self.async_show_form(step_id="discovery_confirm")

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """处理用户初始化的流程."""
        errors: dict[str, str] = {}
        if user_input:
            client = MyClient(user_input[CONF_HOST])
            try:
                serial_number = await client.check_connection()
            except MyException as exception:
                errors["base"] = "无法连接"
            else:
                await self.async_set_unique_id(
                    serial_number, raise_on_progress=False
                )
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title="我的集成",
                    data=user_input,
                )
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_HOST): TextSelector(),
                }
            ),
            errors=errors,
        )
```

## 额外资源

要了解有关配置流程的更多信息，请查看 [配置流程文档](/docs/config_entries_config_flow_handler)。
要了解有关网络协议发现的更多信息，请查看 [网络和发现文档](/docs/network_discovery)。
要了解有关蓝牙设备发现的更多信息，请查看 [蓝牙文档](/docs/bluetooth)。

## 例外情况

该规则的例外是并非所有设备都可以被发现。
设备不能被发现的集成不受此规则的限制。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>