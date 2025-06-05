---
title: "身份验证提供者"
---

身份验证提供者确认用户的身份。用户通过经过身份验证提供者的登录流程来证明自己的身份。身份验证提供者定义了登录流程，并可以要求用户提供其所需的所有信息。这通常是用户名和密码，但也可能包括两步验证令牌或其他挑战。

一旦身份验证提供者确认了用户的身份，它将以凭据对象的形式将其传递给 Home Assistant。

## 定义身份验证提供者

:::info
我们目前只支持内置的身份验证提供者。未来可能会支持自定义身份验证提供者。
:::

身份验证提供者在 `homeassistant/auth/providers/<provider名称>.py` 中定义。身份验证提供者模块需要提供 `AuthProvider` 类和 `LoginFlow` 类的实现，后者用于向用户询问信息并根据 `data_entry_flow` 验证信息。

有关完整实现的身份验证提供者的示例，请参见 [insecure_example.py](https://github.com/home-assistant/core/blob/dev/homeassistant/auth/providers/insecure_example.py)。

身份验证提供者应扩展 `AuthProvider` 类的以下方法。

| 方法 | 必需 | 描述 |
| ------ | -------- | ----------- |
| async def async_login_flow(self) | 是 | 返回一个实例，使用户可以进行身份识别的登录流程。 |
| async def async_get_or_create_credentials(self, flow_result) | 是 | 根据登录流程的结果，返回一个凭据对象。这可以是一个现有的凭据或一个新的凭据。 |
| async def async_user_meta_for_credentials(credentials) | 否 | 回调，当 Home Assistant 将从凭据对象创建用户时被调用。可用于填充用户的额外字段。 |

身份验证提供者应扩展 `LoginFlow` 类的以下方法。

| 方法 | 必需 | 描述 |
| ------ | -------- | ----------- |
| async def async_step_init(self, user_input=None) | 是 | 处理登录表单，更多细节见下文。 |

## LoginFlow 的 async_step_init

:::info
我们可能会在不久的将来更改此接口。
:::

`LoginFlow` 继承自 `data_entry_flow.FlowHandler`。数据输入流程的第一步被硬编码为 `init`，因此每个流程都必须实现 `async_step_init` 方法。`async_step_init` 的模式类似于以下伪代码：

```python
async def async_step_init(self, user_input=None):
    if user_input is None:
        return self.async_show_form(
            step_id="init", data_schema="构造 UI 表单的一些模式"
        )
    if is_invalid(user_input):
        return self.async_show_form(step_id="init", errors=errors)
    return await self.async_finish(user_input)