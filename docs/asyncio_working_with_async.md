---
title: "使用异步"
---

尽管我们有一个向后兼容的 API，但直接使用异步核心会快得多。大多数核心组件已经被重写以利用异步核心。这包括 EntityComponent 助手（光线、开关等的基础）、脚本、组和自动化。

## 与核心的交互

Home Assistant 核心中的所有方法都有两种版本：异步版本和可以从其他线程调用的版本。其他线程的版本只是以线程安全的方式调用异步版本的包装器。

因此，如果你在回调或协程中从核心（hass 对象）进行调用，请使用以 async_ 开头的方法。如果你需要调用一个 async_ 函数，该函数是一个协程，你的任务也必须是一个协程。

## 实现一个异步组件

要使组件异步，需实现 async_setup。

```python
def setup(hass, config):
    """设置组件。"""
    # 在事件循环外部设置组件的代码。
```

将变成：

```python
async def async_setup(hass, config):
    """设置组件。"""
    # 在事件循环内部设置组件的代码。
```

## 实现一个异步平台

对于我们支持异步设置的平台，需要使用协程 async_setup_platform，而不是 setup_platform。

```python
def setup_platform(hass, config, add_entities, discovery_info=None):
    """设置平台。"""
    # 在事件循环外部设置平台的代码。
```

将变成：

```python
async def async_setup_platform(hass, config, async_add_entities, discovery_info=None):
    """设置平台。"""
    # 在事件循环内部设置平台的代码。
```

与原始参数的唯一区别是 `add_entities` 函数已被异步友好的回调 `async_add_entities` 替换。

## 实现一个异步实体

通过将更新方法转换为异步，你可以使实体支持异步。这要求你的实体的依赖项也必须是异步友好的！

```python
class MyEntity(Entity):
    def update(self):
        """检索最新状态。"""
        self._state = fetch_state()
```

将变成：

```python
class MyEntity(Entity):
    async def async_update(self):
        """检索最新状态。"""
        self._state = await async_fetch_state()
```

确保在实体上定义的所有属性不会导致 I/O 操作。所有数据都必须在更新方法内部获取并缓存到实体中。这是因为这些属性是在事件循环内读取的，因此执行 I/O 会导致 Home Assistant 的核心等待直到你的 I/O 完成。

## 从线程调用异步函数

有时你可能在一个线程中，并且想调用一个仅以异步形式可用的函数。Home Assistant 包含一些异步帮助工具来帮助实现这一点。

在以下示例中，`say_hello` 将调度 `async_say_hello` 并阻塞，直到该函数执行完毕并返回结果。

```python
import asyncio


def say_hello(hass, target):
    return asyncio.run_coroutine_threadsafe(
        async_say_hello(hass, target), hass.loop
    ).result()


async def async_say_hello(hass, target):
    return f"你好 {target}!"
```

**警告：** 请小心！如果异步函数使用执行器作业，可能会导致死锁。

## 从异步调用同步函数

如果你在异步上下文中运行，有时可能需要调用同步函数。这样做：

```python
# hub.update() 是一个同步函数。
result = await hass.async_add_executor_job(hub.update)
```

## 从异步启动独立任务

如果你想生成一个不会阻塞当前异步上下文的任务，可以选择在事件循环上将其创建为任务。这样它将并行执行。

```python
hass.async_create_task(async_say_hello(hass, target))