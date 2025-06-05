---
title: 数字实体
sidebar_label: 数字
---

`number` 是一种实体，允许用户向集成输入任意值。从 [`homeassistant.components.number.NumberEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/number/__init__.py) 派生实体平台。

## 属性

:::tip
属性应始终仅从内存中返回信息，而不应进行 I/O 操作（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称 | 类型 | 默认值 | 描述
| ---- | ---- | ------- | -----------
| device_class | string | `None` | 数字类型。
| mode | string | `auto` | 定义数字在 UI 中的显示方式。建议使用默认的 `auto`。可以为 `box` 或 `slider` 以强制设置显示模式。
| native_max_value | float | 100 | 在数字的 `native_unit_of_measurement` 中接受的最大值（包括）。
| native_min_value | float | 0 | 在数字的 `native_unit_of_measurement` 中接受的最小值（包括）。
| native_step | float | **见下文** | 定义值的分辨率，即数字的最小增量或减量。| native_unit_of_measurement | string | `None` | 表示数字值的计量单位。如果 `native_unit_of_measurement` 为 °C 或 °F，且其 `device_class` 为温度，则数字的 `unit_of_measurement` 将是用户配置的首选温度单位，数字的 `state` 将是在可选单位转换后的 `native_value`。
| native_value | float | **必需** | 数字在 `native_unit_of_measurement` 中的值。
| native_unit_of_measurement | string | None | 表示传感器值的计量单位。如果 `native_unit_of_measurement` 为 °C 或 °F，且其 `device_class` 为温度，则传感器的 `unit_of_measurement` 将是用户配置的首选温度单位，传感器的 `state` 将是在可选单位转换后的 `native_value`。如果提供了 [单位转换](/docs/internationalization/core#unit-of-measurement-of-entities)，则不应定义 `native_unit_of_measurement`。

其他适用于所有实体的属性，如 `icon`、`name` 等也是适用的。

默认的步长值根据范围（最大值 - 最小值）动态选择。如果 max_value 和 min_value 之间的差大于 1.0，则默认步长为 1.0。否则，如果范围较小，则步长会通过 10 迭代地除以 10，直到它小于范围。

### 可用的设备类别

如果指定设备类别，则您的数字实体还需要返回正确的计量单位。

| 常量 | 支持的单位 | 描述
| ---- | ---- | -----------
| `NumberDeviceClass.APPARENT_POWER` | VA | 视在功率
| `NumberDeviceClass.AQI` | None | 空气质量指数
| `NumberDeviceClass.AREA` | m², cm², km², mm², in², ft², yd², mi², ac, ha | 面积
| `NumberDeviceClass.ATMOSPHERIC_PRESSURE` | cbar, bar, hPa, mmHG, inHg, kPa, mbar, Pa, psi | 大气压
| `NumberDeviceClass.BATTERY` | % | 剩余电池百分比
| `NumberDeviceClass.BLOOD_GLUCOSE_CONCENTRATION` | mg/dL, mmol/L | 血糖浓度
| `NumberDeviceClass.CO2` | ppm | 二氧化碳浓度。
| `NumberDeviceClass.CO` | ppm | 一氧化碳浓度。
| `NumberDeviceClass.CONDUCTIVITY` | S/cm, mS/cm, µS/cm | 导电性
| `NumberDeviceClass.CURRENT` | A, mA | 电流
| `NumberDeviceClass.DATA_RATE` | bit/s, kbit/s, Mbit/s, Gbit/s, B/s, kB/s, MB/s, GB/s, KiB/s, MiB/s, GiB/s | 数据速率
| `NumberDeviceClass.DATA_SIZE` | bit, kbit, Mbit, Gbit, B, kB, MB, GB, TB, PB, EB, ZB, YB, KiB, MiB, GiB, TiB, PiB, EiB, ZiB, YiB | 数据大小
| `NumberDeviceClass.DISTANCE` | km, m, cm, mm, mi, nmi, yd, in | 通用距离
| `NumberDeviceClass.DURATION` | d, h, min, s, ms, µs | 时间段。 不应仅因时间流逝而更新。设备或服务需要提供新的数据点以进行更新。
| `NumberDeviceClass.ENERGY` | J, kJ, MJ, GJ, mWh, Wh, kWh, MWh, GWh, TWh, cal, kcal, Mcal, Gcal | 能量，此设备类别应用于表示能量消耗，例如电表。表示 _功率_ 随 _时间_ 的变化。与 `power` 不要混淆。
| `NumberDeviceClass.ENERGY_DISTANCE` | kWh/100km, Wh/km, mi/kWh, km/kWh | 每距离的能量，此设备类别应用于表示按距离计算的能量消耗，例如电动车消耗的电能。
| `NumberDeviceClass.ENERGY_STORAGE` | J, kJ, MJ, GJ, mWh, Wh, kWh, MWh, GWh, TWh, cal, kcal, Mcal, Gcal | 储存的能量，此设备类别应用于表示存储的能量，例如当前在电池中存储的电能或电池的容量。表示 _功率_ 随 _时间_ 的变化。与 `power` 不要混淆。
| `NumberDeviceClass.FREQUENCY` | Hz, kHz, MHz, GHz | 频率
| `NumberDeviceClass.GAS` | L, m³, ft³, CCF | 气体体积。气体消耗应以能量 kWh 而不是体积来衡量，应归类为能源。
| `NumberDeviceClass.HUMIDITY` | % | 相对湿度
| `NumberDeviceClass.ILLUMINANCE` | lx | 光照水平
| `NumberDeviceClass.IRRADIANCE` | W/m², BTU/(h⋅ft²) | 辐照度
| `NumberDeviceClass.MOISTURE` | % | 湿度
| `NumberDeviceClass.MONETARY` | [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) | 带有货币的货币价值。
| `NumberDeviceClass.NITROGEN_DIOXIDE` | µg/m³ | 二氧化氮浓度
| `NumberDeviceClass.NITROGEN_MONOXIDE` | µg/m³ | 一氧化氮浓度
| `NumberDeviceClass.NITROUS_OXIDE` | µg/m³ | 一氧化二氮浓度
| `NumberDeviceClass.OZONE` | µg/m³ | 臭氧浓度
| `NumberDeviceClass.PH` | None | 水溶液的氢离子浓度（pH）
| `NumberDeviceClass.PM1` | µg/m³ | 小于 1 微米的颗粒物浓度
| `NumberDeviceClass.PM25` | µg/m³ | 小于 2.5 微米的颗粒物浓度
| `NumberDeviceClass.PM10` | µg/m³ | 小于 10 微米的颗粒物浓度
| `NumberDeviceClass.POWER` | mW, W, kW, MW, GW, TW | 功率。
| `NumberDeviceClass.POWER_FACTOR` | %, None | 功率因数
| `NumberDeviceClass.PRECIPITATION` | cm, in, mm | 累积降水量
| `NumberDeviceClass.PRECIPITATION_INTENSITY` | in/d, in/h, mm/d, mm/h | 降水强度
| `NumberDeviceClass.PRESSURE` | cbar, bar, hPa, mmHg, inHg, kPa, mbar, Pa, psi | 压力。
| `NumberDeviceClass.REACTIVE_ENERGY` | varh, kvarh | 无功能量
| `NumberDeviceClass.REACTIVE_POWER` | var, kvar | 无功功率
| `NumberDeviceClass.SIGNAL_STRENGTH` | dB, dBm | 信号强度
| `NumberDeviceClass.SOUND_PRESSURE` | dB, dBA | 声压
| `NumberDeviceClass.SPEED` | ft/s, in/d, in/h, in/s, km/h, kn, m/s, mph, mm/d, mm/s | 通用速度
| `NumberDeviceClass.SULPHUR_DIOXIDE` | µg/m³ | 二氧化硫浓度
| `NumberDeviceClass.TEMPERATURE` | °C, °F, K | 温度。
| `NumberDeviceClass.VOLATILE_ORGANIC_COMPOUNDS` | µg/m³, mg/m³ | 挥发性有机化合物浓度
| `NumberDeviceClass.VOLATILE_ORGANIC_COMPOUNDS_PARTS` | ppm, ppb | 挥发性有机化合物的比例
| `NumberDeviceClass.VOLTAGE` | V, mV, µV, kV, MV | 电压
| `NumberDeviceClass.VOLUME` | L, mL, gal, fl. oz., m³, ft³, CCF | 通用体积，此设备类别应用于表示消费，例如汽车消耗的燃料量。
| `NumberDeviceClass.VOLUME_FLOW_RATE` | m³/h, ft³/min, L/min, gal/min, mL/s | 体积流量，此设备类别应用于表示某种体积的流动，例如瞬时消耗的水量。
| `NumberDeviceClass.VOLUME_STORAGE` | L, mL, gal, fl. oz., m³, ft³, CCF | 通用存储体积，此设备类别应用于表示存储的体积，例如油箱中的燃料量。
| `NumberDeviceClass.WATER` | L, gal, m³, ft³, CCF | 水消耗
| `NumberDeviceClass.WEIGHT` | kg, g, mg, µg, oz, lb, st | 通用质量； `weight` 用于替代 `mass` 以符合日常语言。
| `NumberDeviceClass.WIND_DIRECTION` | ° | 风向
| `NumberDeviceClass.WIND_SPEED` | ft/s, km/h, kn, m/s, mph | 风速

## 恢复数字状态

在重启或重载后恢复状态的数字不应扩展 `RestoreEntity`，因为那并不存储 `native_value`，而是存储可能已被数字基础实体修改的 `state`。恢复状态的数字应扩展 `RestoreNumber`，并在 `async_added_to_hass` 中调用 `await self.async_get_last_number_data` 以访问存储的 `native_min_value`、`native_max_value`、`native_step`、`native_unit_of_measurement` 和 `native_value`。

## 方法

### 设置值

当用户或自动化想要更新值时调用。

```python
class MyNumber(NumberEntity):
    # 实现这两个方法之一。

    def set_native_value(self, value: float) -> None:
        """更新当前值。"""

    async def async_set_native_value(self, value: float) -> None:
        """更新当前值。"""