---
title: "使用 asyncio 进行阻塞操作"
---

在编写 asyncio 代码时，确保所有阻塞操作都在单独的线程中进行是至关重要的。如果阻塞操作发生在事件循环中，则在操作完成之前，其他任何内容都无法运行。因此，不应在事件循环中发生任何阻塞操作，因为整个系统将在阻塞操作持续期间停滞。下面将讨论可能导致阻塞的操作的详细示例，例如网络 I/O 或重计算。

:::tip
在开发期间，请确保启用 [`asyncio` 调试模式](https://docs.python.org/3/library/asyncio-dev.html#debug-mode) 和 [Home Assistant 的内置调试模式](https://www.home-assistant.io/integrations/homeassistant/#debug)，因为许多阻塞 I/O 错误可以自动检测到。
:::

## 解决事件循环中的阻塞 I/O

您可能访问这个页面是因为 Home Assistant 检测到并报告了事件循环中的阻塞调用。从版本 2024.7.0 开始，Home Assistant 可以检测到事件循环中的更多阻塞操作以防止系统不稳定。在 Home Assistant 能够检测到这些错误之前，它们可能导致系统无响应或不确定的行为。下面是一些纠正事件循环中阻塞操作的提示。

## 在执行器中运行阻塞调用

在 Home Assistant 中，通常通过调用 `await hass.async_add_executor_job` 来完成此操作。在库代码中，通常使用 `await loop.run_in_executor(None, ...)`。请查看 Python 的文档关于 [运行阻塞代码](https://docs.python.org/3/library/asyncio-dev.html#running-blocking-code) 的提示，以避免陷阱。一些特定的调用可能需要不同的方法。

```python
from functools import partial

def blocking_code(some_arg: str):
    ...

def blocking_code_with_kwargs(kwarg: bool = False):
    ...

# 在 Home Assistant 内调用阻塞功能时
result = await hass.async_add_executor_job(blocking_code, "something")

result = await hass.async_add_executor_job(partial(blocking_code_with_kwargs, kwarg=True))

# 在您库代码中调用阻塞函数时
loop = asyncio.get_running_loop()

result = await loop.run_in_executor(None, blocking_code, "something")

result = await loop.run_in_executor(None, partial(blocking_code_with_kwargs, kwarg=True))
```

### 特定函数调用

根据检测到的阻塞调用类型，解决方案可能会更复杂。

#### open

`open` 进行阻塞磁盘 I/O 应在执行器中运行，使用上述标准方法。

:::warning
当在事件循环中运行的 `open` 调用被修复时，所有阻塞读取和写入也必须被修复以在执行器中进行。Home Assistant 只能检测 `open` 调用，无法检测阻塞读取和写入，这意味着如果阻塞的读取和写入调用没有在与 `open` 调用的同一时间修复，可能会长时间困扰用户，因为它们非常难以发现。
:::

#### import_module

请参见 [使用 asyncio 导入代码](asyncio_imports.md)

#### sleep

阻塞的 sleep 应被替换为 `await asyncio.sleep`。在事件循环中报告的最常见阻塞 `sleep` 是 `pyserial-asyncio`，可以替换为 [`pyserial-asyncio-fast`](https://github.com/home-assistant-libs/pyserial-asyncio-fast)，它没有这个问题。

#### putrequest

urllib 进行阻塞 I/O 应在执行器中运行，使用上述标准方法。考虑将集成转换为使用 `aiohttp` 或 `httpx`。

#### glob

`glob.glob` 进行阻塞磁盘 I/O 应在执行器中运行，使用上述标准方法。

#### iglob

`glob.iglob` 进行阻塞磁盘 I/O 应在执行器中运行，使用上述标准方法。

#### walk

`os.walk` 进行阻塞磁盘 I/O 应在执行器中运行，使用上述标准方法。

#### listdir

`os.listdir` 进行阻塞磁盘 I/O 应在执行器中运行，使用上述标准方法。

#### scandir

`os.scandir` 进行阻塞磁盘 I/O 应在执行器中运行，使用上述标准方法。

#### stat

`os.stat` 进行阻塞磁盘 I/O 应在执行器中运行，使用上述标准方法。

#### write_bytes

`pathlib.Path.write_bytes` 进行阻塞磁盘 I/O 应在执行器中运行，使用上述标准方法。

#### write_text

`pathlib.Path.write_text` 进行阻塞磁盘 I/O 应在执行器中运行，使用上述标准方法。

#### read_bytes

`pathlib.Path.read_bytes` 进行阻塞磁盘 I/O 应在执行器中运行，使用上述标准方法。

#### read_text

`pathlib.Path.read_text` 进行阻塞磁盘 I/O 应在执行器中运行，使用上述标准方法。

#### load_default_certs

`SSLContext.load_default_certs` 进行阻塞磁盘 I/O 以从磁盘加载证书。

以下助手确保阻塞 I/O 将在执行器中进行：

- `aiohttp`: `homeassistant.helpers.aiohttp_client.async_get_clientsession` 创建 `aiohttp.ClientSession`。
- `httpx`: `homeassistant.helpers.httpx_client.get_async_client` 创建 `httpx.AsyncClient`。
- 通用 SSL: `homeassistant.util.ssl`

#### load_verify_locations

请参见 [SSLContext.load_default_certs](#load_default_certs)

#### load_cert_chain

请参见 [SSLContext.load_default_certs](#load_default_certs)

#### set_default_verify_paths

请参见 [SSLContext.load_default_certs](#load_default_certs)