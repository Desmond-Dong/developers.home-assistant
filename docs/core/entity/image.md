---
title: 图像实体
sidebar_label: 图像
---

图像实体可以显示静态图像。从 [`homeassistant.components.image.ImageEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/image/__init__.py) 派生平台实体。

图像实体是 [`camera`](/docs/core/entity/camera) 实体的简化版本，并支持提供静态图像或可以被获取的图像 URL。

实现可以提供从中自动获取图像的 URL 或图像数据作为 `bytes`。提供 URL 时，获取到的图像将缓存于 `self._cached_image`，将 `self._cached_image` 设置为 `None` 可使缓存失效。

## 属性

:::tip
属性应始终仅从内存返回信息，而不执行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 以获取数据。
:::

| 名称               | 类型                              | 默认值      | 描述                                                                                                    |
| -------------------| --------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------- |
| content_type       | str                               | `image/jpeg` | 图像的内容类型，如果图像实体提供了 URL，将自动设置。                                                     |
| image_last_updated | <code>datetime.datetime &#124; None</code> | `None`       | 图像上次更新的时间戳。用于确定 `state`。前端在此发生变化后会调用 `image` 或 `async_image`。             |
| image_url          | <code>str &#124; None</code>      | `UNDEFINED`  | 可选的 URL, 从中应获取图像。                                                                             |

## 方法

### 图像

如果您的实体返回图像的字节而不是提供 URL，则实现 `async_image` 或 `image`。前端将调用 `async_image` 或 `image` 来获取图像。如果图像是远程获取的，图像数据应被缓存，并在 `image_last_updated` 更改时使缓存失效。

注意：
- 仅在前端获取图像时才会调用图像实体的 `async_image` 或 `image` 方法。
- 前端会：
  - 在加载包含图像实体的页面时一次性获取图像
  - 当图像实体通过更改 `image_last_updated` 更改其状态时重新获取图像

这意味着在 `async def async_image` 中更新 `image_last_updated` 属性是不正确的。相反，图像实体应在可用更新图像时或在一段时间后定期更新时更新 `image_last_updated` 时间戳。这可以作为实体协调器更新的一部分发生。

```python
class MyImage(ImageEntity):
    # 实现其中一个方法。

    def image(self) -> bytes | None:
        """返回图像的字节。"""

    async def async_image(self) -> bytes | None:
        """返回图像的字节。"""