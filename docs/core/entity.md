---
title: 实体
sidebar_label: 介绍
---

有关实体的一般介绍，请参阅 [实体架构](../architecture/devices-and-services.md)。

## 基本实现

以下是一个示例开关实体，它在内存中跟踪其状态。此外，示例中的开关代表设备的主要功能，这意味着该实体的名称与其设备相同。

有关如何给实体命名的信息，请参阅 [实体命名](#entity-naming)。

```python
from homeassistant.components.switch import SwitchEntity


class MySwitch(SwitchEntity):
    _attr_has_entity_name = True

    def __init__(self):
        self._is_on = False
        self._attr_device_info = ...  # 用于自动设备注册
        self._attr_unique_id = ...

    @property
    def is_on(self):
        """如果开关当前开启或关闭。"""
        return self._is_on

    def turn_on(self, **kwargs):
        """打开开关。"""
        self._is_on = True

    def turn_off(self, **kwargs):
        """关闭开关。"""
        self._is_on = False
```

这就是构建一个开关实体的全部内容！请继续阅读以了解更多信息或查看 [视频教程](https://youtu.be/Cfasc9EgbMU?t=737)。

## 更新实体

实体代表一个设备。有多种策略可以使您的实体与设备的状态保持同步，最常见的一种是轮询。

### 轮询

通过轮询，Home Assistant 会不时询问实体（具体取决于组件的更新间隔）以获取最新状态。当 `should_poll` 属性返回 `True`（默认值）时，Home Assistant 将轮询实体。您可以使用 `update()` 或异步方法 `async_update()` 实现更新逻辑。此方法应从设备中获取最新状态并将其存储在实例变量中，以便属性返回它。

### 订阅更新

当您订阅更新时，您的代码负责让 Home Assistant 知道有可用的更新。确保 `should_poll` 属性返回 `False`。

每当您从订阅中收到新状态时，您可以通过调用 `schedule_update_ha_state()` 或异步回调 `async_schedule_update_ha_state()` 来告诉 Home Assistant 有可用的更新。如果您希望 Home Assistant 在将更新写入 Home Assistant 之前调用您的更新方法，请向该方法传入布尔值 `True`。

## 通用属性

实体基类有一些在所有 Home Assistant 实体中共享的属性。这些属性可以添加到任何实体中，类型无关。所有这些属性都是可选的，不需要实现。

这些属性在状态写入状态机时始终被调用。

:::tip
属性应始终仅从内存中返回信息，而不执行输入/输出操作（例如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。

由于这些属性在状态写入状态机时始终被调用，因此在属性中执行尽可能少的工作很重要。

为了避免在属性方法中进行计算，设置相应的 [实体类或实例属性](#entity-class-or-instance-attributes)，或者如果值从不改变，则使用 [实体描述](#entity-description)。
:::

| 名称                      | 类型                          | 默认值  | 描述
| ------------------------ | ----------------------------- | ------- | -----------
| assumed_state            | `bool`                       | `False` | 如果状态是基于我们的假设而非从设备读取，则返回 `True`。
| attribution              | <code>str &#124; None</code> | `None`  | API 提供者所需的品牌文本。
| available                | `bool`                       | `True`  | 表示 Home Assistant 能否读取状态并控制底层设备。
| device_class             | <code>str &#124; None</code> | `None`  | 设备的额外分类。每个域指定自己的分类。设备类可能带有单位测量和支持功能的额外要求。
| entity_picture           | <code>str &#124; None</code> | `None`  | 显示实体的图片的 URL。
| extra_state_attributes   | <code>dict &#124; None</code> | `None`  | 存储在状态机中的额外信息。它需要是进一步解释状态的信息，不应该是像固件版本这样的静态信息。
| has_entity_name          | `bool`                       | `False` | 如果实体的 `name` 属性代表实体本身，则返回 `True`（对新集成是必需的）。下面将对此做更详细的解释。
| name                     | <code>str &#124; None</code> | `None`  | 实体的名称。避免硬编码自然语言名称，而应使用 [翻译名称](/docs/internationalization/core/#name-of-entities)。
| should_poll              | `bool`                       | `True`  | Home Assistant 是否应该向实体检查更新状态。如果设置为 `False`，实体需要通过调用其中一个 [调度更新方法](integration_fetching_data.md#push-vs-poll) 通知 Home Assistant 新更新。
| state                    | <code>str &#124; int &#124; float &#124; None</code> | `None` | 实体的状态。在大多数情况下，这由域基实体实现，集成不应实现。
| supported_features       | <code>int &#124; None</code> | `None`  | 标志实体支持的功能。域指定自己的功能。
| translation_key         | <code>str &#124; None</code> | `None`  | 用于在 [集成的 `strings.json` 中的 `entity` 部分](/docs/internationalization/core#state-of-entities) 查找实体状态的翻译的键，并将状态翻译为匹配的 [图标](#icons)。
| translation_placeholders | <code>dict &#124; None</code> | `None`  | [翻译实体名称](/docs/internationalization/core/#name-of-entities) 的占位符定义。

:::warning
允许更改 `device_class`、`supported_features` 或包含在域的 `capability_attributes` 中的任何属性。然而，由于这些实体属性通常不期望改变，并且某些实体消费者可能无法以自由速率更新它们，我们建议仅在绝对必要时以适度的间隔更改它们。

例如，这些更改将导致语音助手集成与支持云服务重新同步。
:::

:::warning
生成大量状态更改的实体可能会快速增加数据库的大小，特别是当 `extra_state_attributes` 也频繁更改时。通过删除非关键属性或创建额外的 `sensor` 实体来最小化这些实体的 `extra_state_attributes` 数量。
:::

## 注册表属性

以下属性用于填充实体和设备注册表。每次将实体添加到 Home Assistant 时，它们都会被读取。这些属性仅在 `unique_id` 不为 None 时生效。

| 名称                           | 类型                                      | 默认值  | 描述
| ------------------------------ | ----------------------------------------- | ------- | -----------
| device_info                    | <code>DeviceInfo &#124; None</code>        | `None`  | [设备注册表](/docs/device_registry_index) 描述符，用于 [自动设备注册.](/docs/device_registry_index#automatic-registration-through-an-entity)
| entity_category                | <code>EntityCategory &#124; None</code>  | `None`  | 非主实体的分类。设置为 `EntityCategory.CONFIG` 用于允许更改设备配置的实体，例如，开关实体，使其能够打开或关闭开关的背景照明。设置为 `EntityCategory.DIAGNOSTIC` 用于暴露某些设备配置参数或诊断但不允许更改的实体，例如，显示 RSSI 或 MAC 地址的传感器。 |
| entity_registry_enabled_default | `bool`                                   | `True`  | 表示当首次添加到实体注册表时，实体应启用或禁用。这包括快速变化的诊断实体或假定使用频率较低的实体。例如，暴露 RSSI 或电池电压的传感器通常应设置为 `False`；以防止这些实体造成的不必要（记录）状态变化或用户界面的杂乱。 |
| entity_registry_visible_default | `bool`                                   | `True`  | 表示当首次添加到实体注册表时，实体应隐藏还是可见。 |
| unique_id                      | <code>str &#124; None</code>              | `None`  | 该实体的唯一标识符。它必须在平台内唯一（例如 `light.hue`）。它不应由用户配置或更改。 [了解更多。](entity_registry_index.md#unique-id-requirements) |

## 高级属性

以下属性在实体上也可用。然而，它们仅供高级使用，应谨慎使用。这些属性在状态写入状态机时始终被调用。

| 名称                           | 类型                                    | 默认值  | 描述
| ------------------------------ | --------------------------------------- | ------- | -----------
| capability_attributes           | <code>dict &#124; None</code>          | `None` | 存储在实体注册表中的状态属性。该属性由域基实体实现，集成不应实现。
| force_update                    | `bool`                                 | `False` | 将每个更新写入状态机，即使数据相同。示例用法：当您直接从连接传感器读取值而不是从缓存时。谨慎使用，会对状态机造成垃圾消息。
| icon                            | <code>str &#124; None</code>          | `None`  | 前端要使用的图标。不推荐使用此属性。 [有关使用图标的更多信息](#icons)。 |
| state_attributes                | <code>dict &#124; None</code>          | `None` | 基域的状态属性。该属性由域基实体实现，集成不应实现。
| unit_of_measurement             | <code>str &#124; None</code>          | 实体状态表示的度量单位。通常，对于 `number` 和 `sensor` 域，此属性由域基实体实现，集成不应实现。

## 系统属性

以下属性由 Home Assistant 使用和控制，集成不应重写。

| 名称     | 类型     | 默认值  | 描述
| -------- | -------- | ------- | -----------
| enabled  | `bool`   | `True`  | 表示实体在实体注册表中是否启用。如果平台不支持实体注册表，它也会返回 `True`。被禁用的实体将不会添加到 Home Assistant。 |

## 实体命名

避免将实体名称设置为硬编码的英语字符串，而应将名称 [翻译](/docs/internationalization/core#name-of-entities)。不应翻译名称的示例包括专有名词、型号名称和第三方库提供的名称。

一些实体会自动以其设备类命名，包括 [`binary_sensor`](/docs/core/entity/binary-sensor)、[`button`](/docs/core/entity/button)、[`number`](/docs/core/entity/number) 和 [`sensor`](/docs/core/entity/sensor) 实体，在许多情况下不需要命名。
例如，设备类设置为 `temperature` 的未命名传感器将被命名为“Temperature”。

### `has_entity_name` 为 True（新集成的强制要求）

实体的名称属性仅标识该实体所表示的数据点，不应包括设备的名称或实体的类型。因此，对于表示其设备功率使用情况的传感器，其名称应为“Power usage”。

如果实体代表设备的单个主要功能，则实体的名称属性通常应返回 `None`。
设备的“主要功能”例如是智能灯泡的 `LightEntity`。

`friendly_name` 状态属性是通过将实体名称与设备名称组合生成的，如下所示：
- 实体不是设备的成员：`friendly_name = entity.name`
- 实体是设备的成员且 `entity.name` 不为 `None`：`friendly_name = f"{device.name} {entity.name}"`
- 实体是设备的成员且 `entity.name` 为 `None`：`friendly_name = f"{device.name}"`

实体名称应以大写字母开头，其余单词为小写字母（当然，除非是专有名词或大写缩写）。

#### 示例：开关实体是设备的主要功能

*注意：此示例使用类属性实现属性，有关实现属性的其他方法，请参阅 [属性实现](#property-implementation)。*
*注意：此示例不完整，`unique_id` 属性必须实现，且实体必须 [与设备注册](https://www.home-assistant.io/docs/device_registry/#defining-devices)。*

```python
from homeassistant.components.switch import SwitchEntity


class MySwitch(SwitchEntity):
    _attr_has_entity_name = True
    _attr_name = None

```

#### 示例：开关实体不是设备的主要功能，或不属于设备：

*注意：此示例使用类属性实现属性，有关实现属性的其他方法，请参阅 [属性实现](#property-implementation)。*
*注意：如果实体是设备的一部分，`unique_id` 属性必须实现，且实体必须 [与设备注册](https://www.home-assistant.io/docs/device_registry/#defining-devices)。*

```python
from homeassistant.components.switch import SwitchEntity


class MySwitch(SwitchEntity):
    _attr_has_entity_name = True

    @property
    def translation_key(self):
        """返回用于翻译实体名称和状态的翻译键。"""
        return my_switch
```

#### 示例：未翻译的开关实体不是设备的主要功能，或不属于设备：

```python
from homeassistant.components.switch import SwitchEntity


class MySwitch(SwitchEntity):
    _attr_has_entity_name = True

    @property
    def name(self):
        """实体的名称。"""
        return "Model X"
```

### `has_entity_name` 未实现或为 False（已弃用）

实体的名称属性可以是设备名称与实体所表示的数据点的组合。

## 属性实现

### 属性函数

为每个属性编写属性方法只需几行代码，例如：

```python
class MySwitch(SwitchEntity):

    @property
    def icon(self) -> str | None:
        """实体的图标。"""
        return "mdi:door"

    ...
```

### 实体类或实例属性

另外，可以根据以下任一模式设置实体类或实例属性：

```python
class MySwitch(SwitchEntity):

    _attr_icon = "mdi:door"

    ...
```

```python
class MySwitch(SwitchEntity):

    def __init__(self, icon: str) -> None:
        self._attr_icon = icon

    ...
```

这与第一个示例完全相同，但依赖于基类中属性的默认实现。属性名称以 `_attr_` 开头，后接属性名称。例如，默认的 `device_class` 属性返回 `_attr_device_class` 类属性。

并非所有实体类都支持 `_attr_` 属性用于其特定属性，请查阅相应实体类的文档以获取详细信息。

:::tip
如果集成需要访问其自己的属性，则应访问属性 (`self.name`)，而不是类或实例属性 (`self._attr_name`)。
:::

### 实体描述

设置实体属性的第三种方法是使用实体描述。为此，创建一个名为 `entity_description` 的属性，将 `EntityDescription` 实例赋值给该属性。实体描述是一个数据类，具有与大多数可用 `Entity` 属性对应的属性。每个支持实体平台的实体集成，例如 `switch` 集成，将定义自己的 `EntityDescription` 子类，实施想要使用实体描述的平台应使用该子类。

默认情况下，`EntityDescription` 实例有一个必需的属性，名为 `key`。这是一个字符串，用于在实现平台的所有实体描述中保持唯一。此属性的一个常见用途是在描述的实体的 `unique_id` 中包含它。

使用实体描述的主要好处是以声明性方式定义平台的不同实体类型，使代码在处理多种不同实体类型时更易于阅读。

### 示例

以下代码片段给出了实施属性函数、使用类或实例属性以及何时使用实体描述的最佳实践示例。

```py
from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass

from example import ExampleDevice, ExampleException

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import (
    EntityCategory,
    UnitOfElectricCurrent,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.typing import StateType

from .const import DOMAIN, LOGGER


@dataclass(kw_only=True)
class ExampleSensorEntityDescription(SensorEntityDescription):
    """描述示例传感器实体。"""

    exists_fn: Callable[[ExampleDevice], bool] = lambda _: True
    value_fn: Callable[[ExampleDevice], StateType]


SENSORS: tuple[ExampleSensorEntityDescription, ...] = (
    ExampleSensorEntityDescription(
        key="estimated_current",
        native_unit_of_measurement=UnitOfElectricCurrent.MILLIAMPERE,
        device_class=SensorDeviceClass.CURRENT,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda device: device.power,
        exists_fn=lambda device: bool(device.max_power),
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """根据配置条目设置示例传感器。"""
    device: ExampleDevice = hass.data[DOMAIN][entry.entry_id]
    async_add_entities(
        ExampleSensorEntity(device, description)
        for description in SENSORS
        if description.exists_fn(device)
    )


class ExampleSensorEntity(SensorEntity):
    """表示一个示例传感器。"""

    entity_description: ExampleSensorEntityDescription
    _attr_entity_category = (
        EntityCategory.DIAGNOSTIC
    )  # 这将适用于所有 ExampleSensorEntity 的实例

    def __init__(
        self, device: ExampleDevice, entity_description: ExampleSensorEntityDescription
    ) -> None:
        """设置实例。"""
        self._device = device
        self.entity_description = entity_description
        self._attr_available = False  # 这会覆盖默认值
        self._attr_unique_id = f"{device.serial}_{entity_description.key}"

    def update(self) -> None:
        """更新实体状态。"""
        try:
            self._device.update()
        except ExampleException:
            if self.available:  # 读取当前状态，无需前缀为 _attr_
                LOGGER.warning("更新失败：%s", self.entity_id)
            self._attr_available = False  # 设置属性值
            return

        self._attr_available = True
        # 我们不需要在这里检查设备是否可用
        self._attr_native_value = self.entity_description.value_fn(
            self._device
        )  # 更新 "native_value" 属性
```

## 生命周期钩子

使用这些生命周期钩子在实体发生某些事件时执行代码。所有生命周期钩子都是异步方法。

### `async_added_to_hass()`

当实体的实体 ID 和 hass 对象被分配后，调用此方法，在第一次将其写入状态机之前。例如用途：恢复状态、订阅更新或设置回调/调度函数/监听器。

### `async_will_remove_from_hass()`

当实体即将从 Home Assistant 移除时调用此方法。示例用法：与服务器断开连接或取消订阅更新。

## 图标

Home Assistant 中的每个实体都有一个图标，用作在前端更容易识别实体的视觉指示器。Home Assistant 使用 [Material Design Icons](https://materialdesignicons.com/) 的图标集。

在大多数情况下，Home Assistant 将根据实体的域、`device_class` 和 `state` 自动选择图标。尽可能使用默认图标，以提供一致的体验并避免用户混淆。然而，可以覆盖默认值并为实体提供自定义图标。

无论提供什么图标，用户始终可以在前端根据自己的喜好自定义图标。

为实体提供自定义图标有两种方式，要么通过提供图标翻译，要么通过提供图标标识符。

### 图标翻译

这是为实体提供自定义图标的首选方法。图标翻译的工作方式类似于 [我们常规的翻译](/docs/internationalization/core#state-of-entities)，但它们翻译的是实体状态到图标，而不是实体的状态。

实体的 `translation_key` 属性定义要使用的图标翻译。该属性用于在集成的 `icons.json` 文件的 `entity` 部分中查找翻译。

为区分实体及其翻译，请提供不同的翻译键。以下示例展示了 `icons.json`，用于 Moon 域的 `sensor` 实体，其 `translation_key` 属性设置为 phase：

```json
{
  "entity": {
    "sensor": {
      "phase": {
        "default": "mdi:moon",
        "state": {
          "new_moon": "mdi:moon-new",
          "first_quarter": "mdi:moon-first-quarter",
          "full_moon": "mdi:moon-full",
          "last_quarter": "mdi:moon-last-quarter"
        }
      }
    }
  }
}
```

注意：图标以 `mdi:` 开头加上 [标识符](https://materialdesignicons.com/)。当实体状态不在 `state` 部分时，将使用 `default` 图标。`state` 部分是可选的，如果未提供，所有状态将使用 `default` 图标。

实体状态属性的图标也可以在前端显示状态属性图标的情况下提供。示例包括气候预设和风扇模式。其他状态属性无法提供图标。以下示例为具有 `translation_key` 属性设置为 `ubercool` 的 `climate` 实体提供图标。该实体具有 `preset_mode` 状态属性，可以设置为 `vacation` 或 `night`。前端将使用这些，例如在气候卡中。

```json
{
  "entity": {
    "climate": {
      "ubercool": {
        "state_attributes": {
          "preset_mode": {
            "default": "mdi:confused",
            "state": {
              "vacation": "mdi:umbrella-beach",
              "night": "mdi:weather-night"
            }
          }
        }
      }
    }
  }
}
```

### 图标属性

为实体提供图标的另一种方法是设置实体的 `icon` 属性，该属性返回一个引用 `mdi` 图标的字符串。由于此属性是一个方法，因此可以在不同的逻辑的基础上返回不同的图标，而不是图标翻译。例如，可以根据状态计算图标，如以下示例所示，或根据不是实体状态的一些内容返回不同的图标。

```python
class MySwitch(SwitchEntity):

    @property
    def icon(self) -> str | None:
        """基于时间的实体图标。"""
        if now().hour < 12:
            return "mdi:weather-night"
        return "mdi:weather-sunny"

    ...
```

无法使用 `icon` 属性为状态属性提供图标。请注意，不推荐使用 `icon` 属性；使用上述提到的图标翻译是首选。

## 从记录器历史中排除状态属性

不适合状态历史记录的状态属性应通过包含在 `_entity_component_unrecorded_attributes` 或 `_unrecorded_attributes` 中排除，以避免状态历史记录。
- `_entity_component_unrecorded_attributes: frozenset[str]` 可以在基组件类中设置，例如，在 `light.LightEntity` 中。
- `_unrecorded_attributes: frozenset[str]` 可以在集成的个平台中设置，例如，在平台 `hue.light` 中定义的实体类。

可以使用 `MATCH_ALL` 常量排除所有属性，而无需单独输入。这对于提供未知属性的集成或想要一次性排除所有内容的情况非常有用。

使用 `MATCH_ALL` 常量并不会停止录制 `device_class`、`state_class`、`unit_of_measurement` 和 `friendly_name`，因为它们也可能具有其他目的，因此不应排除在录制之外。

排除的状态属性的示例包括 `image` 实体的 `entity_picture` 属性，该属性在一段时间后将不再有效，风扇实体的 `preset_modes` 属性则不太可能发生变化。
集成特定的状态属性的示例包括 `trafikverket.camera` 平台中不变的 `description` 和 `location` 状态属性。

:::tip
`_entity_component_unrecorded_attributes` 和 `_unrecorded_attributes` 必须声明为类属性；实例属性将被忽略。
:::

## 更改实体模型

如果您想为实体或其任何子类型（灯光、开关等）添加新功能，您需要首先在我们的 [架构 repo](https://github.com/home-assistant/architecture/discussions) 中提出建议。仅考虑在各种供应商之间常见的附加功能。