---
title: "传感器"
---

`mobile_app` 集成支持暴露可以完全通过您的应用程序管理的自定义传感器。

## 注册传感器

所有传感器必须在更新之前注册。您一次只能注册一个传感器，这与更新传感器不同。

要注册传感器，请像这样向 webhook 发出请求：

```json
{
  "data": {
    "attributes": {
      "foo": "bar"
    },
    "device_class": "battery",
    "icon": "mdi:battery",
    "name": "电池状态",
    "state": "12345",
    "type": "sensor",
    "unique_id": "battery_state",
    "unit_of_measurement": "%",
    "state_class": "measurement",
    "entity_category": "diagnostic",
    "disabled": true
  },
  "type": "register_sensor"
}
```

有效的键包括：

| 键                   | 类型                          | 是否必需 | 描述                                                                                                                                                     |
|---------------------|-------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| attributes          | object                        | 否       | 附加到传感器的属性                                                                                                                                      |
| device_class        | string                        | 否       | 有效设备类别之一。 [二进制传感器类](https://www.home-assistant.io/integrations/binary_sensor/#device-class)，[传感器类](https://www.home-assistant.io/integrations/sensor/#device-class) |
| icon                | Material Design Icon (字符串) | 否       | 必须以 `mdi:` 为前缀。如果未提供，默认值为 `mdi:cellphone`                                                                                                                                  |
| name                | string                        | 是       | 传感器的名称                                                                                                                                              |
| state               | bool, float, int, string      | 是       | 传感器的状态                                                                                                                                              |
| type                | string                        | 是       | 传感器的类型。必须是 `binary_sensor` 或 `sensor` 之一                                                                                                                                              |
| unique_id           | string                        | 是       | 对于您的应用程序的此安装唯一的标识符。您稍后需要此标识符。通常最好使用安全版本的传感器名称                                                                          |
| unit_of_measurement | string                        | 否       | 传感器的计量单位                                                                                                                                          |
| state_class         | string                        | 否       | 实体的 [状态类](../../core/entity/sensor.md#available-state-classes)（仅传感器）                                                                 |
| entity_category     | string                        | 否       | 实体的实体类别                                                                                                                                        |
| disabled            | boolean                       | 否       | 实体是否应该启用或禁用。                                                                                                                                 |

传感器在注册后会立即出现。

## 更新传感器

一旦注册了传感器，您需要更新它。这与注册非常相似，但您可以同时更新所有传感器。

例如，要更新我们上面注册的传感器，您可以发送以下内容：

```json
{
  "data": [
    {
      "attributes": {
        "hello": "world"
      },
      "icon": "mdi:battery",
      "state": 123,
      "type": "sensor",
      "unique_id": "battery_state"
    }
  ],
  "type": "update_sensor_states"
}
```

在更新过程中仅允许某些键：

| 键                   | 类型                          | 是否必需 | 描述                                                                                                                                      |
|---------------------|-------------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------|
| attributes          | object                        | 否       | 附加到传感器的属性                                                                                                                                                                  |
| icon                | Material Design Icon (字符串) | 否       | 必须以 `mdi:` 为前缀                                                                                                                                                                   |
| state               | bool, float, int, string      | 是       | 传感器的状态                                                                                                                                                                       |
| type                | string                        | 是       | 传感器的类型。必须是 `binary_sensor` 或 `sensor` 之一                                                                                                                              |
| unique_id           | string                        | 是       | 对于您的应用程序的此安装唯一的标识符。您稍后需要此标识符。通常最好使用安全版本的传感器名称                                                                                                                                   |

更新传感器的响应是一个字典，包含 unique_id => 更新结果。

如果实体在 Home Assistant 中被禁用，则成功更新时将添加键 `is_disabled`。这意味着应用程序可以禁用向传感器发送更新。

如果更新不成功，则返回错误。

```json
{
  "battery_state": {
    "success": true
  },
  "battery_level": {
    "success": true,
    "is_disabled": true
  },
  "battery_charging": {
    "success": false,
    "error": {
      "code": "not_registered",
      "message": "实体未注册",
    }
  },
  "battery_charging_state": {
    "success": false,
    "error": {
      "code": "invalid_format",
      "message": "类型的意外值",
    }
  }
}
```

## 保持传感器与 Home Assistant 同步

用户可以在 Home Assistant 中启用和禁用实体。禁用的实体将不会被添加到 Home Assistant，即使集成提供了它。这意味着手机发送数据到在 Home Assistant 中未启用的实体将没有意义。

**当传感器在应用程序中启用/禁用时**，应用程序应该发送 `register_sensor` webhook 以此传感器，并将 `disabled` 设置为 `true` 或 `false`。

**当移动应用程序发送 `update_sensor_states` webhook 更新已禁用实体的数据时**，更新结果将包含 `is_disabled` 键，其值为 `true`。这是移动应用程序需要从 Home Assistant 同步启用状态到移动应用程序的指示器。

```json
{
  "battery_level": {
    "success": true
  },
  "battery_charging": {
    "success": true,
    "is_disabled": true
  }
}
```

**当用户在 Home Assistant 中启用/禁用实体时，必须将其同步到移动应用程序。** `get_config` webhook 响应包含 `entities` 键。它是一个字典，将 `unique_id` 映射到 `{"disabled": boolean}`。移动应用程序应采用这些启用设置。

```json5
{
  // ...
  "entities": {
    "battery_level": {
      "disabled": false
    },
    "battery_charging": {
      "disabled": true
    }
  }
}