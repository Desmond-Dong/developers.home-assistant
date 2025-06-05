---
title: "REST API"
---
import ApiEndpoint from '@site/static/js/api_endpoint.jsx'

Home Assistant提供了一个RESTful API，使用与Web前端相同的端口（默认端口是8123）。

如果您在设置中不使用[`frontend`](https://www.home-assistant.io/integrations/frontend/)，则需要在您的`configuration.yaml`文件中添加[`api`集成](https://www.home-assistant.io/integrations/api/)。

- `http://IP_ADDRESS:8123/` 是一个控制Home Assistant的接口。
- `http://IP_ADDRESS:8123/api/` 是一个RESTful API。

API仅接受和返回JSON编码的对象。

所有API调用必须伴随请求头`Authorization: Bearer TOKEN`，其中`TOKEN`替换为您的唯一访问令牌。您可以通过使用Web浏览器登录前端，并访问[您的个人资料](https://www.home-assistant.io/docs/authentication/#your-account-profile) `http://IP_ADDRESS:8123/profile` 来获取一个令牌（“长期访问令牌”）。请注意复制整个密钥。

有多种方式可以使用Home Assistant REST API。一种是使用`curl`：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  http://IP_ADDRESS:8123/ENDPOINT
```

另一个选项是使用Python和[Requests](https://requests.readthedocs.io/en/latest/)模块。

```python
from requests import get

url = "http://localhost:8123/ENDPOINT"
headers = {
    "Authorization": "Bearer TOKEN",
    "content-type": "application/json",
}

response = get(url, headers=headers)
print(response.text)
```

另一个选项是在Home Assistant自动化或脚本中使用[RESTful Command集成](https://www.home-assistant.io/integrations/rest_command/)。

```yaml
turn_light_on:
  url: http://localhost:8123/api/states/light.study_light
  method: POST
  headers:
    authorization: 'Bearer TOKEN'
    content-type: 'application/json'
  payload: '{"state":"on"}'
```

成功的调用将返回状态码200或201。其他可能返回的状态码包括：

- 400（错误请求）
- 401（未经授权）
- 404（未找到）
- 405（方法不允许）

### 操作

API支持以下操作：

<ApiEndpoint path="/api/" method="get">

如果API正常运行，将返回一条消息。

```json
{
  "message": "API运行中。"
}
```

示例`curl`命令：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" http://localhost:8123/api/
```

</ApiEndpoint>

<ApiEndpoint path="/api/config" method="get">

返回当前配置的JSON格式。

```json
{
   "components":[
      "sensor.cpuspeed",
      "frontend",
      "config.core",
      "http",
      "map",
      "api",
      "sun",
      "config",
      "discovery",
      "conversation",
      "recorder",
      "group",
      "sensor",
      "websocket_api",
      "automation",
      "config.automation",
      "config.customize"
   ],
   "config_dir":"/home/ha/.homeassistant",
   "elevation":510,
   "latitude":45.8781529,
   "location_name":"家",
   "longitude":8.458853651,
   "time_zone":"Europe/Zurich",
   "unit_system":{
      "length":"km",
      "mass":"g",
      "temperature":"\u00b0C",
      "volume":"L"
   },
   "version":"0.56.2",
   "whitelist_external_dirs":[
      "/home/ha/.homeassistant/www",
      "/home/ha/.homeassistant/"
   ]
}
```

示例`curl`命令：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" http://localhost:8123/api/config
```

</ApiEndpoint>

<ApiEndpoint path="/api/events" method="get">

返回事件对象数组。每个事件对象包含事件名称和监听器计数。

```json
[
    {
      "event": "state_changed",
      "listener_count": 5
    },
    {
      "event": "time_changed",
      "listener_count": 2
    }
]
```

示例`curl`命令：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" http://localhost:8123/api/events
```

</ApiEndpoint>

<ApiEndpoint path="/api/services" method="get">

返回服务对象数组。每个对象包含域以及所包含的服务。

```json
[
    {
      "domain": "browser",
      "services": [
        "browse_url"
      ]
    },
    {
      "domain": "keyboard",
      "services": [
        "volume_up",
        "volume_down"
      ]
    }
]
```

示例`curl`命令：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" http://localhost:8123/api/services
```

</ApiEndpoint>

<ApiEndpoint path="/api/history/period/<timestamp>" method="get">

返回过去状态变化的数组。每个对象包含实体的更多详细信息。

`<timestamp>`（`YYYY-MM-DDThh:mm:ssTZD`）是可选的，默认为请求时间前1天。它确定了时间段的开始。

以下参数是**必需的**：

- `filter_entity_id=<entity_ids>` 用于过滤一个或多个实体 - 以逗号分隔。

您可以传递以下可选的GET参数：

- `end_time=<timestamp>` 用于选择以URL编码格式指定的时间段结束时间（默认为1天）。
- `minimal_response` 仅返回`last_changed`和状态，而不是第一个和最后一个状态的状态（速度更快）。
- `no_attributes` 跳过从数据库返回属性（速度更快）。
- `significant_changes_only` 仅返回显著的状态变化。

不使用`minimal_response`的示例

```json
[
    [
        {
            "attributes": {
                "friendly_name": "天气温度",
                "unit_of_measurement": "\u00b0C"
            },
            "entity_id": "sensor.weather_temperature",
            "last_changed": "2016-02-06T22:15:00+00:00",
            "last_updated": "2016-02-06T22:15:00+00:00",
            "state": "-3.9"
        },
        {
            "attributes": {
                "friendly_name": "天气温度",
                "unit_of_measurement": "\u00b0C"
            },
            "entity_id": "sensor.weather_temperature",
            "last_changed": "2016-02-06T22:15:00+00:00",
            "last_updated": "2016-02-06T22:15:00+00:00",
            "state": "-1.9"
        },
    ]
]
```

使用`minimal_response`的示例

```json
[
    [
        {
            "attributes": {
                "friendly_name": "天气温度",
                "unit_of_measurement": "\u00b0C"
            },
            "entity_id": "sensor.weather_temperature",
            "last_changed": "2016-02-06T22:15:00+00:00",
            "last_updated": "2016-02-06T22:50:30.529465+00:00",
            "state": "-3.9"
        },
        {
            "last_changed": "2016-02-06T22:20:00+00:00",
            "state": "-2.9"
        },
        {
            "last_changed": "2016-02-06T22:22:00+00:00",
            "state": "-2.2"
        },
        {
            "attributes": {
                "friendly_name": "天气温度",
                "unit_of_measurement": "\u00b0C"
            },
            "entity_id": "sensor.weather_temperature",
            "last_changed": "2016-02-06T22:25:00+00:00",
            "last_updated": "2016-02-06T22:25:00+00:00",
            "state": "-1.9"
        },
    ]
]
```

示例`curl`命令：

```shell
# 实体'sensor.temperature'过去一天的历史（默认）
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  "http://localhost:8123/api/history/period?filter_entity_id=sensor.temperature"
```

```shell
# 实体'sensor.temperature'和'sensor.kitchen_temperature'过去一天的最小历史，开始日期手动设置为2023-09-04
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  "http://localhost:8123/api/history/period/2023-09-04T00:00:00+02:00?filter_entity_id=sensor.temperature,sensor.kitchen_temperature&minimal_response"
```

```shell
# 实体'sensor.temperature'在2021-09-04到2023-09-04期间的历史
# 使用URL编码时间戳
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  "http://localhost:8123/api/history/period/2021-09-04T00%3A00%3A00%2B02%3A00?end_time=2023-09-04T00%3A00%3A00%2B02%3A00&filter_entity_id=sensor.temperature"
```

</ApiEndpoint>

<ApiEndpoint path="/api/logbook/<timestamp>" method="get">

返回日志条目数组。

`<timestamp>`（`YYYY-MM-DDThh:mm:ssTZD`）是可选的，默认为请求时间前1天。它确定了时间段的开始。

您可以传递以下可选的GET参数：

- `entity=<entity_id>` 用于过滤一个实体。
- `end_time=<timestamp>` 用于选择从`<timestamp>`开始的时间段结束时间，以URL编码格式。

示例
```json
[
  {
		"context_user_id": null,
		"domain": "alarm_control_panel",
		"entity_id": "alarm_control_panel.area_001",
		"message": "已更改为去武装",
		"name": "安全",
		"when": "2020-06-20T16:44:26.127295+00:00"
	},
	{
		"context_user_id": null,
		"domain": "homekit",
		"entity_id": "alarm_control_panel.area_001",
		"message": "向安全发送命令alarm_arm_night",
		"name": "HomeKit",
		"when": "2020-06-21T02:59:05.759645+00:00"
	},
	{
		"context_user_id": null,
		"domain": "alarm_control_panel",
		"entity_id": "alarm_control_panel.area_001",
		"message": "已更改为armed_night",
		"name": "安全",
		"when": "2020-06-21T02:59:06.015463+00:00"
	}
]
```

示例`curl`命令：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/logbook/2016-12-29T00:00:00+02:00
```

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  "http://localhost:8123/api/logbook/2016-12-29T00:00:00+02:00?end_time=2099-12-31T00%3A00%3A00%2B02%3A00&entity=sensor.temperature"
```

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  "http://localhost:8123/api/logbook/2016-12-29T00:00:00+02:00?end_time=2099-12-31T00%3A00%3A00%2B02%3A00"
```

</ApiEndpoint>

<ApiEndpoint path="/api/states" method="get">

返回状态对象数组。每个状态具有以下属性：`entity_id`、`state`、`last_changed`和`attributes`。

```json
[
    {
        "attributes": {},
        "entity_id": "sun.sun",
        "last_changed": "2016-05-30T21:43:32.418320+00:00",
        "state": "below_horizon"
    },
    {
        "attributes": {},
        "entity_id": "process.Dropbox",
        "last_changed": "22016-05-30T21:43:32.418320+00:00",
        "state": "on"
    }
]
```

示例`curl`命令：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" http://localhost:8123/api/states
```

</ApiEndpoint>

<ApiEndpoint path="/api/states/<entity_id>" method="get">

返回指定`entity_id`的状态对象。未找到时返回404。

```json
{
   "attributes":{
      "azimuth":336.34,
      "elevation":-17.67,
      "friendly_name":"太阳",
      "next_rising":"2016-05-31T03:39:14+00:00",
      "next_setting":"2016-05-31T19:16:42+00:00"
   },
   "entity_id":"sun.sun",
   "last_changed":"2016-05-30T21:43:29.204838+00:00",
   "last_updated":"2016-05-30T21:50:30.529465+00:00",
   "state":"below_horizon"
}
```

示例`curl`命令：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/states/sensor.kitchen_temperature
```

</ApiEndpoint>

<ApiEndpoint path="/api/error_log" method="get">

检索在当前Home Assistant会话中记录的所有错误，以纯文本响应。

```text
15-12-20 11:02:50 homeassistant.components.recorder: 找到未完成的会话
15-12-20 11:03:03 netdisco.ssdp: 在http://192.168.1.1:8200/rootDesc.xml获取描述时出错
15-12-20 11:04:36 homeassistant.components.alexa: 收到未知意图HelpIntent
```

示例`curl`命令：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/error_log
```

</ApiEndpoint>

<ApiEndpoint path="/api/camera_proxy/<camera entity_id>" method="get">

返回指定相机`entity_id`的数据（图像）。

示例`curl`命令：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -o image.jpg \
  "http://localhost:8123/api/camera_proxy/camera.my_sample_camera?time=1462653861261"
```

</ApiEndpoint>


<ApiEndpoint path="/api/calendars" method="get">

返回日历实体列表。

```json
[
  {
    "entity_id": "calendar.holidays",
    "name": "国家假日",
  },
  {
    "entity_id": "calendar.personal",
    "name": "个人日历",
  }
]
```

示例`curl`命令：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/calendars
```

</ApiEndpoint>

<ApiEndpoint path="/api/calendars/<calendar entity_id>?start=<timestamp>&end=<timestamp>" method="get">

返回指定日历`entity_id`在`start`和`end`时间之间（不包括）的[日历事件](/docs/core/entity/calendar/#calendarevent)列表。

响应中的事件具有`start`和`end`，包含`dateTime`或`date`用于全天事件。
```json
[
  {
    "summary": "五月五日",
    "start": {
      "date": "2022-05-05"
    },
    "end": {
      "date": "2022-05-06"
    },
  },
  {
    "summary": "生日派对",
    "start": {
      "dateTime": "2022-05-06T20:00:00-07:00"
    },
    "end": {
      "dateTime": "2022-05-06T23:00:00-07:00"
    },
    "description": "别忘了带气球",
    "location": "布莱恩的家"
  }
]
```

示例`curl`命令：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  "http://localhost:8123/api/calendars/calendar.holidays?start=2022-05-01T07:00:00.000Z&end=2022-06-12T07:00:00.000Z"
```

</ApiEndpoint>

<ApiEndpoint path="/api/states/<entity_id>" method="post">

更新或创建状态。您可以创建任何您想要的状态，它不必由Home Assistant中的实体支持。

:::info
此端点设置Home Assistant中设备的表示，不会与实际设备通信。要与设备通信，请使用[POST /api/services/&lt;domain>/&lt;service>](#post-apiservicesltdomainltservice)端点。
:::

期望一个至少包含一个状态属性的JSON对象：

```json
{
    "state": "below_horizon",
    "attributes": {
        "next_rising":"2016-05-31T03:39:14+00:00",
        "next_setting":"2016-05-31T19:16:42+00:00"
    }
}
```

如果实体存在，返回代码为200，如果设置了新实体的状态，则返回201。将返回一个包含新资源URL的location头。响应体将包含JSON编码的状态对象。

```json
{
    "attributes": {
        "next_rising":"2016-05-31T03:39:14+00:00",
        "next_setting":"2016-05-31T19:16:42+00:00"
    },
    "entity_id": "sun.sun",
    "last_changed": "2016-05-30T21:43:29.204838+00:00",
    "last_updated": "2016-05-30T21:47:30.533530+00:00",
    "state": "below_horizon"
}
```

示例`curl`命令：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"state": "25", "attributes": {"unit_of_measurement": "°C"}}' \
  http://localhost:8123/api/states/sensor.kitchen_temperature
```

使用[Requests](https://requests.readthedocs.io/en/master/)模块的示例`python`命令：

```shell
from requests import post

url = "http://localhost:8123/api/states/sensor.kitchen_temperature"
headers = {"Authorization": "Bearer TOKEN", "content-type": "application/json"}
data = {"state": "25", "attributes": {"unit_of_measurement": "°C"}}

response = post(url, headers=headers, json=data)
print(response.text)
```

</ApiEndpoint>

<ApiEndpoint path="/api/events/<event_type>" method="post">

触发具有`event_type`的事件。请注意按照我们[数据科学门户](https://data.home-assistant.io/docs/events/#database-table)上文档定义的数据结构。

您可以传递一个可选的JSON对象作为`event_data`。

```json
{
    "next_rising":"2016-05-31T03:39:14+00:00",
}
```

如果成功，将返回一条消息。

```json
{
    "message": "事件download_file已触发。"
}
```

</ApiEndpoint>

<ApiEndpoint path="/api/services/<domain>/<service>" method="post">

在特定域内调用服务。将在服务执行后返回。

您可以传递一个可选的JSON对象作为`service_data`。

```json
{
    "entity_id": "light.Ceiling"
}
```

返回在服务执行时发生变化的状态列表，并可选地返回响应数据（如果服务支持）。

```json
[
    {
        "attributes": {},
        "entity_id": "sun.sun",
        "last_changed": "2016-05-30T21:43:32.418320+00:00",
        "state": "below_horizon"
    },
    {
        "attributes": {},
        "entity_id": "process.Dropbox",
        "last_changed": "22016-05-30T21:43:32.418320+00:00",
        "state": "on"
    }
]
```

:::tip
结果将包括在服务执行期间发生变化的任何状态，即使它们的变化是由于系统中发生的其他事情。
:::

如果您调用的服务支持返回响应数据，您可以通过在URL中添加`?return_response`来检索它。您的响应将同时包含已更改的实体列表和服务响应数据。

```json
{
    "changed_states": [
        {
            "attributes": {},
            "entity_id": "sun.sun",
            "last_changed": "2024-04-22T20:45:54.418320-04:00",
            "state": "below_horizon"
        },
        {
            "attributes": {},
            "entity_id": "binary_sensor.dropbox",
            "last_changed": "2024-04-22T20:45:54.418320-04:00",
            "state": "on"
        }
    ],
    "service_response": {
        "weather.new_york_forecast": {
            "forecast": [
                {
                    "condition": "clear-night",
                    "datetime": "2024-04-22T20:45:55.173725-04:00",
                    "precipitation_probability": 0,
                    "temperature": null,
                    "templow": 6.0
                },
                {
                    "condition": "rainy",
                    "datetime": "2024-04-23T20:45:55.173756-04:00",
                    "precipitation_probability": 60,
                    "temperature": 16.0,
                    "templow": 4.0
                }
            ]
        }
    }
}
```

:::note
某些服务不返回数据，其他服务可选择性地返回响应数据，还有一些服务总是返回响应数据。

如果您在调用必须返回数据的服务时未使用`return_response`，API将返回400。同样，如果您在调用不返回任何数据的服务时使用`return_response`，您将收到400。
:::

示例`curl`命令：

打开灯：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"entity_id": "switch.christmas_lights"}' \
  http://localhost:8123/api/services/switch/turn_on
```

使用[Requests](https://requests.readthedocs.io/en/master/)模块的示例`python`命令：

打开灯：

```shell
from requests import post

url = "http://localhost:8123/api/services/light/turn_on"
headers = {"Authorization": "Bearer TOKEN"}
data = {"entity_id": "light.study_light"}

response = post(url, headers=headers, json=data)
print(response.text)
```

发送MQTT消息：

```shell
curl \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"payload": "OFF", "topic": "home/fridge", "retain": "True"}' \
  http://localhost:8123/api/services/mqtt/publish
```

检索每日天气预报信息：

```shell
curl \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"entity_id": "weather.forecast_home", "type": "daily"}' \
  http://localhost:8123/api/services/weather/get_forecasts?return_response
```

</ApiEndpoint>

<ApiEndpoint path="/api/template" method="post">

渲染一个Home Assistant模板。[查看模板文档以获取更多信息。](https://www.home-assistant.io/docs/configuration/templating)

```json
{
    "template": "Paulus在{{ states('device_tracker.paulus') }}！"
}
```

将以纯文本返回已渲染的模板。

```text
Paulus在工作中！
```

示例`curl`命令：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"template": "现在是{{ now() }}！"}' http://localhost:8123/api/template
```

</ApiEndpoint>

<ApiEndpoint path="/api/config/core/check_config" method="post">

触发对`configuration.yaml`的检查。此请求无需传递其他数据。需要启用配置集成。

如果检查成功，将返回以下内容：

```json
{
    "errors": null,
    "result": "有效"
}
```

如果检查失败，对象中的errors属性将列出导致检查失败的原因。例如：

```json
{
    "errors": "未找到集成：frontend：",
    "result": "无效"
}
```

</ApiEndpoint>

<ApiEndpoint path="/api/intent/handle" method="post">

处理一个意图。

您必须在`configuration.yaml`中添加`intent:`以启用此端点。

示例`curl`命令：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{ "name": "SetTimer", "data": { "seconds": "30" } }' \
  http://localhost:8123/api/intent/handle
```

</ApiEndpoint>

<ApiEndpoint path="/api/states/<entity_id>" method="delete">

删除指定`entity_id`的实体。

示例`curl`命令：

```shell
curl \
  -X DELETE \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/states/sensor.kitchen_temperature
```

</ApiEndpoint>