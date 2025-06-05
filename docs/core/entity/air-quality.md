---
title: 空气质量实体
sidebar_label: 空气质量
---

## 属性

:::caution 已弃用
空气质量实体已经弃用，且不应被使用。请改用
单独的传感器进行这些测量。

仍依赖于空气质量实体的集成应进行迁移。
:::

:::caution
空气质量实体不支持[属性实现](../entity.md#entity-class-or-instance-attributes)的属性简写。
:::


| 名称 | 类型 | 默认值 | 描述
| ---- | ---- | ------- | -----------
| particulate_matter_2_5 | <code>str &#124; int &#124; float &#124; None</code> | **必填** | 颗粒物 2.5 (\<= 2.5 μm) 的水平。
| particulate_matter_10 | <code>str &#124; int &#124; float &#124; None</code> | `None` | 颗粒物 10 (\<= 10 μm) 的水平。
| particulate_matter_0_1 | <code>str &#124; int &#124; float &#124; None</code> | `None` | 颗粒物 0.1 (\<= 0.1 μm) 的水平。
| air_quality_index | <code>str &#124; int &#124; float &#124; None</code> | `None` | 空气质量指数 (AQI)。
| ozone | <code>str &#124; int &#124; float &#124; None</code> | `None` | O3 (臭氧) 的水平。
| carbon_monoxide | <code>str &#124; int &#124; float &#124; None</code> | `None` | CO (一氧化碳) 的水平。
| carbon_dioxide | <code>str &#124; int &#124; float &#124; None</code> | `None` | CO2 (二氧化碳) 的水平。
| sulphur_dioxide | <code>str &#124; int &#124; float &#124; None</code> | `None` | SO2 (二氧化硫) 的水平。
| nitrogen_oxide | <code>str &#124; int &#124; float &#124; None</code> | `None` | N2O (氮氧化物) 的水平。
| nitrogen_monoxide | <code>str &#124; int &#124; float &#124; None</code> | `None` | NO (一氧化氮) 的水平。
| nitrogen_dioxide | <code>str &#124; int &#124; float &#124; None</code> | `None` | NO2 (二氧化氮) 的水平。

属性必须符合 `unit_system` 中定义的单位。