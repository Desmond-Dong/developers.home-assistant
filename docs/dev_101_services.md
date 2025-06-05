---
title: "集成服务操作"
sidebar_label: "自定义操作"
---

Home Assistant 提供了许多现成的操作，但并不总是覆盖所有内容。与其尝试修改 Home Assistant，最好还是先将其添加为您自己集成下的服务操作。一旦我们在这些服务操作中看到模式，我们就可以讨论将其通用化。

这是一个简单的“你好，世界”示例，展示了注册服务操作的基础知识。要使用此示例，请创建文件 `<config dir>/custom_components/hello_action/__init__.py` 并复制以下示例代码。

操作可以从自动化和前端的“开发者工具”中调用。

```python
DOMAIN = "hello_action"

ATTR_NAME = "name"
DEFAULT_NAME = "World"


def setup(hass, config):
    """当 Home Assistant 正在加载我们的组件时调用设置."""

    def handle_hello(call):
        """处理服务操作调用."""
        name = call.data.get(ATTR_NAME, DEFAULT_NAME)

        hass.states.set("hello_action.hello", name)

    hass.services.register(DOMAIN, "hello", handle_hello)

    # 返回布尔值以指示初始化是否成功。
    return True
```

要在 Home Assistant 中加载集成，必须创建 `manifest.json` 并在 `configuration.yaml` 中添加一条条目。当您的组件被加载时，应可调用新的服务。

```yaml
# configuration.yaml 条目
hello_action:
```

`manifest.json` 的示例：

```json
{
    "domain": "hello_action",
    "name": "Hello Action",
    "documentation": "https://developers.home-assistant.io/docs/dev_101_services",
    "iot_class": "local_push",
    "version": "0.1.0"
}
```

打开前端，在侧边栏中点击开发者工具部分的第一个图标。这将打开操作开发者工具。在右侧找到您的操作并点击它。这将自动填入正确的值。

按下“执行操作”将现在调用您的服务操作而不带任何参数。这将导致您的服务操作创建一个状态，其默认名称为 'World'。如果您想指定名称，必须通过服务操作数据提供参数。在 YAML 模式中，添加以下内容并再次按“执行服务”。

```yaml
service: hello_action.hello
data:
  name: Planet
```

服务操作将现在用 “Planet” 替换先前的状态。

## 服务操作描述

添加操作只有在用户知道它们的情况下才有用。在 Home Assistant 中，我们使用 `services.yaml` 作为您集成的一部分来描述服务操作。

操作在您的集成的域名下发布，因此在 `services.yaml` 中，我们只使用服务操作名称作为基键。

### 服务操作描述示例

```yaml
# 示例 services.yaml 条目

# 服务 ID
set_speed:
  # 如果服务操作接受实体 ID，则 target 允许用户通过实体、设备或区域指定
  # 实体。如果指定了 `target`，则 `entity_id` 不应在 `fields` 映射中定义。
  # 默认情况下，它仅显示与操作相同域的实体匹配的目标，但如果需要进一步
  # 自定义，target 支持实体、设备和区域选择器
  # (https://www.home-assistant.io/docs/blueprint/selectors/)。
  # 实体选择器参数将自动应用于设备和区域，设备选择器参数将自动应用于区域。
  target:
    entity:
      domain: fan
      # 如果操作的域中的所有实体都不支持操作，则可以通过 `supported_features` 状态属性进一步过滤实体。
      # 仅当实体支持至少一个列出的支持功能时，才能选择它。
      supported_features:
        - fan.FanEntityFeature.SET_SPEED
        # 如果服务操作需要多个支持的功能，则应将项作为所需支持功能的列表提供。例如，
        # 如果服务操作同时需要 SET_SPEED 和 OSCILLATE，则应如下表示：
        - - fan.FanEntityFeature.SET_SPEED
          - fan.FanEntityFeature.OSCILLATE
  # 您的服务操作接受的不同字段
  fields:
    # 字段的键
    speed:
      # 字段是否是必需的（默认 = false）
      required: true
      # 仅当为用户启用高级模式时，才显示高级字段（默认 = false）
      advanced: true
      # 可以传递给此字段的示例值
      example: "low"
      # 默认字段值
      default: "high"
      # 控制此字段输入 UI 的选择器
      selector:
        select:
          translation_key: "fan_speed"
          options:
            - "off"
            - "low"
            - "medium"
            - "high"
    # 字段可以在可折叠的部分中分组，这有助于最初隐藏
    # 高级字段和分组相关字段。请注意，可折叠部分
    # 仅影响用户的展示，服务操作数据不会嵌套。
    advanced_fields:
      # 该部分是否初始折叠（默认 = false）
      collapsed: true
      # 此部分中的输入字段
      fields:
        speed_pct:
          selector:
            number:
              min: 0
              max: 100
```

