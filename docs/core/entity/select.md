---
title: 选择实体
sidebar_label: 选择
---

`select` 是一种实体，允许用户从集成提供的有限选项列表中选择一个选项。从 [`homeassistant.components.select.SelectEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/select/__init__.py) 派生实体平台。

仅在没有更合适的选项可用时，才应使用此实体。
例如，灯泡可以具有用户可选择的灯光效果。虽然可以使用此 `select` 实体来实现，但它实际上应该是 `light` 实体的一部分，因为 `light` 实体已经支持灯光效果。

## 属性

:::tip
属性应始终仅从内存中返回信息，而不进行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------- | ----------- |
| current_option | str | None | 当前选择的选项 |
| options | list | **必需** | 可用选项的字符串列表 |

其他所有实体共有的属性，如 `icon`、`unit_of_measurement`、`name` 等，也适用。

## 方法

### 选择选项

当用户或自动化想要更改当前选择的选项时调用。

```python
class MySelect(SelectEntity):
    # 实现这些方法中的一个。

    def select_option(self, option: str) -> None:
        """更改所选选项。"""

    async def async_select_option(self, option: str) -> None:
        """更改所选选项。"""