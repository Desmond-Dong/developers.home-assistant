---
title: 数据录入流程
---

数据录入流程是 Home Assistant 的一个数据录入框架。数据录入通过数据录入流程进行。一个流程可以表示一个简单的登录表单或组件的多步骤设置向导。流程管理器管理所有进行中的流程，并处理新流程的创建。

数据录入流程用于 Home Assistant 中进行登录、创建配置项、处理选项流程和修复问题。

## 流程管理器

这是管理进行中流程的类。当实例化一个流程管理器时，您需要传入两个异步回调：

```python
async def async_create_flow(handler, context=context, data=data):
    """创建流程。"""
```

管理器将配置流程处理器的实例化委托给这个异步回调。这允许管理器的父级定义自己的查找处理器的方法以及准备处理器以便实例化。例如，在配置项管理器的情况下，它将确保依赖项和要求被设置好。

```python
async def async_finish_flow(flow, result):
    """完成流程。"""
```

当流程完成或被中止时，会调用这个异步回调。即 `result['type'] in [FlowResultType.CREATE_ENTRY, FlowResultType.ABORT]`。回调函数可以修改结果并返回，如果结果类型更改为 `FlowResultType.FORM`，流程将继续运行，显示另一个表单。

如果结果类型为 `FlowResultType.FORM`，则结果应如下所示：

```python
{
    # 流程的结果类型
    "type": FlowResultType.FORM,
    # 流程的 ID
    "flow_id": "abcdfgh1234",
    # 处理器名称
    "handler": "hue",
    # 步骤名称，当表单提交时将调用 flow.async_step_[step_id]
    "step_id": "init",
    # 用于构建和验证用户输入的 voluptuous 模式
    "data_schema": vol.Schema(),
    # 错误字典，如果没有错误则为 None
    "errors": errors,
    # 关于步骤的详细信息
    "description_placeholders": description_placeholders,
}
```

如果结果类型为 `FlowResultType.CREATE_ENTRY`，则结果应如下所示：

```python
{
    # 条目的数据模式版本
    "version": 2,
    # 流程的结果类型
    "type": FlowResultType.CREATE_ENTRY,
    # 流程的 ID
    "flow_id": "abcdfgh1234",
    # 处理器名称
    "handler": "hue",
    # 由处理器创建的标题和数据
    "title": "某个标题",
    "result": {
        "some": "data"
    },
}
```

如果结果类型为 `FlowResultType.ABORT`，则结果应如下所示：

```python
{
    # 流程的结果类型
    "type": FlowResultType.ABORT,
    # 流程的 ID
    "flow_id": "abcdfgh1234",
    # 处理器名称
    "handler": "hue",
    # 中止原因
    "reason": "已配置",
}
```

## 流程处理器

流程处理器将处理单个流程。一个流程包含一个或多个步骤。当实例化一个流程时，将调用 `FlowHandler.init_step` 步骤。每个步骤有几种可能的结果：