:::info
服务操作的名称和描述在我们的 [翻译](/docs/internationalization/core#services) 中设置，而不是在服务操作描述中。每个服务操作和服务操作字段必须有一个匹配的翻译定义。
:::

### 服务操作字段的分组

输入字段可以在视觉上分组在部分中。按部分分组输入字段只影响输入在用户面前的显示方式，而不影响服务操作数据的结构。

在 [服务操作描述示例](#service-action-description-example) 中， `speed_pct` 输入字段位于一个初始折叠的部分 `advanced_fields` 中。
示例中的服务操作数据为 `{"speed_pct": 50}`，而不是 `{"advanced_fields": {"speed_pct": 50}}`。

### 过滤服务操作字段

在某些情况下，操作域中的实体可能不支持所有服务操作字段。
通过为字段描述提供一个 `filter`，该字段仅在至少一个选定实体支持该字段时显示，依据配置的过滤器。

过滤器必须指定 `supported_features` 或 `attribute`，两者的组合不受支持。

`supported_features` 过滤器通过支持功能的列表来指定。如果至少一个选定实体支持至少一个列出的功能，则显示该字段。

`attribute` 过滤器将一个属性与一个值列表组合。如果至少一个选定实体的属性被设置为列出的属性状态之一，则显示该字段。
如果属性状态是列表，则只要选择的
实体的属性状态中至少有一个项目设置为列出的属性状态之一，该字段也将显示。

这是一个部分示例，只有在至少一个选择的实体支持 `ClimateEntityFeature.TARGET_TEMPERATURE` 时，字段才会显示：

```yaml
  fields:
    temperature:
      name: 温度
      description: HVAC 的新目标温度。
      filter:
        supported_features:
          - climate.ClimateEntityFeature.TARGET_TEMPERATURE
```

这是一个部分示例，只有在至少一个选择的实体的 `supported_color_modes` 属性包含 `light.ColorMode.COLOR_TEMP` 或 `light.ColorMode.HS` 时，字段才会显示：

```yaml
    color_temp:
      name: 颜色温度
      description: 灯光的颜色温度，以米红色度为单位。
      filter:
        attribute:
          supported_color_modes:
            - light.ColorMode.COLOR_TEMP
            - light.ColorMode.HS
```

## 图标

操作也可以有图标。这些图标在 Home Assistant UI 中用于显示服务操作，例如在自动化和脚本编辑器中。

要为每个服务操作使用的图标可以在集成文件夹中的 `icons.json` 翻译文件中定义，位于 `services` 键下。键应为服务操作名称，值应为要使用的图标。

以下示例展示了如何为集成的 `turn_on` 和 `turn_off` 服务操作提供图标：

```json
{
  "services": {
    "turn_on": {"service": "mdi:lightbulb-on"},
    "turn_off": {"service": "mdi:lightbulb-off"}
  }
}
```

此外，还可以为可折叠部分选择性地指定图标。

以下示例展示了如何为 `advanced_options` 部分提供图标：

```json
{
  "services": {
    "start_brewing": {
      "service": "mdi:flask",
      "sections": {
        "advanced_options": "mdi:test-tube"
      }
    }
  }
}
```


## 实体服务操作

有时您想要提供额外的操作来控制您的实体。例如，Sonos 集成提供对设备进行分组和取消分组的操作。实体服务操作是特殊的，因为用户可以以多种不同方式指定实体。它可以使用区域、组或实体列表。

您需要在您的平台中注册实体服务操作，例如 `<your-domain>/media_player.py`。这些服务操作将在您的域下而不是平台域下提供（例如媒体播放器域）。如果实体服务操作有字段，可以将架构传递给 `async_register_entity_service`。该架构可以是：

- 自动传递给 `cv._make_entity_service_schema` 的字典
- 由 `cv._make_entity_service_schema` 返回的验证器
- 被 `vol.Schema` 包裹的由 `cv._make_entity_service_schema` 返回的验证器
- 被 `vol.All` 包裹的由 `cv._make_entity_service_schema` 返回的验证器

示例代码：

```python
from homeassistant.helpers import config_validation as cv, entity_platform, service

async def async_setup_entry(hass, entry):
    """为 Sonos 设置媒体播放器平台."""

    platform = entity_platform.async_get_current_platform()

    # 这将调用 Entity.set_sleep_timer(sleep_time=VALUE)
    platform.async_register_entity_service(
        SERVICE_SET_TIMER,
        {
            vol.Required('sleep_time'): cv.time_period,
        },
        "set_sleep_timer",
    )
```

如果您需要对服务操作调用有更好的控制，您也可以传递一个异步函数，该函数将被调用以替代 `"set_sleep_timer"`：

```python
async def custom_set_sleep_timer(entity, service_call):
    await entity.set_sleep_timer(service_call.data['sleep_time'])
```

## 响应数据

操作可以对操作调用做出响应，通过数据来推动更高级的自动化。有一些额外的实现要求：

- 响应数据必须是一个 `dict`，并且可以在 JSON [`homeassistant.util.json.JsonObjectType`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/util/json.py) 中序列化，以与系统的其他部分如前端进行交互。
- 错误必须如同任何其他服务操作调用一样引发异常，因为我们不希望最终用户在脚本和自动化中需要复杂的错误处理。
响应数据不应包含用于错误处理的错误代码。

示例代码：

```python
import datetime
import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.helpers import config_validation as cv, entity_platform, service
from homeassistant.util.json import JsonObjectType


SEARCH_ITEMS_SERVICE_NAME = "search_items"
SEARCH_ITEMS_SCHEMA = vol.Schema({
    vol.Required("start"): datetime.datetime,
    vol.Required("end"): datetime.datetime,
})


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """设置平台."""

    async def search_items(call: ServiceCall) -> ServiceResponse:
        """在日期范围内搜索并返回匹配的项目."""
        items = await my_client.search(call.data["start"], call.data["end"])
        return {
            "items": [
                {
                    "summary": item["summary"],
                    "description": item["description"],
                } for item in items
            ],
        }

      hass.services.async_register(
          DOMAIN,
          SEARCH_ITEMS_SERVICE_NAME,
          search_items,
          schema=SEARCH_ITEMS_SCHEMA,
          supports_response=SupportsResponse.ONLY,
      )
```

响应数据的使用旨在适用于不符合 Home Assistant 状态的情况。例如，响应对象的流。相反，响应数据不应用于适合实体状态的情况。例如，温度值应仅作为传感器。

### 支持响应数据

操作调用使用 `SupportsResponse` 值进行注册，以指示支持响应数据。

| 值         | 描述                                                                                                                                                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OPTIONAL` | 执行一个操作，并可以选择性地返回响应数据。服务操作应该有条件地检查 `ServiceCall` 属性 `return_response` 以决定是否返回响应数据，或返回 `None`。                                                               |
| `ONLY`     | 不执行任何操作，总是返回响应数据。                                                                                                                                                                                                             |