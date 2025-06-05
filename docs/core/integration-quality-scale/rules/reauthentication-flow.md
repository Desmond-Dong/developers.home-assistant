---
title: "重新身份验证需要通过用户界面可用"
related_rules:
  - config-flow
  - test-before-configure
  - config-flow-test-coverage
  - test-before-setup
  - reconfiguration-flow
---
import RelatedRules from './_includes/related_rules.jsx'

##  推理

用户可能会更改设备或服务的密码，并忘记他们的设备或账户仍然链接到 Home Assistant。
为了避免用户必须删除配置条目并重新添加它，我们启动重新身份验证流程。
在此流程中，用户可以提供今后要使用的新凭据。

这是一种非常用户友好的方式，让用户知道他们需要采取行动并更新他们的凭据。

## 示例实现

在下面的示例中，我们展示了一个身份验证流程，允许用户使用新的 API 令牌重新身份验证。
当我们收到新令牌时，我们检查是否可以连接到服务，以避免用户输入无效的令牌。
如果连接成功，我们用新令牌更新配置条目。

`config_flow.py`:
```python {6-11,13-35} showLineNumbers
class MyConfigFlow(ConfigFlow, domain=DOMAIN):
    """我的配置流程。"""
    
    host: str

    async def async_step_reauth(
        self, entry_data: Mapping[str, Any]
    ) -> ConfigFlowResult:
        """在 API 身份验证错误时执行重新身份验证。"""
        self.host = entry_data[CONF_HOST]
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """确认重新身份验证对话框。"""
        errors: dict[str, str] = {}
        if user_input:
            client = MyClient(self.host, user_input[CONF_API_TOKEN])
            try:
                user_id = await client.check_connection()
            except MyException as exception:
                errors["base"] = "cannot_connect"
            else:
                await self.async_set_unique_id(user_id)
                self._abort_if_unique_id_mismatch(reason="wrong_account")
                return self.async_update_reload_and_abort(
                    self._get_reauth_entry(),
                    data_updates={CONF_API_TOKEN: user_input[CONF_API_TOKEN]},
                )
        return self.async_show_form(
            step_id="reauth_confirm",
            data_schema=vol.Schema({vol.Required(CONF_API_TOKEN): TextSelector()}),
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
                errors["base"] = "cannot_connect"
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

## 附加资源

有关处理过期凭据的更多信息，请查看 [文档](/docs/integration_setup_failures#handling-expired-credentials)。

## 例外情况

如果集成不需要任何形式的身份验证，则此规则不适用。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>