---
title: "使用 asyncio 导入代码"
---

在使用 asyncio 时，确定何时安全导入代码可能比较棘手，因为需要考虑两个约束：

- 导入代码可能会进行阻塞 I/O，从磁盘加载文件
- 在 [cpython 中导入代码不是线程安全的](https://github.com/python/cpython/issues/83065)

## 模块级导入

如果您的导入位于 **模块级**（也称为 **顶级导入**），并且所有必要的模块都在 `__init__.py` 中导入，Home Assistant 会在 **事件循环开始之前** 或者使用 **导入执行器** 在后台线程中加载您的集成。

在这种情况下，您的导入通常是安全处理的，因此您 **不需要担心** 它们是否对事件循环安全。

## 模块级以外的导入

如果您的导入没有在模块级进行，您必须仔细考虑每个导入，因为导入机制必须从磁盘读取模块，这会导致阻塞 I/O。如果可能，最好将其更改为模块级导入，因为这避免了复杂性和错误的风险。导入模块既消耗 CPU 资源，又涉及阻塞 I/O，因此确保这些操作在执行器中执行至关重要。

如果您可以确保模块已经被导入，使用裸 [`import`](https://docs.python.org/3/reference/simple_stmts.html#import) 语句是安全的，因为 Python 不会再次加载这些模块。

如果集成将始终使用该模块，通常最好在 `__init__.py` 中包括模块级导入，以确保模块被加载。但是，如果这会产生循环导入，您需要使用以下解决方案之一。

如果模块仅在条件下使用，并且只会在单个位置导入，则可以使用标准执行器调用：

- 对于 Home Assistant 内部的导入 `hass.async_add_executor_job(_function_that_does_late_import)`
- 对于 Home Assistant 外部的导入: [`loop.run_in_executor(None, _function_that_does_late_import)`](https://docs.python.org/3/library/asyncio-eventloop.html#asyncio.loop.run_in_executor)
如果同一模块可能在应用程序的不同部分被并发导入，请使用线程安全的 `homeassistant.helpers.importlib.import_module` 辅助函数。

如果可能从多个不同路径导入模块，请使用 `async_import_module`：
示例：

```python
from homeassistant.helpers.importlib import async_import_module

platform = await async_import_module(hass, f"homeassistant.components.homeassistant.triggers.{platform_name}")
```

## 判断模块是否已经加载

如果您不确定一个模块是否已经加载，您可以检查该模块是否已经在 [`sys.modules`](https://docs.python.org/3/library/sys.html#sys.modules) 中。您应该知道，一旦模块开始加载，它将出现在 `sys.modules` 中，并且 [cpython 导入不是线程安全的](https://github.com/python/cpython/issues/83065)。因此，在代码可能从多个路径导入时，考虑竞态条件很重要。

## 避免仅用于类型检查的导入

如果导入的模块仅用于类型检查，建议使用 `if TYPE_CHECKING:` 块来保护它，以避免在运行时被导入。

```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from some_module import SomeClass  # 仅用于类型检查而导入

def some_function() -> SomeClass:
    # 函数实现
    pass
```

## 避免导入很少使用的代码

导入模块可能既耗费 CPU 又耗费 I/O 资源，因此重要的是避免导入很少使用的代码。虽然在模块级之外导入代码确实会增加一些运行时开销，但当代码仅偶尔需要时，这种方法通常更高效。通过延迟导入，您确保在必要时才使用资源，从而减少不必要的处理，提高整体性能。