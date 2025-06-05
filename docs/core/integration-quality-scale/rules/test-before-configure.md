---
title: "在配置流中测试连接"
related_rules:
  - config-flow
  - unique-config-entry
  - config-flow-test-coverage
  - discovery
  - reauthentication-flow
  - reconfiguration-flow
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

除了使用非常方便外，配置流还是让用户知道在配置完成后某些事情无法正常工作的一种好方法。
这可以捕捉到如下问题：
- DNS 问题
- 防火墙问题
- 错误的凭据
- 错误的 IP 地址或端口
- 不支持的设备

像这样的支持问题在集成设置完成后通常很难调试，因此最好早期捕捉这些问题，以避免用户面临无法正常工作的集成。

由于这改善了用户体验，因此在配置流中测试连接是必需的。

## 示例实现

要验证用户输入，可以像往常一样使用数据调用您的库，并进行测试调用。
如果调用失败，可以向用户返回错误消息。

在以下示例中，如果 `client.get_data()` 调用引发 `MyException`，用户将看到一条错误消息，告知集成无法连接。

`config_flow.py`:
```python {10-17} showLineNumbers
class MyConfigFlow(ConfigFlow, domain=DOMAIN):
    """我的配置流。"""

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """处理由用户初始化的流。"""
        errors: dict[str, str] = {}
        if user_input:
            client = MyClient(user_input[CONF_HOST])
            try:
                await client.get_data()
            except MyException:
                errors["base"] = "无法连接"
            except Exception:  # noqa: BLE001
                LOGGER.exception("意外异常")
                errors["base"] = "未知"
            else:
                return self.async_create_entry(
                    title="MyIntegration",
                    data=user_input,
                )
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({vol.Required(CONF_HOST): TextSelector()}),
            errors=errors,
        )
```

## 其他资源

有关配置流的更多信息，请参阅 [配置流文档](/docs/config_entries_config_flow_handler)。

## 排除条款

与设备或服务（例如辅助工具）没有连接的集成不需要在配置流中测试连接，并且免于此规则。
依赖运行时自动发现的集成（如 Google Cast）也免于此规则。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>