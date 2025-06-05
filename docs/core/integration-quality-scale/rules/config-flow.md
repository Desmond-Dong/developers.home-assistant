---
title: "集成需要能够通过UI进行设置"
related_rules:
  - test-before-configure
  - unique-config-entry
  - config-flow-test-coverage
  - discovery
  - reauthentication-flow
  - reconfiguration-flow
---
import RelatedRules from './_includes/related_rules.jsx'

## 推理

自2018年引入以来，配置流程已成为在Home Assistant中设置集成的标准方式。
它们提供了一致的用户体验，并提供了一种引导用户完成设置过程的方式。

由于更好的用户体验，我们希望确保所有集成都能够通过配置流程进行设置。

由于这是用户开始使用集成的切入点，我们应该确保配置流程非常用户友好和易于理解。
这意味着我们应该在合适的地方使用正确的选择器，在需要的地方验证输入，并在`strings.json`中使用`data_description`来提供有关输入字段的上下文。

集成应该将所有配置存储在`ConfigEntry.data`字段中，而所有不需要连接的设置应该存储在`ConfigEntry.options`字段中。

## 示例实现

要在您的集成中使用配置流程，您需要在集成文件夹中创建一个`config_flow.py`文件，并在您的`manifest.json`中将`config_flow`设置为`true`。
在配置流程中显示的文本在`strings.json`文件中定义。

`config_flow.py`:
```python
class MyConfigFlow(ConfigFlow, domain=DOMAIN):
    """我的配置流程。"""

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """处理由用户初始化的流程。"""
        errors: dict[str, str] = {}
        if user_input:
            return self.async_create_entry(
                title="MyIntegration",
                data=user_input,
            )
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({vol.Required(CONF_HOST): str}),
            errors=errors,
        )
```

`strings.json`: 
```json
{
  "config": {
    "step": {
      "user": {
        "data": {
          "host": "主机"
        },
        "data_description": {
          "host": "MyIntegration设备的主机名或IP地址。"
        }
      }
    }
  }
}
```

## 额外资源

有关配置流程的更多信息可以在[配置流程文档](/docs/config_entries_config_flow_handler)中找到。
有关配置流程架构决策的更多信息可以在[ADR-0010](https://github.com/home-assistant/architecture/blob/master/adr/0010-integration-configuration.md)中找到。

## 例外

在[ADR-0010](https://github.com/home-assistant/architecture/blob/master/adr/0010-integration-configuration.md)中豁免的集成不受此规则的限制。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>