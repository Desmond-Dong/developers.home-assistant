---
title: 日期/时间实体
sidebar_label: 日期/时间
---

`datetime` 是允许用户向集成输入时间戳的实体。可以从 [`homeassistant.components.datetime.DateTimeEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/datetime/__init__.py) 派生实体平台。

## 属性

:::tip
属性应始终仅从内存中返回信息，而不进行输入/输出（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称 | 类型 | 默认值 | 描述
| ---- | ---- | ------- | -----------
| native_value | <code>datetime.datetime &#124; None</code> | **必需** | 日期时间的值。必须包括时区信息。

其他所有实体都适用的属性，如 `icon`、`name` 等，也适用。

## 方法

### 设置值

当用户或自动化想要更新值时调用。输入的日期时间将始终为 UTC。

```python
class MyDateTime(DateTimeEntity):
    # 实现以下这些方法之一。

    def set_value(self, value: datetime) -> None:
        """更新当前值。"""

    async def async_set_value(self, value: datetime) -> None:
        """更新当前值。"""