- [显示表单](#show-form)
- [创建条目](#create-entry)
- [中止](#abort)
- [外部步骤](#external-step--external-step-done)
- [显示进度](#show-progress--show-progress-done)
- [显示菜单](#show-menu)

至少每个流程处理器必须定义一个版本号和一个步骤。这不必是 `init`，因为 `async_create_flow` 可以根据当前工作流分配 `init_step`，例如在配置中，`context.source` 将用作 `init_step`。

例如，最简单的配置流程将是：

```python
from homeassistant import data_entry_flow

@config_entries.HANDLERS.register(DOMAIN)
class ExampleConfigFlow(data_entry_flow.FlowHandler):

    # 它创建的条目的模式版本
    # 如果版本更改，Home Assistant 将调用您的 migrate 方法
    # （这尚未实现）
    VERSION = 1

    async def async_step_user(self, user_input=None):
        """处理用户步骤。"""
```

数据录入流程依赖于翻译以显示步骤中的文本。这取决于数据录入流程管理器的父级在何处存储。对于配置和选项流程，这在 `config` 和 `option` 下的 `strings.json` 中。

关于 `strings.json` 的更详细说明，请参见 [后端翻译](/docs/internationalization/core) 页面。

### 显示表单

此结果类型将向用户显示一个需要填写的表单。您需要定义当前步骤、数据的模式（使用一部分 voluptuous 和/或 [选择器](https://www.home-assistant.io/docs/blueprint/selectors/)）和可选的错误字典。

```python
from homeassistant.data_entry_flow import section
from homeassistant.helpers.selector import selector

class ExampleConfigFlow(data_entry_flow.FlowHandler):
    async def async_step_user(self, user_input=None):
        # 指定项目的显示顺序
        data_schema = {
            vol.Required("username"): str,
            vol.Required("password"): str,
            # 项目可以按可折叠部分分组
            vol.Required("ssl_options"): section(
                vol.Schema(
                    {
                        vol.Required("ssl", default=True): bool,
                        vol.Required("verify_ssl", default=True): bool,
                    }
                ),
                # 部分是否最初被折叠（默认 = False）
                {"collapsed": False},
            )
        }

        if self.show_advanced_options:
            data_schema[vol.Optional("allow_groups")] = selector({
                "select": {
                    "options": ["all", "light", "switch"],
                }
            })

        return self.async_show_form(step_id="init", data_schema=vol.Schema(data_schema))
```

#### 输入字段分组

如上例所示，输入字段可以在视觉上分组在部分中。

每个部分都有 [可翻译的名称和描述](#labels--descriptions)，并且还可以指定图标。

通过部分对输入字段进行分组会影响输入对用户的显示方式以及用户输入的结构。
在上面的示例中，用户输入的结构如下：

```python
{
    "username": "user",
    "password": "hunter2",
    "ssl_options": {
        "ssl": True,
        "verify_ssl": False,
    },
}
```

只允许一个级别的部分；在部分内部不能有部分。

要为部分指定图标，请根据以下示例更新 `icons.json`：

```json
{
  "config": {
    "step": {
      "user": {
        "sections": {
          "ssl_options": "mdi:lock"
        }
      }
    }
  }
}
```

#### 标签和描述

表单的翻译添加到 `strings.json` 中，键为 `step_id`。该对象可能包含以下键：

|        键         |       值         | 注释                                                                                                                                          |
| :----------------: | :-----------------: | :------------------------------------------------------------------------------------------------------------------------------------------- |
|      `title`       |    表单标题        | 不要包含您的品牌名称。它将从您的清单中自动注入。                                                                                          |
|   `description`    | 表单说明          | 可选。不要链接到文档，因为那是自动链接的。不要包含“基础”信息，如“在这里您可以设置 X”。                                                     |
|       `data`       |    字段标签        | 保持简洁，并与其他集成保持一致，以获得最佳用户体验。                                                                                         |
| `data_description` | 字段描述          | 可选的解释性文本，显示在字段下方。                                                                                                           |
|     `section`      | 部分翻译          | 部分的翻译，每个部分可以具有 `name` 和 `description`，及其字段的 `data` 和 `data_description`。                                           |

有关翻译数据输入流程的更多详细信息，请参见 [核心翻译文档](/docs/internationalization/core)。

字段标签和描述以字典形式提供，键对应于您的模式。以下是一个简单的示例：

```json
{
  "config": {
    "step": {
      "user": {
          "title": "添加组",
          "description": "一些描述",
          "data": {
              "entities": "实体"
          },
          "data_description": {
              "entities": "要添加到组中的实体"
          },
          "sections": {
              "additional_options": {
                  "name": "其他选项",
                  "description": "部分的描述",
                  "data": {
                      "advanced_group_option": "高级组选项"
                  },
                  "data_description": {
                      "advanced_group_option": "一个非常复杂的选项，它做 abc"
                  },
              }
          }
      }
    }
  }
}
```

#### 启用浏览器自动填充

假设你的集成正在收集可以由浏览器或密码管理器自动填充的表单数据，例如登录凭据或联系人信息。您应尽可能启用自动填充，以获得最佳用户体验和可访问性。启用自动填充有两种选项。

第一种选择是使用 Voluptuous 和前端识别的数据键。前端将识别键 `"username"` 和 `"password"`，并分别添加 HTML `autocomplete` 属性值 `"username"` 和 `"current-password"`。对自动填充的支持仅限于 `"username"` 和 `"password"` 字段，并且主要是为了快速启用许多收集它们的集成的自动填充，而不将它们的模式转换为选择器。

第二种选择是使用 [文本选择器](https://www.home-assistant.io/docs/blueprint/selectors/#text-selector)。文本选择器可以完全控制输入类型，并允许指定任何允许的 `autocomplete` 值。一个假设的模式收集特定的可填充数据可能是：

```python
import voluptuous as vol
from homeassistant.const import CONF_PASSWORD, CONF_USERNAME
from homeassistant.helpers.selector import (
    TextSelector,
    TextSelectorConfig,
    TextSelectorType,
)

STEP_USER_DATA_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_USERNAME): TextSelector(
            TextSelectorConfig(type=TextSelectorType.EMAIL, autocomplete="username")
        ),
        vol.Required(CONF_PASSWORD): TextSelector(
            TextSelectorConfig(
                type=TextSelectorType.PASSWORD, autocomplete="current-password"
            )
        ),
        vol.Required("postal_code"): TextSelector(
            TextSelectorConfig(type=TextSelectorType.TEXT, autocomplete="postal-code")
        ),
        vol.Required("mobile_number"): TextSelector(
            TextSelectorConfig(type=TextSelectorType.TEL, autocomplete="tel")
        ),
    }
)
```

#### 默认值和建议

如果您希望在表单中预填充数据，您有两个选项。第一个是使用 `default` 参数。这将预填充字段，并在用户将字段留空时作为默认值。

```python
    data_schema = {
        vol.Optional("field_name", default="default value"): str,
    }
```

另一个选择是使用建议值——这也将预填充表单字段，但允许用户在愿望的情况下将其留空。

```python
    data_schema = {
        vol.Optional(
            "field_name", description={"suggested_value": "suggested value"}
        ): str,
    }
```

您还可以混合搭配——通过 `suggested_value` 进行预填充，并在字段留空的情况下使用不同的 `default` 值，但这可能会使用户困惑，因此请谨慎使用。

使用建议值还可以声明一个静态模式，并合并来自现有输入的建议值。一个 `add_suggested_values_to_schema` 辅助函数使此变得可能：

```python
OPTIONS_SCHEMA = vol.Schema(
    {
        vol.Optional("field_name", default="default value"): str,
    }
)

class ExampleOptionsFlow(config_entries.OptionsFlow):
    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        return self.async_show_form(
            data_schema = self.add_suggested_values_to_schema(
                OPTIONS_SCHEMA, self.entry.options
            )
        )
```

#### 显示只读信息

一些集成具有在初始配置后被冻结的选项。在显示选项流程时，您可以以只读方式显示此信息，以便用户可以记住在初始配置期间选择了哪些选项。为此，像往常一样定义一个可选选择器，但将 `read_only` 标志设置为 `True`。

```python
# 示例配置流程模式
DATA_SCHEMA_SETUP = vol.Schema(
    {
        vol.Required(CONF_ENTITY_ID): EntitySelector()
    }
)

# 示例选项流程模式
DATA_SCHEMA_OPTIONS = vol.Schema(
    {
        vol.Optional(CONF_ENTITY_ID): EntitySelector(
            EntitySelectorConfig(read_only=True)
        ),
        vol.Optional(CONF_TEMPLATE): TemplateSelector(),
    }
)
```

这将在每次启动选项流程时显示在初始配置中选择的实体作为只读属性。

#### 验证

在用户填写表单后，将再次调用步骤方法，并传入用户输入。只有当用户输入通过您的数据模式时，您的步骤才会被调用。当用户输入数据时，您将需要对数据进行额外验证。例如，您可以验证传入的用户名和密码是否有效。

如果有问题，您可以返回一个包含错误的字典。错误字典中的每个键都引用一个包含错误的字段名。如果您想显示与特定字段无关的错误，请使用键 `base`。指定的错误需要引用翻译文件中的一个键。

```python
class ExampleConfigFlow(data_entry_flow.FlowHandler):
    async def async_step_user(self, user_input=None):
        errors = {}
        if user_input is not None:
            # 验证用户输入
            valid = await is_valid(user_input)
            if valid:
                # 请参见下一个部分关于创建条目的使用
                return self.async_create_entry(...)

            errors["base"] = "auth_error"

        # 指定项目的显示顺序
        data_schema = {
            vol.Required("username"): str,
            vol.Required("password"): str,
        }

        return self.async_show_form(
            step_id="init", data_schema=vol.Schema(data_schema), errors=errors
        )
```

#### 多步骤流程

如果用户输入通过验证，您可以再次返回可能的步骤类型之一。如果要引导用户到下一步骤，请返回该步骤的返回值：

```python
class ExampleConfigFlow(data_entry_flow.FlowHandler):
    async def async_step_init(self, user_input=None):
        errors = {}
        if user_input is not None:
            # 验证用户输入
            valid = await is_valid(user_input)
            if valid:
                # 存储信息以便在下一步骤中使用
                self.init_info = user_input
                # 返回下一步骤的表单
                return await self.async_step_account()

        ...
```

### 创建条目

当结果为 "创建条目" 时，将创建一个条目并传递给流程管理器的父级。向用户显示成功消息，并且流程完成。通过传递标题、数据和可选选项来创建条目。标题可以在 UI 中用于向用户指示这是哪个条目。数据和选项可以是任何数据类型，只要它们是 JSON 可序列化的。选项用于可变数据，例如半径。而数据用于不可变数据，例如位置信息，它不会在条目中改变。

```python
class ExampleConfigFlow(data_entry_flow.FlowHandler):
    async def async_step_user(self, user_input=None):
        return self.async_create_entry(
            title="条目的标题",
            data={
                "username": user_input["username"],
                "password": user_input["password"]
            },
            options={
                "mobile_number": user_input["mobile_number"]
            },
        )
```

注意：用户可以更改他们的密码，这在技术上使其成为可变数据，但是对于更改身份验证凭据，您使用 [重新认证](/docs/config_entries_config_flow_handler#reauthentication)，这可以改变配置条目的数据。

### 中止

当流程无法完成时，您需要中止它。这将结束流程并通知用户流程已结束。流程无法完成的原因可能是设备已被配置或与 Home Assistant 不兼容。

```python
class ExampleConfigFlow(data_entry_flow.FlowHandler):
    async def async_step_user(self, user_input=None):
        return self.async_abort(reason="不支持")
```

### 外部步骤及外部步骤完成

用户可能需要通过在外部网站上执行操作来完成配置流程。例如，通过重定向到外部网页来设置集成。这通常用于使用 OAuth2 授权用户的集成。

_该示例涉及配置条目，但对使用数据输入流程的其他部分也适用。_

流程的工作原理如下：

1. 用户在 Home Assistant 中启动配置流程。
2. 配置流程提示用户在外部网站上完成流程。
3. 用户打开外部网站。
4. 完成外部步骤后，用户的浏览器将被重定向到 Home Assistant 端点以传递响应。
5. 端点验证响应，并在验证后将外部步骤标记为完成并返回 JavaScript 代码以关闭窗口：`<script>window.close()</script>`。

为了能够将外部步骤的结果路由到 Home Assistant 端点，您需要确保包含配置流程 ID。如果您的外部步骤是 OAuth2 流程，您可以利用 oauth2 状态。这是一个不被授权页面解析的变量，而是以原样传递给 Home Assistant 端点。

6. 窗口关闭，再次可见配置流程的 Home Assistant 用户界面。
7. 当外部步骤被标记为完成时，配置流程会自动推进到下一步骤。用户会被提示下一步骤。

包含外部步骤的示例配置流程。

```python
from homeassistant import config_entries

@config_entries.HANDLERS.register(DOMAIN)
class ExampleConfigFlow(data_entry_flow.FlowHandler):
    VERSION = 1
    data = None

    async def async_step_user(self, user_input=None):
        if not user_input:
            return self.async_external_step(
                step_id="user",
                url=f"https://example.com/?config_flow_id={self.flow_id}",
            )

        self.data = user_input
        return self.async_external_step_done(next_step_id="finish")

    async def async_step_finish(self, user_input=None):
        return self.async_create_entry(title=self.data["title"], data=self.data)
```

避免在返回 `async_mark_external_step_done` 之前基于外部步骤数据进行工作。相反，在您标记外部步骤完成时，在您所引用的步骤中执行工作。这将为用户提供更好的用户体验，显示 UI 中的加载指示器。

如果您在授权回调内部执行工作，用户将盯着一个空白屏幕，直到数据转发而突然关闭。如果您在标记外部步骤完成之前执行工作，用户将仍然看到具有“打开外部网站”按钮的表单，而后台工作正在进行。这也是不理想的。

标记外部步骤完成的示例代码：

```python
from homeassistant import data_entry_flow


async def handle_result(hass, flow_id, data):
    result = await hass.config_entries.async_configure(flow_id, data)

    if result["type"] == data_entry_flow.FlowResultType.EXTERNAL_STEP_DONE:
        return "成功！"
    else:
        return "指定的配置流程无效"
```

### 显示进度和显示进度完成

如果数据输入流程步骤需要相当长的时间才能完成，我们应该告知用户这一点。

_该示例涉及配置条目，但对使用数据输入流程的其他部分也适用。_

流程的工作原理如下：

1. 用户在 Home Assistant 中启动配置流程。
2. 配置流程创建一个 `asyncio.Task` 来执行长期运行的任务。
3. 配置流程通过调用 `async_show_progress` 告知用户任务正在进行并需要一些时间来完成，同时传递 `asyncio.Task` 对象。流程应该传递一个特定于任务的字符串作为 `progress_action` 参数，以代表翻译的提示文本字符串。
4. 任务完成后，配置流程将自动被调用，但也可以在任务完成之前被调用，例如如果前端重新加载。
  * 如果任务尚未完成，则流程不应创建另一个任务，而是应再次调用 `async_show_progress`。
  * 如果任务已完成，流程必须调用 `async_show_progress_done`，指示下一个步骤。
5. 每次我们调用显示进度或显示进度完成时，前端将更新。
6. 当进度标记为完成时，配置流程将自动推进到下一步骤。用户会被提示下一步骤。
7. 任务可以选择性地调用 `async_update_progress(progress)`，其中 progress 是介于 0 和 1 之间的浮动值，表示任务完成的程度。

包含两个顺序显示进度任务的示例配置流程。

```python
import asyncio

from homeassistant import config_entries
from .const import DOMAIN

class TestFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1
    task_one: asyncio.Task | None = None
    task_two: asyncio.Task | None = None

    async def async_step_user(self, user_input=None):
        uncompleted_task: asyncio.Task[None] | None = None

        if not self.task_one:
            coro = asyncio.sleep(10)
            self.task_one = self.hass.async_create_task(coro)
        if not self.task_one.done():
            progress_action = "task_one"
            uncompleted_task = self.task_one
        if not uncompleted_task:
            if not self.task_two:
                self.async_update_progress(0.5) # 告诉前端我们完成了 50%
                coro = asyncio.sleep(10)
                self.task_two = self.hass.async_create_task(coro)
            if not self.task_two.done():
                progress_action = "task_two"
                uncompleted_task = self.task_two
        if uncompleted_task:
            return self.async_show_progress(
                progress_action=progress_action,
                progress_task=uncompleted_task,
            )

        return self.async_show_progress_done(next_step_id="finish")

    async def async_step_finish(self, user_input=None):
        if not user_input:
            return self.async_show_form(step_id="finish")
        return self.async_create_entry(title="某个标题", data={})
```

### 显示菜单

这将向用户显示一个导航菜单，以便轻松选择下一步骤。菜单标签可以通过指定 `{step_id: label}` 的字典进行硬编码，或通过指定一个列表在 `strings.json` 中进行翻译。

```python
class ExampleConfigFlow(data_entry_flow.FlowHandler):
    async def async_step_user(self, user_input=None):
        return self.async_show_menu(
            step_id="user",
            menu_options=["discovery", "manual"],
            description_placeholders={
                "model": "示例模型",
            }
        )
        # 示例显示了另一种方法
        return self.async_show_menu(
            step_id="user",
            menu_options={
                "option_1": "选项 1",
                "option_2": "选项 2",
            }
        )
```

```json
{
  "config": {
    "step": {
      "user": {
        "menu_options": {
          "discovery": "发现",
          "manual": "手动 ({model})",
        }
      }
    }
  }
}
```

## 从外部源初始化配置流程

您可能希望以编程方式初始化配置流程。例如，如果我们在网络上发现一个需要用户交互才能完成设置的设备。为此，在初始化流程时传递一个源参数和可选的用户输入：

```python
await flow_mgr.async_init(
    "hue", context={"source": data_entry_flow.SOURCE_DISCOVERY}, data=discovery_info
)
```

配置流程处理程序不会从 `init` 步骤开始。相反，它将被实例化为一个步骤名称，等于源。该步骤的返回值应遵循与正常步骤相同的格式。

```python
class ExampleConfigFlow(data_entry_flow.FlowHandler):
    async def async_step_discovery(self, info):
        """处理发现信息。"""
```

配置流程的来源可通过 `FlowHandler` 上的 `self.source` 获取。