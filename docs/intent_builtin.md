---
title: "内置意图"
toc_max_heading_level: 2
---

import intents from '!!yaml-loader!../intents/intents.yaml';

以下意图是**支持**的：

<ul>
<li>
<>
{
  Object.entries(intents)
  .filter(([intent, info]) => info["supported"])
  .map(([intent, info]) => intent)
  .join(", ")
}
</>
</li>
</ul>

以下意图是**已弃用**的：

 * HassOpenCover, HassCloseCover, HassToggle, HassHumidifierSetpoint, HassHumidifierMode, HassShoppingListLastItems

**槽位**

对于 *HassTurnOn* 和 *HassTurnOff*，*槽位*是可选的。

可能的槽位组合是：

| 槽位组合               | 示例                             |
| --------------------- | ---------------------------------|
| 仅名称                 | 餐桌灯                           |
| 仅区域                 | 厨房                             |
| 区域和名称             | 客厅阅读灯                       |
| 区域和域               | 厨房灯                           |
| 区域和设备类型         | 浴室湿度                         |
| 设备类型和域           | 二氧化碳传感器                   |


## 支持的意图

<>
{
  Object.entries(intents)
  .filter(([intent, info]) => info["supported"])
  .map(
    ([intent, info]) =>
      <>
        <h3>{intent}</h3>
        <p>{info.description}</p>
        {info.slots &&
          (<b>槽位</b>) && (
          <ul>
            {Object.entries(info.slots).map(([slot, slotInfo]) => (
              <li>
                <b>{slot}</b> - {slotInfo.description + (slotInfo.required ? " (必填)" : "")}
              </li>
            ))}
          </ul>
        )}
        <p><small>
          <a href={`https://www.home-assistant.io/integrations/${info.domain}`}>由 <code>{info.domain}</code> 集成提供。</a>
        </small></p>
      </>
  )
}
</>

## 已弃用的意图

这些是旧意图，不支持模板匹配句子，并计划被移除或替换。


### HassOpenCover

_已弃用；请改用 `HassTurnOn`。_

打开遮盖。

| 槽位名称 | 类型 | 必填 | 描述
| --------- | ---- | ---- | -----------
| name      | string | 是   | 要打开的遮盖实体的名称。

### HassCloseCover

_已弃用；请改用 `HassTurnOff`。_

关闭遮盖。

| 槽位名称 | 类型 | 必填 | 描述
| --------- | ---- | ---- | -----------
| name      | string | 是   | 要关闭的遮盖实体的名称。

### HassToggle

切换实体的状态。

| 槽位名称 | 类型 | 必填 | 描述
| --------- | ---- | ---- | -----------
| name      | string | 是   | 要切换的实体的名称。

### HassHumidifierSetpoint

设置目标湿度。

| 槽位名称 | 类型           | 必填 | 描述
| --------- | -------------- | ---- | -----------
| name      | string         | 是   | 要控制的实体的名称。
| humidity  | integer, 0-100 | 是   | 要设置的目标湿度。

### HassHumidifierMode

如果加湿器支持，设置加湿器模式。

| 槽位名称 | 类型   | 必填 | 描述
| --------- | ------ | ---- | -----------
| name      | string | 是   | 要控制的实体的名称。
| mode      | string | 是   | 要切换到的模式。

### HassShoppingListLastItems

列出购物清单上的最后 5 个项目。

_此意图没有槽位。_



[该页面是基于意图库自动生成的。](https://github.com/home-assistant/intents/blob/main/intents.yaml)