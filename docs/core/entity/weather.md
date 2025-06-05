---
title: 天气实体
sidebar_label: 天气
---

从 [`homeassistant.components.weather.WeatherEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/weather/__init__.py) 派生实体平台

## 属性

:::tip
属性应始终仅从内存返回信息，而不执行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称 | 类型 | 默认值 | 描述
| ---- | ---- | ------- | -----------
| cloud_coverage | int | `None` | 当前云层覆盖率（%）。
| condition | string | **必填** | 当前天气状况。
| humidity | float | `None` | 当前湿度（%）。
| native_apparent_temperature | float | `None` | 当前明显的（体感）温度（°C 或 °F）。
| native_dew_point | float | `None` | 当前露点温度（°C 或 °F）。
| native_precipitation_unit | string | `None` | 降水单位；毫米或英寸。
| native_pressure | float | `None` | 当前气压（hPa, mbar, inHg 或 mmHg）。
| native_pressure_unit | string | `None` | 气压单位；hPa, mbar, inHg 或 mmHg。如果设置了 native_pressure，则为必填。
| native_temperature | float | **必填** | 当前温度（°C 或 °F）。
| native_temperature_unit | string | **必填** | 温度单位；°C 或 °F。
| native_visibility | float | `None` | 当前能见度（公里或英里）。
| native_visibility_unit | string | `None` | 能见度单位；公里或英里。如果设置了 native_visibility，则为必填。
| native_wind_gust_speed | float | `None` | 当前风阵速度（米/秒, 公里/小时, 英里/小时, 英尺/秒或节）。
| native_wind_speed | float | `None` | 当前风速（米/秒, 公里/小时, 英里/小时, 英尺/秒或节）。
| native_wind_speed_unit | string | `None` | 风速单位；米/秒, 公里/小时, 英里/小时, 英尺/秒或节。如果设置了 native_wind_speed，则为必填。
| ozone | float | `None` | 当前臭氧水平。
| uv_index | float | `None` | 当前的 [紫外线指数](https://en.wikipedia.org/wiki/Ultraviolet_index)。
| wind_bearing | float 或 string | `None` | 当前风向角度（度）或 1-3 个字母的方位方向。

### 单位转换

属性必须遵循表中各自的计量单位。

对用户而言，属性将根据单位制进行呈现。这是通过在创建状态对象时自动转换单位来实现的。

对于每个天气实体，用户还可以选择覆盖呈现单位，即状态对象中使用的单位。

### 状态和条件的推荐值

这些天气条件包含在我们的翻译文件中，并显示对应的图标。

| 条件 | 描述
| --------- | -----------
| clear-night | 晴朗的夜晚
| cloudy | 多云
| exceptional | 特殊
| fog | 雾
| hail | 冻雨
| lightning | 闪电/雷暴
| lightning-rainy | 闪电/雷暴和雨
| partlycloudy | 少量云
| pouring | 大雨
| rainy | 雨
| snowy | 雪
| snowy-rainy | 雪和雨
| sunny | 晴天
| windy | 风
| windy-variant | 风和云

这意味着 `weather` 平台不需要支持多种语言。

## 支持的功能

支持的功能通过在 `WeatherEntityFeature` 枚举中使用值来定义，并使用按位或（`|`）运算符结合。

| 值 | 描述
| -------------------------- | ------------------------------------------------------------------------------------------- |
| `FORECAST_DAILY`           | 设备支持每日天气预报。                                                       |
| `FORECAST_HOURLY`          | 设备支持每小时天气预报。                                                     |
| `FORECAST_TWICE_DAILY`     | 设备支持每日两次的天气预报。                                                 |

## 天气预报

天气平台可以选择性地提供天气预报。支持天气预报通过设置正确的 [支持特性](#supported-features) 来指示。天气预报不是实体状态的一部分，而是通过单独的 API 提供。消费者，例如前端，可以订阅天气预报更新。

### 预报数据

预报数据可以是每日的、每小时的或每日两次的。一个集成可以提供其中的任何或全部。

集成应实现一个或多个异步方法 `async_forecast_daily`、`async_forecast_hourly` 和 `async_forecast_twice_daily`，如下所述，以获取预报数据。

| 名称 | 类型 | 默认值 | 描述
| ---- | ---- | ------- | -----------
| datetime | string | **必填** | RFC 3339 格式的 UTC 日期时间。
| is_daytime | bool | `None` | 这是返回的预测数据中必填的，以指示是白天还是夜晚。
| cloud_coverage | int | `None` | 云层覆盖率（%）。
| condition | string | `None` | 该时刻的天气状况。
| humidity | float | `None` | 湿度（%）。
| native_apparent_temperature | float | `None` | 明显的（体感）温度（°C 或 °F）
| native_dew_point | float | `None` | 露点温度（°C 或 °F）
| native_precipitation | float | `None` | 降水量（毫米或英寸）。
| native_pressure | float | `None` | 气压（hPa, mbar, inHg 或 mmHg）。
| native_temperature | float | **必填** | 较高的温度（°C 或 °F）
| native_templow | float | `None` | 较低的日间温度（°C 或 °F）
| native_wind_gust_speed | int | `None` | 风阵速度（米/秒，公里/小时，英里/小时，英尺/秒或节）。
| native_wind_speed | int | `None` | 风速（米/秒，公里/小时，英里/小时，英尺/秒或节）。
| precipitation_probability | int | `None` | 降水概率（%）。
| uv_index | float | `None` | 紫外线指数。
| wind_bearing | float 或 string | `None` | 风向的方位角（度）或 1-3 个字母的方位方向。

预报数据需要遵循与属性相同的计量单位，适用时。

### 获取天气预报的方法

这些方法用于从 API 获取预报。

```python
class MyWeatherEntity(WeatherEntity):
    """表示一个天气实体。"""

    async def async_forecast_daily(self) -> list[Forecast] | None:
        """返回以本地单位表示的每日预报。
        
        仅在设置了 `WeatherEntityFeature.FORECAST_DAILY` 时实现此方法
        """

    async def async_forecast_twice_daily(self) -> list[Forecast] | None:
        """返回以本地单位表示的每日两次的预报。
        
        仅在设置了 `WeatherEntityFeature.FORECAST_TWICE_DAILY` 时实现此方法
        """

    async def async_forecast_hourly(self) -> list[Forecast] | None:
        """返回以本地单位表示的每小时预报。
        
        仅在设置了 `WeatherEntityFeature.FORECAST_HOURLY` 时实现此方法
        """
```

### 更新天气预报

强烈建议天气实体缓存获取的天气预报，以避免不必要的 API 访问。

当更新的天气预报可用时，天气预报缓存应被作废，并应等待调用 `WeatherEntity.async_update_listeners` 方法，以向任何活动订阅者推送更新的天气预报。如果有活动监听器，`WeatherEntity.async_update_listeners` 将调用相应的 `async_forecast_xxx` 方法。如果没有活动监听器，`WeatherEntity.async_update_listeners` 就不会调用任何 `async_forecast_xxx` 方法。