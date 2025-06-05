---
title: "使用 asyncio 的线程安全性"
---

使用 asyncio 进行开发需要特别注意线程安全，因为几乎所有的 asyncio 对象都不是线程安全的。如果你刚开始接触 asyncio，请查看 Python 的文档 [使用 asyncio 进行开发](https://docs.python.org/3/library/asyncio-dev.html)，获得避免陷阱的技巧。

Home Assistant 在同一代码库中处理异步和非异步代码时有一些约定。主要要点包括：

- 从辅助函数运行一个函数的方式取决于它是否被 `@callback` 装饰，以指示它不会阻塞并且安全在事件循环中运行；详细信息，请参见 [处理异步](asyncio_working_with_async.md)。
- 大多数 API 在从线程调用函数时都有同步和异步版本。异步 API 以 `async_` 前缀开头。例如，当从事件循环以外的线程触发事件时，使用 `hass.bus.fire` 而不是 `hass.bus.async_fire`。

:::tip
在开发过程中，请确保启用 [`asyncio` 调试模式](https://docs.python.org/3/library/asyncio-dev.html#debug-mode) 和 [Home Assistant 的内置调试模式](https://www.home-assistant.io/integrations/homeassistant/#debug)，因为许多线程安全错误可以自动检测到。
:::

## 解决线程安全错误

您可能访问此页面是因为 Home Assistant 检测并报告了线程安全错误。从版本 2024.5.0 开始，Home Assistant 可以检测、报告并阻止某些非线程安全操作，以防止系统不稳定。在 Home Assistant 能够检测这些错误之前，它们可能导致意外重启或未定义行为，因为它们可能会破坏内部 asyncio 状态。以下是一些如何纠正非线程操作的技巧。

## 确保代码在正确的线程中运行

### 接受回调的内置助手

当使用 Home Assistant 的内置助手，例如 `event.async_track_state_change_event` 或 `event.track_state_change_event` 时，根据代码运行的线程调用正确的 API 非常重要。如果代码在事件循环以外的线程中运行，请使用非 `async` 版本。

在下面的示例中，所有内容都将在事件循环线程中运行，当 `async_track_state_change_event` 被触发时，`async_update_event_state_callback` 也将在事件循环线程中运行，因为它被 `@callback` 装饰。如果缺少 `@callback` 装饰器，`async_update_event_state_callback` 将在执行器中运行，这将导致对 `async_write_ha_state` 的非线程安全调用。

```python

    async def async_added_to_hass(self) -> None:
        """实体已被添加到 hass。"""
        self.async_on_remove(
            async_track_state_change_event(
                self.hass,
                ["light.other"],
                self.async_update_event_state_callback,
            )
        )

    @callback
    def async_update_event_state_callback(self, event: Event[EventStateChangedData]) -> None:
        """当实体状态变化时调用。"""
        new_state = event.data["new_state"]
        if new_state is None or new_state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return
        self.async_write_ha_state()

```

### 特定的 API 调用

您可能会发现需要从事件循环线程以外的线程调用某个异步 API 调用。在大多数情况下，`hass.add_job` 可以安全地从另一个线程调用异步 API。一些助手在从另一个线程调用时具有特定的同步 API。以下是最常调用的异步 API 及其在另一个线程中调用的方法列表。

#### hass.async_create_task

当从事件循环线程以外的线程创建任务时，请使用 `hass.create_task`

#### hass.bus.async_fire

当从事件循环线程以外的线程触发事件时，请使用 `hass.bus.fire`

#### hass.services.async_register

当从事件循环线程以外的线程注册服务操作时，请使用 `hass.services.register`

#### hass.services.async_remove

当从事件循环线程以外的线程移除服务操作时，请使用 `hass.services.remove`

#### async_write_ha_state

当从事件循环线程以外的线程写入实体状态时，请使用 `self.schedule_update_ha_state`

#### hass.config_entries.async_update_entry

更新配置条目必须在事件循环线程中完成。没有同步 API 来更新配置条目。如果调用函数在另一个线程中运行并不是错误，请使用 `hass.add_job` 在事件循环中调度一个调用 `hass.config_entries.async_update_entry` 的函数。

#### async_dispatcher_send

当从事件循环线程以外的线程调用调度器时，请使用 `dispatcher_send`。

#### async_render_to_info

模板必须在事件循环线程中渲染。没有同步 API 来渲染模板。使用 `hass.add_job` 在事件循环中调度一个调用 `async_render_to_info` 的函数。

#### area_registry.async_create

区域注册表必须在事件循环线程中修改。没有同步 API 用于区域注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `area_registry.async_create` 的函数。

#### area_registry.async_delete

区域注册表必须在事件循环线程中修改。没有同步 API 用于区域注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `area_registry.async_delete` 的函数。

#### area_registry.async_update

区域注册表必须在事件循环线程中修改。没有同步 API 用于区域注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `area_registry.async_update` 的函数。

#### category_registry.async_create

类别注册表必须在事件循环线程中修改。没有同步 API 用于类别注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `category_registry.async_create` 的函数。

#### category_registry.async_delete

类别注册表必须在事件循环线程中修改。没有同步 API 用于类别注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `category_registry.async_delete` 的函数。

#### category_registry.async_update

类别注册表必须在事件循环线程中修改。没有同步 API 用于类别注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `category_registry.async_update` 的函数。

#### device_registry.async_update_device

设备注册表必须在事件循环线程中修改。没有同步 API 用于设备注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `device_registry.async_update_device` 的函数。

#### device_registry.async_remove_device

设备注册表必须在事件循环线程中修改。没有同步 API 用于设备注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `device_registry.async_remove_device` 的函数。

#### entity_registry.async_get_or_create

实体注册表必须在事件循环线程中修改。没有同步 API 用于实体注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `entity_registry.async_get_or_create` 的函数。

#### entity_registry.async_remove

实体注册表必须在事件循环线程中修改。没有同步 API 用于实体注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `entity_registry.async_remove` 的函数。

#### entity_registry.async_update_entity

实体注册表必须在事件循环线程中修改。没有同步 API 用于实体注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `entity_registry.async_update_entity` 的函数。

#### floor_registry.async_create

楼层注册表必须在事件循环线程中修改。没有同步 API 用于楼层注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `floor_registry.async_create` 的函数。

#### floor_registry.async_delete

楼层注册表必须在事件循环线程中修改。没有同步 API 用于楼层注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `floor_registry.async_delete` 的函数。

#### floor_registry.async_update

楼层注册表必须在事件循环线程中修改。没有同步 API 用于楼层注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `floor_registry.async_update` 的函数。

#### issue_registry.async_get_or_create

问题注册表必须在事件循环线程中修改。在此调用 `issue_registry.create_issue`。

#### issue_registry.async_delete

问题注册表必须在事件循环线程中修改。在此调用 `issue_registry.delete_issue`。

#### issue_registry.async_ignore

问题注册表必须在事件循环线程中修改。没有同步 API 可以在问题注册表中忽略问题。使用 `hass.add_job` 在事件循环中调度一个调用 `issue_registry.async_ignore_issue` 的函数。

#### label_registry.async_create

标签注册表必须在事件循环线程中修改。没有同步 API 用于标签注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `label_registry.async_create` 的函数。

#### label_registry.async_delete

标签注册表必须在事件循环线程中修改。没有同步 API 用于标签注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `label_registry.async_delete` 的函数。

#### label_registry.async_update

标签注册表必须在事件循环线程中修改。没有同步 API 用于标签注册表。使用 `hass.add_job` 在事件循环中调度一个调用 `label_registry.async_update` 的函数。