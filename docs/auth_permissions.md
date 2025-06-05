---
title: "权限"
---

:::info
这是一个实验性功能，尚未启用或强制执行。
:::

权限限制了用户可以访问或控制的内容。权限附加在组上，用户可以是这些组的成员。所有用户成为成员的组的综合权限决定了用户可以看到或控制什么。

权限不适用于被标记为“所有者”的用户。该用户将始终可以访问所有内容。

## 一般权限结构

策略是字典，在根级别由不同类别的权限组成。在当前的实现中，这仅限于实体。

```python
{
    "entities": {
        # …
    }
}
```

每个类别可以进一步拆分为描述该类别的子类别。

```python
{
    "entities": {
        "domains": {
            # …
        },
        "entity_ids": {
            # …
        },
    }
}
```

如果省略某个类别，用户将没有该类别的权限。

定义策略时，任何字典值在任何位置都可以替换为 `True` 或 `None`。`True` 表示权限被授予，`None` 表示使用默认值，即拒绝访问。

## 实体

实体权限可以根据每个实体和每个域使用子类别 `entity_ids`、`device_ids`、`area_ids` 和 `domains` 进行设置。您可以通过将值设置为 `True` 来授予所有访问权限，或者可以使用“读取”、“控制”、“编辑”权限逐个指定每个实体。

系统将根据顺序 `entity_ids`、`device_ids`、`area_ids`、`domains`、`all` 返回第一个匹配的结果。

```json
{
  "entities": {
    "domains": {
      "switch": true
    },
    "entity_ids": {
      "light.kitchen": {
        "read": true,
        "control": true
      }
    }
  }
}
```

## 合并策略

如果用户是多个组的成员，组的权限策略将在运行时合并为一个单一的策略。在合并策略时，我们将查看字典的每个级别，并使用以下方法比较每个来源的值：

1. 如果任一值为 `True`，合并值变为 `True`。
2. 如果任一值是字典，则合并值变为通过递归检查每个值使用这种方法创建的字典。
3. 如果所有值都是 `None`，则合并值变为 `None`。

让我们看一个例子：

```python
{
    "entities": {
        "entity_ids": {
            "light.kitchen": True
        }
    }
}
```

```python
{
    "entities": {
        "entity_ids": True
    }
}
```

合并后变为

```python
{
    "entities": {
        "entity_ids": True
    }
}
```

## 检查权限

我们目前有两种不同的权限检查：用户是否可以对实体执行读取/控制/编辑操作，以及用户是否为管理员，因此被允许更改此配置设置。

某些API将始终对所有用户可用，但可能会根据权限提供有限的范围，例如呈现模板。

### 检查权限

要检查权限，您需要访问用户对象。获得用户对象后，检查权限就很简单。

```python
from homeassistant.exceptions import Unauthorized
from homeassistant.permissions.const import POLICY_READ, POLICY_CONTROL, POLICY_EDIT

# 如果用户不是管理员，则引发错误
if not user.is_admin:
    raise Unauthorized()


# 如果用户没有控制实体的权限，则引发错误
# 可用策略：POLICY_READ, POLICY_CONTROL, POLICY_EDIT
if not user.permissions.check_entity(entity_id, POLICY_CONTROL):
    raise Unauthorized()
```

### 上下文对象

Home Assistant中的所有服务操作、触发的事件和状态都有一个上下文对象。这个对象使我们能够将更改归因于事件和动作。这些上下文对象还包含用户ID，用于检查权限。

对权限检查至关重要的是，通过代表用户采取的操作必须使用包含用户ID的上下文。如果您在服务操作处理程序中，应该重用传入的上下文 `call.context`。如果您在WebSocket API或Rest API端点内部，应该创建一个包含正确用户的上下文：

```python
from homeassistant.core import Context

await hass.services.async_call(
    "homeassistant", "stop", context=Context(user_id=user.id), blocking=True
)
```

