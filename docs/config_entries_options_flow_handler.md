---
title: 选项流
---

通过配置条目配置的集成可以向用户暴露选项，以允许调整集成的行为，例如应该集成哪些设备或位置。

配置条目选项使用 [数据流条目框架](data_entry_flow_index.md) 允许用户更新配置条目的选项。希望支持配置条目选项的组件需要定义一个选项流处理器。

## 选项支持

为了支持选项，集成需要在其配置流处理器中具有 `async_get_options_flow` 方法。调用它将返回组件选项流处理器的实例。

```python
@staticmethod
@callback
def async_get_options_flow(
    config_entry: ConfigEntry,
) -> OptionsFlowHandler:
    """创建选项流。"""
    return OptionsFlowHandler()
```

## 流处理器

流处理器的工作方式与配置流处理器相同，只是流中的第一个步骤将始终是 `async_step_init`。当前配置条目的详细信息可以通过 `self.config_entry` 属性获取。

```python
OPTIONS_SCHEMA=vol.Schema(
    {
        vol.Required("show_things"): bool,
    }
)
class OptionsFlowHandler(config_entries.OptionsFlow):
    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """管理选项。"""
        if user_input is not None:
            return self.async_create_entry(data=user_input)

        return self.async_show_form(
            step_id="init",
            data_schema=self.add_suggested_values_to_schema(
                OPTIONS_SCHEMA, self.config_entry.options
            ),
        )
```

## 信号更新

如果集成应该对更新的选项采取行动，可以向配置条目注册一个更新监听器，当条目被更新时将调用该监听器。通过在集成的 `__init__.py` 中的 `async_setup_entry` 函数中添加以下内容来注册监听器。

```python
entry.async_on_unload(entry.add_update_listener(update_listener))
```

使用上述方式，监听器在条目加载时附加，并在卸载时分离。监听器应为一个异步函数，该函数接受与 `async_setup_entry` 相同的输入。然后可以从 `entry.options` 访问选项。

```python
async def update_listener(hass, entry):
    """处理选项更新。"""