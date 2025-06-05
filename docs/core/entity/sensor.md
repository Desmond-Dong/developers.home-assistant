---
title: 传感器实体
sidebar_label: 传感器
---

传感器是一个只读实体，它提供了一些信息。信息具有一个值以及可选的测量单位。从 [`homeassistant.components.sensor.SensorEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/sensor/__init__.py) 派生实体平台。

## 属性

:::tip
属性应该始终只从内存返回信息，而不做输入/输出（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称 | 类型 | 默认 | 描述
| ---- | ---- | ------- | -----------
| device_class | <code>SensorDeviceClass &#124; None</code> | `None` | 传感器的类型。
| last_reset | <code>datetime.datetime &#124; None</code> | `None` | 像电力使用表、燃气表、水表等累积传感器初始化的时间。如果初始化时间未知，设置为 `None`。请注意，`last_reset` 属性返回的 `datetime.datetime` 将在实体状态属性更新时转换为 ISO 8601 格式的字符串。当更改 `last_reset` 时，`state` 必须是有效数字。
| native_unit_of_measurement | <code>str &#124; None</code> | `None` | 传感器值表示的测量单位。如果 `native_unit_of_measurement` 为 °C 或 °F，且其 `device_class` 为温度，则传感器的 `unit_of_measurement` 为用户配置的首选温度单位，传感器的 `state` 在可选单位转换后将是 `native_value`。如果提供了 [单位转换](/docs/internationalization/core#unit-of-measurement-of-entities)，则不应定义 `native_unit_of_measurement`。
| native_value | <code>str &#124; int &#124; float &#124; date &#124; datetime &#124; Decimal &#124; None</code> | **必需** | 传感器在其 `native_unit_of_measurement` 中的值。使用 `device_class` 可能会限制此属性返回的类型。
| options | <code>list[str] &#124; None</code> | `None` | 在传感器提供文本状态的情况下，此属性可用于提供可能的状态列表。需要设置 `enum` 设备类。不可与 `state_class` 或 `native_unit_of_measurement` 结合使用。
| state_class | <code>SensorStateClass &#124; str &#124; None</code> | `None` | 状态类型。如果不是 `None`，则假定传感器为数值类型，并将作为前端的折线图显示，而不是离散值。
| suggested_display_precision | <code>int &#124; None</code> | `None` | 显示时应使用的传感器状态中的小数位数。
| suggested_unit_of_measurement | <code>str &#124; None</code> | `None` | 用于传感器状态的测量单位。对于具有 `unique_id` 的传感器，这将用作初始测量单位，用户可以覆盖。对于没有 `unique_id` 的传感器，这将是传感器状态的测量单位。此属性旨在被集成用来覆盖自动单位转换规则，例如，使温度传感器始终显示为 `°C`，无论配置的单位系统是否偏好 `°C` 或 `°F`，或者使距离传感器即使在配置的单位系统为公制时也始终显示为英里。

:::tip
对于传感器实体，不要添加 `extra_state_attributes`，而是创建一个额外的传感器实体。不变的属性只在数据库中保存一次。如果 `extra_state_attributes` 和传感器值都频繁变化，这可能会迅速增加数据库的大小。
:::

### 可用的设备类

如果指定设备类，则传感器实体也需要返回正确的测量单位。

| 常量 | 支持的单位 | 描述
| ---- | ---- | -----------
| `SensorDeviceClass.APPARENT_POWER` | VA | 表观功率
| `SensorDeviceClass.AQI` | None | 空气质量指数
| `SensorDeviceClass.AREA` | m², cm², km², mm², in², ft², yd², mi², ac, ha | 面积
| `SensorDeviceClass.ATMOSPHERIC_PRESSURE` | cbar, bar, hPa, mmHG, inHg, kPa, mbar, Pa, psi | 大气压力
| `SensorDeviceClass.BATTERY` | % | 剩余电池百分比
| `SensorDeviceClass.BLOOD_GLUCOSE_CONCENTRATION` | mg/dL, mmol/L | 血糖浓度
| `SensorDeviceClass.CO2` | ppm | 二氧化碳浓度
| `SensorDeviceClass.CO` | ppm | 一氧化碳浓度
| `SensorDeviceClass.CONDUCTIVITY` | S/cm, mS/cm, µS/cm | 导电率
| `SensorDeviceClass.CURRENT` | A, mA | 电流
| `SensorDeviceClass.DATA_RATE` | bit/s, kbit/s, Mbit/s, Gbit/s, B/s, kB/s, MB/s, GB/s, KiB/s, MiB/s, GiB/s | 数据速率
| `SensorDeviceClass.DATA_SIZE` | bit, kbit, Mbit, Gbit, B, kB, MB, GB, TB, PB, EB, ZB, YB, KiB, MiB, GiB, TiB, PiB, EiB, ZiB, YiB | 数据大小
| `SensorDeviceClass.DATE` | | 日期。要求 `native_value` 是一个 Python `datetime.date` 对象，或 `None`。
| `SensorDeviceClass.DISTANCE` | km, m, cm, mm, mi, nmi, yd, in | 通用距离
| `SensorDeviceClass.DURATION` | d, h, min, s, ms, µs | 时间段。仅因时间流逝不应更新。设备或服务需要提供一个新的数据点以进行更新。
| `SensorDeviceClass.ENERGY` | J, kJ, MJ, GJ, mWh, Wh, kWh, MWh, GWh, TWh, cal, kcal, Mcal, Gcal | 能量，此设备类应当用于表示能耗的传感器，例如电表。表示单位时间内的_功率_。不要与 `power` 混淆。
| `SensorDeviceClass.ENERGY_DISTANCE` | kWh/100km, Wh/km, mi/kWh, km/kWh | 每单位距离的能量，此设备类应当用于表示按距离的能耗，例如电动车消耗的电能量。
| `SensorDeviceClass.ENERGY_STORAGE` | J, kJ, MJ, GJ, mWh, Wh, kWh, MWh, GWh, TWh, cal, kcal, Mcal, Gcal | 储存的能量，此设备类应当用于表示储存的能量的传感器，例如当前电池中储存的电能量或电池的容量。表示单位时间内的_功率_。不要与 `power` 混淆。
| `SensorDeviceClass.ENUM` | | 传感器具有有限的一组（非数值）状态。使用此设备类时，`options` 属性必须设置为可能状态的列表。
| `SensorDeviceClass.FREQUENCY` | Hz, kHz, MHz, GHz | 频率
| `SensorDeviceClass.GAS` | L, m³, ft³, CCF | 气体体积。气体消耗量按能量以千瓦时计而不是按体积计算，应归类为能量。
| `SensorDeviceClass.HUMIDITY` | % | 相对湿度
| `SensorDeviceClass.ILLUMINANCE` | lx | 光照水平
| `SensorDeviceClass.IRRADIANCE` | W/m², BTU/(h⋅ft²) | 辐照度
| `SensorDeviceClass.MOISTURE` | % | 湿度
| `SensorDeviceClass.MONETARY` | [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) | 带货币的货币价值。
| `SensorDeviceClass.NITROGEN_DIOXIDE` | µg/m³ | 二氧化氮浓度
| `SensorDeviceClass.NITROGEN_MONOXIDE` | µg/m³ | 一氧化氮浓度
| `SensorDeviceClass.NITROUS_OXIDE` | µg/m³ | 硝酸氧化物浓度
| `SensorDeviceClass.OZONE` | µg/m³ | 臭氧浓度
| `SensorDeviceClass.PH` | None | 溶液的潜在氢（pH）
| `SensorDeviceClass.PM1` | µg/m³ | 小于1微米的颗粒物浓度
| `SensorDeviceClass.PM25` | µg/m³ | 小于2.5微米的颗粒物浓度
| `SensorDeviceClass.PM10` | µg/m³ | 小于10微米的颗粒物浓度
| `SensorDeviceClass.POWER` | mW, W, kW, MW, GW, TW | 功率。
| `SensorDeviceClass.POWER_FACTOR` | %, None | 功率因数
| `SensorDeviceClass.PRECIPITATION` | cm, in, mm | 累积降水量
| `SensorDeviceClass.PRECIPITATION_INTENSITY` | in/d, in/h, mm/d, mm/h | 降水强度
| `SensorDeviceClass.PRESSURE` | cbar, bar, hPa, mmHg, inHg, kPa, mbar, Pa, psi | 压力。
| `SensorDeviceClass.REACTIVE_ENERGY` | varh, kvarh | 无功能量
| `SensorDeviceClass.REACTIVE_POWER` | var, kvar | 无功功率
| `SensorDeviceClass.SIGNAL_STRENGTH` | dB, dBm | 信号强度
| `SensorDeviceClass.SOUND_PRESSURE` | dB, dBA | 声压
| `SensorDeviceClass.SPEED` | ft/s, in/d, in/h, in/s, km/h, kn, m/s, mph, mm/d, mm/s | 通用速度
| `SensorDeviceClass.SULPHUR_DIOXIDE` | µg/m³ | 二氧化硫浓度
| `SensorDeviceClass.TEMPERATURE` | °C, °F, K | 温度。
| `SensorDeviceClass.TIMESTAMP` | | 时间戳。要求 `native_value` 返回一个带有时区信息的 Python `datetime.datetime` 对象，或 `None`。
| `SensorDeviceClass.VOLATILE_ORGANIC_COMPOUNDS` | µg/m³, mg/m³ | 挥发性有机化合物浓度
| `SensorDeviceClass.VOLATILE_ORGANIC_COMPOUNDS_PARTS` | ppm, ppb | 挥发性有机化合物的比率
| `SensorDeviceClass.VOLTAGE` | V, mV, µV, kV, MV | 电压
| `SensorDeviceClass.VOLUME` | L, mL, gal, fl. oz., m³, ft³, CCF | 通用体积，此设备类应用于表示消耗的传感器，例如车辆消耗的燃料量。
| `SensorDeviceClass.VOLUME_FLOW_RATE` | m³/h, m³/s, ft³/min, L/h, L/min, L/s, gal/min, mL/s | 体积流量，此设备类应用户表示某些体积的流动，例如瞬间消耗的水量。
| `SensorDeviceClass.VOLUME_STORAGE` | L, mL, gal, fl. oz., m³, ft³, CCF | 通用存储体积，此设备类应用户表示存储的体积，例如油箱中存储的燃料量。
| `SensorDeviceClass.WATER` | L, gal, m³, ft³, CCF | 水消费
| `SensorDeviceClass.WEIGHT` | kg, g, mg, µg, oz, lb, st | 通用质量；使用 `weight` 而不是 `mass` 以适应日常语言。
| `SensorDeviceClass.WIND_DIRECTION` | ° | 风向，如果风速为0或太低以至于无法准确测量风向，则应设置为 `None`。
| `SensorDeviceClass.WIND_SPEED` | ft/s, km/h, kn, m/s, mph | 风速

### 可用的状态类

:::caution
为传感器仔细选择状态类。在大多数情况下，应选择状态类 `SensorStateClass.MEASUREMENT` 或没有 `last_reset` 的状态类 `SensorStateClass.TOTAL`，详情见下文 [如何选择 `state_class` 和 `last_reset`](#how-to-choose-state_class-and-last_reset)。
:::

| 类型 | 描述
| ---- | -----------
| `SensorStateClass.MEASUREMENT` | 状态表示_当前的测量值_，而不是统计数据或未来的预测。例如，该类应该被分类为 `SensorStateClass.MEASUREMENT` 的有：当前温度、湿度或电力。 不该分类为 `SensorStateClass.MEASUREMENT` 的例子：明天的预测温度、昨天的能耗或任何其他不包括_当前_测量的内容。对于受支持的传感器，每小时的最小、最大和平均传感器读数的统计数据每5分钟更新一次。
| `SensorStateClass.MEASUREMENT_ANGLE` | 类似于上述 `SensorStateClass.MEASUREMENT`，状态表示_当前的测量值_，用于以度（`°`）表示的角度。例如，当前风向应分类为 `SensorStateClass.MEASUREMENT_ANGLE`。
| `SensorStateClass.TOTAL` | 状态表示一种总量，可以增加或减少，例如净能量计。自传感器首次添加以来的累积增长或减少的统计数据每5分钟更新一次。此状态类不应用于绝对值更有趣的传感器，而应使用状态类为 `SensorStateClass.MEASUREMENT`，例如剩余电池容量或 CPU 负载。
| `SensorStateClass.TOTAL_INCREASING` | 类似于 `SensorStateClass.TOTAL`，但状态表示单调递增的正总量，定期从0重新开始计数，例如每日消耗的气体量、每周水消耗或生命周期的能量消耗。自传感器首次添加以来的累积增长的统计数据每5分钟更新一次。减少的值被视为新的计量周期的开始或计量的更换。

### 实体选项

传感器可以由用户配置，这通过将传感器实体选项存储在传感器的实体注册条目中完成。

| 选项 | 描述
| ------ | -----------
| `unit_of_measurement` | 传感器的测量单位可以为 `SensorDeviceClass.PRESSURE` 或 `SensorDeviceClass.TEMPERATURE` 的传感器覆盖。

## 恢复传感器状态

恢复状态的传感器在重启或重新加载后不应扩展 `RestoreEntity`，因为这不存储 `native_value`，而是存储可能已被传感器基本实体修改的 `state`。恢复状态的传感器应扩展 `RestoreSensor`，并在 `async_added_to_hass` 中调用 `await self.async_get_last_sensor_data` 以访问存储的 `native_value` 和 `native_unit_of_measurement`。

## 长期统计

Home Assistant 对于存储传感器作为长期统计具有支持，只要实体具有正确的属性。要选择统计，传感器必须具有 `state_class` 设置为有效状态类之一：`SensorStateClass.MEASUREMENT`、`SensorStateClass.TOTAL` 或 `SensorStateClass.TOTAL_INCREASING`。对于某些设备类，统计单位会被归一化以便可以在单一图中绘制多个传感器。

### 不表示总量的实体

Home Assistant 跟踪统计期间的最小、最大和平均值。`state_class` 属性必须设置为 `SensorStateClass.MEASUREMENT`，且 `device_class` 不能是 `SensorDeviceClass.DATE`、`SensorDeviceClass.ENUM`、`SensorDeviceClass.ENERGY`、`SensorDeviceClass.GAS`、`SensorDeviceClass.MONETARY`、`SensorDeviceClass.TIMESTAMP`、`SensorDeviceClass.VOLUME` 或 `SensorDeviceClass.WATER`。

### 表示总量的实体

跟踪总量的实体具有可选周期性重置的值，例如本月的能耗、今天的能源生产、过去一周用于加热房屋的颗粒物重量或股票投资组合的年度增长。第一次编制统计时传感器的值用作初始零点。

#### 如何选择 `state_class` 和 `last_reset`

建议在可能的情况下使用状态类 `SensorStateClass.TOTAL` 而不带 `last_reset`，状态类 `SensorStateClass.TOTAL_INCREASING` 或 `SensorStateClass.TOTAL` 与 `last_reset` 仅在状态类 `SensorStateClass.TOTAL` 不适用于该传感器时使用。

示例：

- 传感器的值永不重置，例如终生总能耗或生产：状态类 `SensorStateClass.TOTAL`，`last_reset` 未设置或设置为 `None`。
- 传感器的值可能重置为0，并且其值只能增加：状态类 `SensorStateClass.TOTAL_INCREASING`。示例：与计费周期对齐的能耗，例如每月，断开连接时电表重置为0。
- 传感器的值可能重置为0，其值可以增加也可以减少：状态类 `SensorStateClass.TOTAL`，`last_reset` 在值重置时更新。示例：与计费周期对齐的净能耗，例如每月。
- 传感器状态在每次状态更新时重置，例如每分钟更新一次的传感器，显示过去一分钟的能耗：状态类 `SensorStateClass.TOTAL`，`last_reset` 在每次状态变化时更新。

#### 状态类 `SensorStateClass.TOTAL`

对于状态类为 `SensorStateClass.TOTAL` 的传感器，`last_reset` 属性可以选择性设置，以手动控制计量周期。实体首次添加到 Home Assistant 时的状态用作初始零点。当 `last_reset` 更改时，零点将设置为0。如果没有设置 `last_reset`，则首次添加时传感器的值用作计算 `sum` 统计的零点。

换句话说：更新统计时的逻辑是用当前状态与先前状态之间的差值更新总和列，除非 `last_reset` 已被更改，在这种情况下，不添加任何内容。

没有 `last_reset` 的 `SensorStateClass.TOTAL` 状态类的示例：

| t                      | state  | sum    | sum_increase | sum_decrease
| :--------------------- | -----: | -----: | -----------: | -----------:
|   2021-08-01T13:00:00  |  1000  |     0  |           0  |           0
|   2021-08-01T14:00:00  |  1010  |    10  |          10  |           0
|   2021-08-01T15:00:00  |     0  | -1000  |          10  |        1010
|   2021-08-01T16:00:00  |     5  |  -995  |          15  |        1010

带有 `last_reset` 的 `SensorStateClass.TOTAL` 状态类的示例：

| t                      | state  | last_reset          | sum    | sum_increase | sum_decrease
| :--------------------- | -----: | ------------------- | -----: | -----------: | -----------:
|   2021-08-01T13:00:00  |  1000  | 2021-08-01T13:00:00 |     0  |           0  |           0
|   2021-08-01T14:00:00  |  1010  | 2021-08-01T13:00:00 |    10  |          10  |           0
|   2021-08-01T15:00:00  |  1005  | 2021-08-01T13:00:00 |     5  |          10  |           5
|   2021-08-01T16:00:00  |     0  | 2021-09-01T16:00:00 |     5  |          10  |           5
|   2021-08-01T17:00:00  |     5  | 2021-09-01T16:00:00 |    10  |          15  |           5

状态类 `SensorStateClass.TOTAL` 的示例，其中新计量周期开始时的初始状态不是0，但使用0作为零点：

| t                      | state  | last_reset          | sum    | sum_increase | sum_decrease
| :--------------------- | -----: | ------------------- | -----: | -----------: | -----------:
|   2021-08-01T13:00:00  |  1000  | 2021-08-01T13:00:00 |     0  |           0  |           0
|   2021-08-01T14:00:00  |  1010  | 2021-08-01T13:00:00 |    10  |          10  |           0
|   2021-08-01T15:00:00  |  1005  | 2021-08-01T13:00:00 |     5  |          10  |           5
|   2021-08-01T16:00:00  |     5  | 2021-09-01T16:00:00 |    10  |          15  |           5
|   2021-08-01T17:00:00  |    10  | 2021-09-01T16:00:00 |    15  |          20  |           5

#### 状态类 `SensorStateClass.TOTAL_INCREASING`

对于状态类为 `SensorStateClass.TOTAL_INCREASING` 的传感器，减少的值被解释为新的计量周期的开始或计量的替换。集成确保在计算来自传感器的值时，不能出现错误降低是重要的，并存在测量噪声。存在一定的容忍度，状态变化之间的减少 < 10% 将不会触发新的计量周期。此状态类对气体表、电表、水表等很有用。在传感器读数减少时的值将不用于计算 `sum` 统计，相反零点将设置为0。

换句话说：更新统计时的逻辑是用当前状态与先前状态之间的差值更新总和列，除非该差值为负数，在这种情况下，不添加任何内容。

状态类 `SensorStateClass.TOTAL_INCREASING` 的示例：

| t                      | state  | sum
| :--------------------- | -----: | ---:
|   2021-08-01T13:00:00  |  1000  |   0
|   2021-08-01T14:00:00  |  1010  |  10
|   2021-08-01T15:00:00  |     0  |  10
|   2021-08-01T16:00:00  |     5  |  15

状态类 `SensorStateClass.TOTAL_INCREASING` 的示例，其中传感器未重置为0：

| t                      | state  | sum
| :--------------------- | -----: | ---:
|   2021-08-01T13:00:00  |  1000  |   0
|   2021-08-01T14:00:00  |  1010  |  10
|   2021-08-01T15:00:00  |     5  |  15
|   2021-08-01T16:00:00  |    10  |  20