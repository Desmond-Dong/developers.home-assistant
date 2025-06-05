---
title: "集成应该有重新配置流程"
related_rules:
  - config-flow
  - test-before-configure
  - unique-config-entry
  - config-flow-test-coverage
  - reauthentication-flow
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

用户可能会更改设备或服务的某些内容，例如更改密码或更改IP地址。 理想情况下，Home Assistant 捕获这些事件，并让用户知道需要重新认证或需要注意。 重新配置流程使用户能够触发重新配置，并允许他们更新设备或服务的配置，而无需移除和重新添加设备或服务。

这为用户提供了更多解决问题的方法，而无需重新启动软件或触发重新认证。

## 示例实现

在 `config_flow.py` 文件中，添加一个名为 `reconfigure` 的新步骤，允许用户重新配置集成。 在以下示例中，我们检查新的 api token 是否有效。 我们还仔细检查用户是否没有尝试用不同的帐户重新配置集成，因为用于集成的帐户不应更改。

`config_flow.py`:
```python {4-31} showLineNumbers
class MyConfigFlow(ConfigFlow, domain=DOMAIN):
    """我的配置流程。"""

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """处理集成的重新配置。"""
        errors: dict[str, str] = {}
        if user_input:
            client = MyClient(user_input[CONF_HOST], user_input[CONF_API_TOKEN])
            try:
                user_id = await client.check_connection()
            except MyException as exception:
                errors["base"] = "无法连接"
            else:
                await self.async_set_unique_id(user_id)
                self._abort_if_unique_id_mismatch(reason="帐户错误")
                return self.async_update_reload_and_abort(
                    self._get_reconfigure_entry(),
                    data_updates=user_input,
                )
        return self.async_show_form(
            step_id="reconfigure",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_HOST): TextSelector(),
                    vol.Required(CONF_API_TOKEN): TextSelector(),
                }
            ),
            errors=errors,
        )

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """处理用户初始化的流程。"""
        errors: dict[str, str] = {}
        if user_input:
            client = MyClient(user_input[CONF_HOST], user_input[CONF_API_TOKEN])
            try:
                user_id = await client.check_connection()
            except MyException as exception:
                errors["base"] = "无法连接"
            else:
                await self.async_set_unique_id(user_id)
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title="MyIntegration",
                    data=user_input,
                )
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_HOST): TextSelector(),
                    vol.Required(CONF_API_TOKEN): TextSelector(),
                }
            ),
            errors=errors,
        )
```

## 其他资源

有关重新配置流程的更多信息，请参见 [重新配置流程文档](/docs/config_entries_config_flow_handler#reconfigure)。

## 例外情况

在其配置流程中没有设置的集成不受此规则的限制。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>