---
title: "WebSocket API"
---

Home Assistant 在 `/api/websocket` 处托管一个 WebSocket API。这个 API 可以用来将信息从 Home Assistant 实例流式传输到任何实现 WebSockets 的客户端。我们维护一个 [JavaScript 库](https://github.com/home-assistant/home-assistant-js-websocket)，我们在我们的前端中使用。

## 服务器状态

1. 客户端连接。
1. 认证阶段开始。
    - 服务器发送 `auth_required` 消息。
    - 客户端发送 `auth` 消息。
    - 如果 `auth` 消息正确：进入第 3 步。
    - 服务器发送 `auth_invalid`。进入第 6 步。
1. 发送 `auth_ok` 消息
1. 认证阶段结束。
1. 命令阶段开始。
    1. 客户端可以发送命令。
    1. 服务器可以发送先前命令的结果。
1. 客户端或服务器断开会话。

在命令阶段，客户端会为每条消息附加一个唯一标识符。服务器将把这个标识符添加到每条消息中，以便客户端可以将每条消息与其来源关联起来。

## 消息格式

每个 API 消息都是一个包含 `type` 键的 JSON 序列化对象。在认证阶段之后，消息还必须包含一个 `id`，这是一个整数，调用者可以用它来关联消息和响应。

认证消息示例：

```json
{
  "type": "auth",
  "access_token": "ABCDEFGHIJKLMNOPQ"
}
```

```json
{
   "id": 5,
   "type":"event",
   "event":{
      "data":{},
      "event_type":"test_event",
      "time_fired":"2016-11-26T01:37:24.265429+00:00",
      "origin":"LOCAL"
   }
}
```

## 认证阶段

当客户端连接到服务器时，服务器会发送 `auth_required`。

```json
{
  "type": "auth_required",
  "ha_version": "2021.5.3"
}
```

客户端的第一条消息应该是认证消息。您可以使用访问令牌进行身份验证。

```json
{
  "type": "auth",
  "access_token": "ABCDEFGH"
}
```

如果客户端提供了有效的身份验证，认证阶段将通过服务器发送 `auth_ok` 消息而完成：

```json
{
  "type": "auth_ok",
  "ha_version": "2021.5.3"
}
```

如果数据不正确，服务器将回复 `auth_invalid` 消息并断开会话。

```json
{
  "type": "auth_invalid",
  "message": "无效的密码"
}
```

## 功能启用阶段

支持需要启用的功能的客户端应在其第一条消息中（`"id": 1`）发送以下格式的消息：

```
{
  "id": 1,
  "type": "supported_features",
  "features": { coalesce_messages: 1 }
}
```

截至目前，唯一支持的功能是 'coalesce_messages'，它会导致消息以批量的方式而非单独发送。

## 命令阶段

在此阶段，客户端可以向服务器发出命令。服务器将对每个命令响应一条 `result` 消息，指示命令何时完成，以及是否成功，以及命令的上下文。

```json
{
  "id": 6,
  "type": "result",
  "success": true,
  "result": {
    "context": {
      "id": "326ef27d19415c60c492fe330945f954",
      "parent_id": null,
      "user_id": "31ddb597e03147118cf8d2f8fbea5553"
    }
  }
}
```

## 订阅事件

命令 `subscribe_events` 将使您的客户端订阅事件总线。您可以监听所有事件或特定事件类型。如果您希望监听多个事件类型，则必须发送多个 `subscribe_events` 命令。

```json
{
  "id": 18,
  "type": "subscribe_events",
  // 可选
  "event_type": "state_changed"
}
```

服务器将通过结果消息响应，以指示订阅处于活动状态。

```json
{
  "id": 18,
  "type": "result",
  "success": true,
  "result": null
}
```

对于每个匹配的事件，服务器将发送一条类型为 `event` 的消息。消息中的 `id` 将指向原始 `listen_event` 命令的 `id`。

```json
{
   "id": 18,
   "type":"event",
   "event":{
      "data":{
         "entity_id":"light.bed_light",
         "new_state":{
            "entity_id":"light.bed_light",
            "last_changed":"2016-11-26T01:37:24.265390+00:00",
            "state":"on",
            "attributes":{
               "rgb_color":[
                  254,
                  208,
                  0
               ],
               "color_temp":380,
               "supported_features":147,
               "xy_color":[
                  0.5,
                  0.5
               ],
               "brightness":180,
               "white_value":200,
               "friendly_name":"床灯"
            },
            "last_updated":"2016-11-26T01:37:24.265390+00:00",
            "context": {
               "id": "326ef27d19415c60c492fe330945f954",
               "parent_id": null,
               "user_id": "31ddb597e03147118cf8d2f8fbea5553"
            }
         },
         "old_state":{
            "entity_id":"light.bed_light",
            "last_changed":"2016-11-26T01:37:10.466994+00:00",
            "state":"off",
            "attributes":{
               "supported_features":147,
               "friendly_name":"床灯"
            },
            "last_updated":"2016-11-26T01:37:10.466994+00:00",
            "context": {
               "id": "e4af5b117137425e97658041a0538441",
               "parent_id": null,
               "user_id": "31ddb597e03147118cf8d2f8fbea5553"
            }
         }
      },
      "event_type":"state_changed",
      "time_fired":"2016-11-26T01:37:24.265429+00:00",
      "origin":"LOCAL",
      "context": {
         "id": "326ef27d19415c60c492fe330945f954",
         "parent_id": null,
         "user_id": "31ddb597e03147118cf8d2f8fbea5553"
      }
   }
}
```

## 订阅触发器

您还可以使用 `subscribe_trigger` 订阅一个或多个触发器。这些触发器的语法与用于 [自动化触发器](https://www.home-assistant.io/docs/automation/trigger/) 的相同。您可以定义一个或多个触发器。

```json
{
    "id": 2,
    "type": "subscribe_trigger",
    "trigger": {
        "platform": "state",
        "entity_id": "binary_sensor.motion_occupancy",
        "from": "off",
        "to":"on"
    }
}
```

响应为：

```json
{
 "id": 2,
 "type": "result",
 "success": true,
 "result": null
}
```

对于每个匹配的触发器，服务器将发送一条类型为 `trigger` 的消息。消息中的 `id` 将指向原始 `subscribe_trigger` 命令的 `id`。请注意，您的变量将基于所使用的触发器而有所不同。

```json
{
    "id": 2,
    "type": "event",
    "event": {
        "variables": {
            "trigger": {
                "id": "0",
                "idx": "0",
                "platform": "state",
                "entity_id": "binary_sensor.motion_occupancy",
                "from_state": {
                    "entity_id": "binary_sensor.motion_occupancy",
                    "state": "off",
                    "attributes": {
                        "device_class": "motion",
                        "friendly_name": "运动占用传感器"
                    },
                    "last_changed": "2022-01-09T10:30:37.585143+00:00",
                    "last_updated": "2022-01-09T10:33:04.388104+00:00",
                    "context": {
                        "id": "90e30ad8e6d0c218840478d3c21dd754",
                        "parent_id": null,
                        "user_id": null
                    }
                },
                "to_state": {
                    "entity_id": "binary_sensor.motion_occupancy",
                    "state": "on",
                    "attributes": {
                        "device_class": "motion",
                        "friendly_name": "运动占用传感器"
                    },
                    "last_changed": "2022-01-09T10:33:04.391956+00:00",
                    "last_updated": "2022-01-09T10:33:04.391956+00:00",
                    "context": {
                        "id": "9b263f9e4e899819a0515a97f6ddfb47",
                        "parent_id": null,
                        "user_id": null
                    }
                },
                "for": null,
                "attribute": null,
                "description": "binary_sensor.motion_occupancy 的状态"
            }
        },
        "context": {
            "id": "9b263f9e4e899819a0515a97f6ddfb47",
            "parent_id": null,
            "user_id": null
        }
    }
}
```

### 取消事件订阅

您可以取消之前创建的订阅。将原始订阅命令的 id 作为值传给订阅字段。

```json
{
  "id": 19,
  "type": "unsubscribe_events",
  "subscription": 18
}
```

服务器将通过结果消息响应，以指示取消订阅成功。

```json
{
  "id": 19,
  "type": "result",
  "success": true,
  "result": null
}
```

## 触发事件

这将触发 Home Assistant 事件总线上的事件。

```json
{
  "id": 24,
  "type": "fire_event",
  "event_type": "mydomain_event",
  // 可选
  "event_data": {
    "device_id": "my-device-id",
    "type": "motion_detected"
  }
}
```

服务器将通过结果消息响应，以指示事件已成功触发。

```json
{
  "id": 24,
  "type": "result",
  "success": true,
  "result": {
    "context": {
      "id": "326ef27d19415c60c492fe330945f954",
      "parent_id": null,
      "user_id": "31ddb597e03147118cf8d2f8fbea5553"
    }
  }
}
```

## 调用服务操作

这将调用 Home Assistant 中的服务操作。目前没有返回值。如果客户端对调用结果中的状态变化感兴趣，可以监听 `state_changed` 事件。

```json
{
  "id": 24,
  "type": "call_service",
  "domain": "light",
  "service": "turn_on",
  // 可选
  "service_data": {
    "color_name": "beige",
    "brightness": "101"
  }
  // 可选
  "target": {
    "entity_id": "light.kitchen"
  }
  // 服务操作返回响应数据时必须包含
  "return_response": true
}
```

服务器将通过消息指示操作已完成执行。

```json
{
  "id": 24,
  "type": "result",
  "success": true,
  "result": {
    "context": {
      "id": "326ef27d19415c60c492fe330945f954",
      "parent_id": null,
      "user_id": "31ddb597e03147118cf8d2f8fbea5553"
    },
    "response": null
  }
}
```

调用的 `result` 将始终包含一个 `response`，以便处理支持响应的服务操作。当调用不支持响应的操作时，`response` 的值将为 `null`。

## 获取状态

这将获取 Home Assistant 中所有当前状态的快照。

```json
{
  "id": 19,
  "type": "get_states"
}
```

服务器将通过结果消息响应，包含状态信息。

```json
{
  "id": 19,
  "type": "result",
  "success": true,
  "result": [ ... ]
}
```

## 获取配置

这将获取 Home Assistant 中当前配置的快照。

```json
{
  "id": 19,
  "type": "get_config"
}
```

服务器将通过结果消息响应，包含配置。

```json
{
  "id": 19,
  "type": "result",
  "success": true,
  "result": { ... }
}
```

## 获取服务操作

这将获取 Home Assistant 中当前服务操作的快照。

```json
{
  "id": 19,
  "type": "get_services"
}
```

服务器将通过结果消息响应，包含服务操作。

```json
{
  "id": 19,
  "type": "result",
  "success": true,
  "result": { ... }
}
```

## 获取面板

这将获取 Home Assistant 中当前注册的面板的快照。

```json
{
  "id": 19,
  "type": "get_panels"
}
```

服务器将通过结果消息响应，包含当前注册的面板。

```json
{
  "id": 19,
  "type": "result",
  "success": true,
  "result": [ ... ]
}
```

## Ping 和 Pong

API 支持接收客户端的 ping 并返回 pong。这用作心跳，以确保连接仍然有效：

```json
{
    "id": 19,
    "type": "ping"
}
```

如果连接仍然有效，服务器必须尽快发送 pong 回来：

```json
{
    "id": 19,
    "type": "pong"
}
```

## 验证配置

此命令允许您验证触发器、条件和操作配置。`trigger`、`condition` 和 `action` 键将被验证，仿佛它们是自动化的一部分（因此也允许触发器/条件/操作的列表）。所有字段都是可选的，结果将仅包含传入的键。

```json
{
  "id": 19,
  "type": "validate_config",
  "trigger": ...,
  "condition": ...,
  "action": ...
}
```

服务器将响应验证结果。仅将被包含在命令消息中的字段包含在响应中。

```json
{
  "id": 19,
  "type": "result",
  "success": true,
  "result": {
    "trigger": {"valid": true, "error": null},
    "condition": {"valid": false, "error": "数据[0]指定的条件无效"},
    "action": {"valid": true, "error": null}
  }
}
```

## 错误处理

如果发生错误，`result` 消息中的 `success` 键将设置为 `false`。它将包含一个 `error` 键，包含一个对象，其中包含两个键：`code` 和 `message`。

```json
{
   "id": 12,
   "type":"result",
   "success": false,
   "error": {
      "code": "invalid_format",
      "message": "消息格式错误：预期字符串作为字典值 @ data['event_type']。得到 100"
   }
}
```

### 服务操作调用和翻译中的错误处理

下面的 JSON 显示了错误响应的示例。如果处理了 `HomeAssistantError` 错误（或其子类），则相应的翻译信息（如果设置）将被添加到响应中。

在处理 `ServiceValidationError`（`service_validation_error`）时，堆栈跟踪将仅在调试级别记录到日志中。

```json
{
   "id": 24,
   "type":"result",
   "success": false,
   "error": {
      "code": "service_validation_error",
      "message": "选项 'custom' 不是支持的模式。",
      "translation_key": "unsupported_mode",
      "translation_domain": "kitchen_sink",
      "translation_placeholders": {
        "mode": "custom"
      }
   }
}
```

[阅读更多](/docs/core/platform/raising_exceptions)关于引发异常或[异常的本地化](/docs/internationalization/core/#exceptions)。