### 如果权限检查失败

当您检测到未经授权的操作时，应引发 `homeassistant.exceptions.Unauthorized` 异常。此异常将取消当前操作，并通知用户他们的操作未被授权。

`Unauthorized` 异常具有各种参数，以识别失败的权限检查。所有字段都是可选的。

| # 并非所有操作都有ID（如添加配置条目） |
| # 我们使用此后备机制来了解未授权的类别 |

| 参数 | 描述
| --------- | -----------
| context | 当前调用的上下文。
| user_id | 我们试图操作的用户ID。
| entity_id | 我们试图操作的实体ID。
| config_entry_id | 我们试图操作的配置条目ID。
| perm_category | 我们测试的权限类别。如果我们没有对象ID，用户试图操作的情况下（例如创建配置条目时），此项是必要的。
| permission | 我们测试的权限，即 `POLICY_READ`。

### 保护服务操作处理程序

操作允许用户控制实体或整个集成。服务操作使用附加的上下文来查看哪个用户调用了命令。由于使用了上下文，因此重要的是您还需要将调用上下文传递给所有服务操作。

通过实体组件注册的所有服务操作（`component.async_register_entity_service()`）将自动检查其权限。

#### 检查实体权限

您的服务操作处理程序需要检查每个将要操作的实体的权限。

```python
from homeassistant.exceptions import Unauthorized, UnknownUser
from homeassistant.auth.permissions.const import POLICY_CONTROL


async def handle_entity_service(call):
    """处理服务操作调用。"""
    entity_ids = call.data["entity_id"]

    for entity_id in entity_ids:
        if call.context.user_id:
            user = await hass.auth.async_get_user(call.context.user_id)

            if user is None:
                raise UnknownUser(
                    context=call.context,
                    entity_id=entity_id,
                    permission=POLICY_CONTROL,
                )

            if not user.permissions.check_entity(entity_id, POLICY_CONTROL):
                raise Unauthorized(
                    context=call.context,
                    entity_id=entity_id,
                    permission=POLICY_CONTROL,
                )

        # 对实体执行操作


async def async_setup(hass, config):
    hass.services.async_register(DOMAIN, "my_service", handle_entity_service)
    return True
```

#### 检查管理员权限

从Home Assistant 0.90开始，有一个特殊的装饰器可以帮助保护需要管理员访问权限的服务操作。

```python
# Home Assistant 0.90中的新特性
async def handle_admin_service(call):
    """处理服务操作调用。"""
    # 执行管理员操作


async def async_setup(hass, config):
    hass.helpers.service.async_register_admin_service(
        DOMAIN, "my_service", handle_admin_service, vol.Schema({})
    )
    return True
```

### 保护REST API端点

```python
from homeassistant.core import Context
from homeassistant.components.http.view import HomeAssistantView
from homeassistant.exceptions import Unauthorized


class MyView(HomeAssistantView):
    """处理状态请求的视图。"""

    url = "/api/my-component/my-api"
    name = "api:my-component:my-api"

    async def post(self, request):
        """通知API正在运行。"""
        hass = request.app["hass"]
        user = request["hass_user"]

        if not user.is_admin:
            raise Unauthorized()

        hass.bus.async_fire(
            "my-component-api-running", context=Context(user_id=user.id)
        )

        return self.json_message("完成。")
```

### 保护Websocket API端点

在Websocket API端点中验证权限可以通过访问 `connection.user` 来完成。如果您需要检查管理员访问权限，可以使用内置的 `@require_admin` 装饰器。

```python
from homeassistant.components import websocket_api


async def async_setup(hass, config):
    websocket_api.async_register_command(hass, websocket_create)
    return True


@websocket_api.require_admin
@websocket_api.async_response
@websocket_api.websocket_command(
    {vol.Required("type"): "my-component/my-action",}
)
async def websocket_create(hass, connection, msg):
    """创建一个用户。"""
    # 执行操作