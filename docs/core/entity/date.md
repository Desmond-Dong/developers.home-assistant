---
title: 日期实体
sidebar_label: 日期
---

`date` 是一个实体，允许用户向集成输入一个日期。从 [`homeassistant.components.date.DateEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/date/__init__.py) 派生实体平台。

## 属性

:::tip
属性应该始终仅从内存中返回信息，而不进行 I/O（例如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称 | 类型 | 默认 | 描述 |
| ---- | ---- | ------- | ----------- |
| native_value | <code>datetime.date &#124; None</code> | **必需** | 日期的值。 |

其他所有实体共同具有的属性，如 `icon`、`name` 等，也适用。

## 方法

### 设置值

当用户或自动化想要更新值时调用。

```python
class MyDate(DateEntity):
    # 实现这些方法中的一个。

    def set_value(self, value: date) -> None:
        """更新当前值。"""

    async def async_set_value(self, value: date) -> None:
        """更新当前值。"""