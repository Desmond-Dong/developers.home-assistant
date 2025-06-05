---
title: "函数分类"
---

在Home Assistant中，一项工作通过一个将被调用的函数表示。根据它是否是异步安全的，它将运行在我们的事件循环中或线程池内。

Home Assistant使用的约定是，所有必须在事件循环中运行的函数都以`async_`作为前缀。

## 协程函数

协程是基于Python生成器语法的特殊函数，允许它们在等待结果时挂起执行。

调用协程函数将返回一个生成器对象，但实际上不会开始执行。该对象将在被等待（从另一个协程内部）或者在事件循环中调度时执行任务。

要声明一个函数为协程，请在函数定义的`def`前添加`async`。

```python
async def async_look_my_coroutine(target):
    result = await entity.async_turn_on()
    if result:
        print(f"hello {target}")


hass.loop.create_task(async_look_my_coroutine("world"))
```

在这个例子中，我们通过调用`hass.loop.create_task`来调度协程。这将把协程添加到待运行任务的队列中。当事件循环正在运行`async_look_my_coroutine`时，当调用`await entity.async_turn_on()`时，它将挂起该任务。此时，将调度一个新任务以执行`entity.async_turn_on()`。当该作业执行完毕后，`async_look_my_coroutine`将恢复。

## 回调函数

这是一个被认为安全在事件循环内部运行的普通函数。回调无法挂起自身，因此不能进行任何I/O或调用协程。回调能够调度一个新任务，但无法等待结果。

要将函数声明为回调，从核心包导入回调注解并对函数进行注解。

在Home Assistant中，回调的常见用例是作为事件监听器或服务动作调用。它可以处理传入的信息，然后调度正确的调用。例如来自自动化引擎的示例。

```python
from homeassistant.core import callback


@callback
def async_trigger_service_handler(service_call):
    """处理自动化触发服务动作调用。"""
    vars = service_call.data.get(ATTR_VARIABLES)
    for entity in component.async_extract_from_service(service_call):
        hass.loop.create_task(entity.async_trigger(vars, True))
```

在这个例子中，`entity.async_trigger`是一个协程函数。调用协程函数将返回一个协程任务。当任务被执行时，传入的参数将被使用。

要执行任务，我们必须将其调度在事件循环中执行。这是通过调用`hass.loop.create_task`来完成的。

### 为什么还要有回调？

你可能会想，如果协程能做回调能做的所有事情，为什么还要有回调。原因是性能和核心API对象的状态一致性更好。

当协程A等待协程B时，它将挂起自己并调度一个新任务去运行B。这意味着事件循环现在运行A、B，然后再运行A。如果B是回调，A将永远不需要挂起自己，因此事件循环只在运行A。其一致性的影响在于，排队在事件循环上运行的其他事件将继续等待回调完成，但在让出给另一个协程时，将会交错执行。

## 事件循环与线程安全

这些是安全地在线程和事件循环内部运行的函数。这些函数通常执行计算或在内存中转换数据。任何执行I/O的任务都不属于此类。这类函数中有许多标准库函数。例如，使用sum生成一组数字的和或合并两个字典。

没有特殊注释来标记函数属于这一类别，使用这些函数时需小心。在有疑虑时，请查看它们的实现。

## 其他函数

这些是所有不适合前面类别的函数。这些函数可能是线程安全的，也可能被认为不安全在事件循环内部运行。这些是会使用sleep或执行I/O的函数。

没有特殊注释被认为是这一类别的一部分。