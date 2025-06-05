---
title: "不允许同一设备或服务被设置两次"
related_rules:
  - config-flow
  - test-before-configure
  - config-flow-test-coverage
  - discovery
  - reauthentication-flow
  - reconfiguration-flow
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

由于集成通过用户界面设置很容易，用户可能会不小心将同一设备或服务设置两次。
这可能导致重复的设备和实体具有唯一标识符冲突，从而产生负面影响。
任何发现流程还必须确保配置条目是唯一可识别的，否则，它将发现已经设置的设备。

为了防止这种情况，我们需要确保用户只能设置一次设备或服务。

## 示例实现

集成检查其是否已经被设置的常见方法有两种。
第一种方法是通过将 `unique_id` 分配给配置条目。
第二种方法是通过检查配置条目中数据片段是否唯一。

以下示例展示了如何在配置流程中实现这些检查。

### 唯一标识符

第一种方法是通过将 `unique_id` 分配给配置条目。
此唯一 ID 在每个集成域中都是唯一的，因此另一个集成可以毫无问题地使用相同的唯一 ID。
下面是一个配置流程的示例，它获取输入配置的 `unique_id` 并检查 `unique_id` 是否已经存在。
如果存在，流程将中止并向用户显示错误消息。

`config_flow.py`:
```python {16-17} showLineNumbers
    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """处理由用户初始化的流程。"""
        errors: dict[str, str] = {}
        if user_input:
            client = MyClient(user_input[CONF_HOST])
            try:
                identifier = await client.get_identifier()
            except MyException:
                errors["base"] = "cannot_connect"
            except Exception:  # noqa: BLE001
                LOGGER.exception("意外异常")
                errors["base"] = "unknown"
            else:
                await self.async_set_unique_id(identifier)
                self._abort_if_unique_id_configured()
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

### 唯一数据

第二种方法是通过检查配置条目中数据片段是否唯一。
在以下示例中，用户填写了主机和密码。
如果已经存在相同主机的配置条目，则流程将中止并向用户显示错误消息。

`config_flow.py`:
```python
    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """处理由用户初始化的流程。"""
        errors: dict[str, str] = {}
        if user_input:
            self._async_abort_entries_match({CONF_HOST: user_input[CONF_HOST]})
            client = MyClient(user_input[CONF_HOST], user_input[CONF_PASSWORD])
            try:
                await client.get_data()
            except MyException:
                errors["base"] = "cannot_connect"
            except Exception:  # noqa: BLE001
                LOGGER.exception("意外异常")
                errors["base"] = "unknown"
            else:
                return self.async_create_entry(
                    title="MyIntegration",
                    data=user_input,
                )
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_HOST): TextSelector(),
                    vol.Required(CONF_PASSWORD): TextSelector(),
                }
            ),
            errors=errors,
        )
```


## 其他资源

有关配置流程的更多信息，请查看 [配置流程文档](/docs/config_entries_config_flow_handler)。
有关唯一标识符要求的更多信息，请查看 [文档](/docs/entity_registry_index#unique-id-requirements)。

## 例外情况

此规则没有例外情况。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>