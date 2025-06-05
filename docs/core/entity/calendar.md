---
title: 日历实体
sidebar_label: 日历
---

日历实体是表示一组具有开始和结束日期和/或时间的事件的实体，有助于自动化。日历实体派生自 [`homeassistant.components.calendar.CalendarEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/calendar/__init__.py)。

日历集成应兼容 rfc5545，并可以选择支持按照 rfc5546 中建立的模式创建事件。支持重复事件的集成负责处理重复事件的扩展，例如在返回扩展系列中的事件作为单独事件的服务或 API 中。

## 属性

:::tip
属性应始终仅从内存中返回信息，而不进行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称  | 类型          | 默认               | 描述                                             |
| ----- | ------------- | ------------------- | ------------------------------------------------- |
| event | <code>CalendarEvent &#124; None</code> | **必填** | 当前或下一个即将到来的 `CalendarEvent` 或 `None`。 |

### 状态

`CalendarEntity` 的状态类似于二进制传感器，反映是否有活动事件：

| 常量        | 描述                                 |
| ----------- | ----------------------------------- |
| `STATE_ON`  | 日历有一个活动事件。                   |
| `STATE_OFF` | 日历没有活动事件。                     |


日历实体具有一个 `event` 属性，返回当前或下一个即将到来的 `CalendarEvent`，用于确定状态。日历实体实现负责确定下一个即将发生的事件，包括正确排序事件并解释在 Home Assistant 时区中的全天事件。实体应调用 `homeassistant.util.dt.now` 来获取当前时间，该时间具有设置为 HomeAssistant 时区的 `tzinfo` 值，或检查 `homeassistant.components.util.dt.DEFAULT_TIMEZONE`

## 支持的特性

支持的特性通过使用 `CalendarEntityFeature` 枚举中的值定义，并通过按位或（`|`）运算符合并。

| 值                   | 描述                                                        |
| -------------------- | ---------------------------------------------------------- |
| `CREATE_EVENT`       | 实体实现方法以允许创建事件。                                     |
| `DELETE_EVENT`       | 实体实现方法以允许删除事件。                                     |
| `UPDATE_EVENT`       | 实体实现方法以允许更新事件。                                     |

## 方法

### 获取事件

日历实体可以返回在特定时间范围内发生的事件。实现者的一些注意事项：

- `start_date` 是下限，适用于事件的 `end`（不包括）。它具有 Home Assistant 本地时区的 `tzinfo`。
- `end_date` 是上限，适用于事件的 `start`（不包括）。它具有与 `start_date` 相同的 `tzinfo`。
- 重复事件应扁平化并作为单独的 `CalendarEvent` 返回。

日历实体负责按顺序返回事件，包括正确排序全天事件。全天事件应按在 Home Assistant 时区的午夜开始排序（例如，从开始/结束时间参数 `tzinfo`，或使用 `homeassistant.util.dt.start_of_local_day`）。请注意，全天事件仍应在 `CalendarEvent` 中设置 `datetime.date` 而不是带时间的日期。

```python
import datetime
from homeassistant.core import HomeAssistant
from homeassistant.components.calendar import CalendarEntity

class MyCalendar(CalendarEntity):

    async def async_get_events(
        self,
        hass: HomeAssistant,
        start_date: datetime.datetime,
        end_date: datetime.datetime,
    ) -> list[CalendarEvent]:
        """返回在时间范围内的日历事件。"""
```

### 创建事件

日历实体可以通过指定支持特性 `CREATE_EVENT` 来支持创建事件。支持变更的集成必须处理 rfc5545 字段和最佳实践，例如保留设置的任何新的未知字段和重复事件。

```python
from homeassistant.components.calendar import CalendarEntity

class MyCalendar(CalendarEntity):

    async def async_create_event(self, **kwargs: Any) -> None:
        """向日历添加新事件。"""
```

### 删除事件

日历实体可以通过指定支持特性 `DELETE_EVENT` 来支持删除事件。支持变更的集成必须支持 rfc5545 重复事件。

重复事件可以通过三种方式删除：

- 仅指定 `uid` 将删除整个系列
- 指定 `uid` 和 `recurrence_id` 将删除系列中的特定事件实例
- 指定 `uid`、`recurrence_id` 和 `recurrence_range` 值可能会删除从 `recurrence_id` 开始的一系列事件。目前，rfc5545 允许 [范围](https://www.rfc-editor.org/rfc/rfc5545#section-3.2.13) 值为 `THISANDFUTURE`。

```python
from homeassistant.components.calendar import CalendarEntity


class MyCalendar(CalendarEntity):

    async def async_delete_event(
        self,
        uid: str,
        recurrence_id: str | None = None,
        recurrence_range: str | None = None,
    ) -> None:
        """删除日历上的事件。"""
```

### 更新事件

日历实体可以通过指定支持特性 `UPDATE_EVENT` 来支持更新事件。支持变更的集成必须支持 rfc5545 重复事件。

重复事件可以通过三种方式更新：
- 仅指定 `uid` 将更新整个系列
- 指定 `uid` 和 `recurrence_id` 将更新系列中的特定事件实例
- 指定 `uid`、`recurrence_id` 和 `recurrence_range` 值可能会更新从 `recurrence_id` 开始的一系列事件。目前，rfc5545 允许 [范围](https://www.rfc-editor.org/rfc/rfc5545#section-3.2.13) 值为 `THISANDFUTURE`。

```python
from homeassistant.components.calendar import CalendarEntity


class MyCalendar(CalendarEntity):

    async def async_update_event(
        self,
        uid: str,
        event: dict[str, Any],
        recurrence_id: str | None = None,
        recurrence_range: str | None = None,
    ) -> None:
        """更新日历上的事件。"""
```


## CalendarEvent

`CalendarEvent` 表示日历上的单个事件。

| 名称          | 类型               | 默认值        | 描述                                                                                                                                           |
| ------------- | ------------------ | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| start         | datetime 或 date   | **必填**      | 事件的开始（包括）。必须在 `end`之前。`start` 和 `end` 必须是相同类型。作为日期时间，必须具有时区。                                               |
| end           | datetime 或 date   | **必填**      | 事件的结束（不包括）。必须在 `start`之后。作为日期时间，必须具有与 `start` 相同的时区。                                                       |
| summary       | string             | **必填**      | 事件的标题或摘要。                                                                                                                             |
| location      | string             | `None`         | 事件的地理位置。                                                                                                                               |
| description   | string             | `None`         | 事件的详细描述。                                                                                                                                 |
| uid           | string             | `None`         | 事件的唯一标识符（变更所需）                                                                                                                    |
| recurrence_id | string             | `None`         | 重复事件特定实例的可选标识符（变更所需）                                                                                                     |
| rrule         |  string            | `None`         | 重复规则字符串，例如 `FREQ=DAILY`                                                                                                           |