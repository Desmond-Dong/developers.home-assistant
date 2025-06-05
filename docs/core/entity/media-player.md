---
title: 媒体播放器实体
sidebar_label: 媒体播放器
---

:::info 不完整
此条目不完整。欢迎贡献。
:::
媒体播放器实体控制媒体播放器。从 [`homeassistant.components.media_player.MediaPlayerEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/media_player/__init__.py) 派生一个平台实体。

## 属性

:::tip
属性应该始终只从内存中返回信息，不进行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称                            | 类型                                            | 默认值 | 描述
| ------------------------------- | ----------------------------------------------- | ------- | -----------
| app_id                          | <code>str &#124; None</code>                    | `None`  | 当前运行应用的ID。
| app_name                        | <code>str &#124; None</code>                    | `None`  | 当前运行应用的名称。
| device_class                    | <code>MediaPlayerDeviceClass &#124; None</code> | `None`  | 媒体播放器的类型。
| group_members                   | <code>list[str] &#124; None</code>              | `None`  | 当前为同步播放而一起分组的播放器实体的动态列表。如果平台有定义组长的概念，组长应为该列表中的第一个元素。
| is_volume_muted                 | <code>bool &#124; None</code>                   | `None`  | 如果音量当前被静音则为 `True`。
| media_album_artist              | <code>str &#124; None</code>                    | `None`  | 当前播放媒体的专辑艺术家，仅限音乐曲目。
| media_album_name                | <code>str &#124; None</code>                    | `None`  | 当前播放媒体的专辑名称，仅限音乐曲目。
| media_artist                    | <code>str &#124; None</code>                    | `None`  | 当前播放媒体的艺术家，仅限音乐曲目。
| media_channel                   | <code>str &#124; None</code>                    | `None`  | 当前播放的频道。
| media_content_id                | <code>str &#124; None</code>                    | `None`  | 当前播放媒体的内容ID。
| media_content_type              | <code>MediaType &#124; str &#124; None</code>   | `None`  | 当前播放媒体的内容类型。
| media_duration                  | <code>int &#124; None</code>                    | `None`  | 当前播放媒体的持续时间（秒）。
| media_episode                   | <code>str &#124; None</code>                    | `None`  | 当前播放媒体的剧集，仅限电视节目。
| media_image_hash                | <code>str &#124; None</code>                    | `None`  | 媒体图片的哈希，如果 `media_image_url` 为 `None`，则默认为 `media_image_url` 的 SHA256。
| media_image_remotely_accessible | <code>bool &#124; None</code>                   | `False` | 如果属性 `media_image_url` 可以在家庭网络外部访问则为 `True`。
| media_image_url                 | <code>str &#124; None</code>                    | `None`  | 当前播放媒体的图片URL。
| media_playlist                  | <code>str &#124; None</code>                    | `None`  | 当前播放的播放列表的标题。
| media_position                  | <code>int &#124; None</code>                    | `None`  | 当前播放媒体的位置（秒）。
| media_position_updated_at       | <code>datetime &#124; None</code>               | `None`  | `_attr_media_position` 最后更新时间的时间戳。时间戳应该通过调用 `homeassistant.util.dt.utcnow()` 设置。
| media_season                    | <code>str &#124; None</code>                    | `None`  | 当前播放媒体的季节，仅限电视节目。
| media_series_title              | <code>str &#124; None</code>                    | `None`  | 当前播放媒体系列的标题，仅限电视节目。
| media_title                     | <code>str &#124; None</code>                    | `None`  | 当前播放媒体的标题。
| media_track                     | <code>int &#124; None</code>                    | `None`  | 当前播放媒体的曲目编号，仅限音乐曲目。
| repeat                          | <code>RepeatMode &#124; str &#124; None</code>  | `None`  | 当前重复模式。
| shuffle                         | <code>bool &#124; None</code>                   | `None`  | 如果启用随机播放则为 `True`。
| sound_mode                      | <code>str &#124; None</code>                    | `None`  | 媒体播放器的当前声音模式。
| sound_mode_list                 | <code>list[str] &#124; None</code>              | `None`  | 可用声音模式的动态列表。
| source                          | <code>str &#124; None</code>                    | `None`  | 媒体播放器当前选择的输入源。
| source_list                     | <code>list[str] &#124; None</code>              | `None`  | 媒体播放器可能的输入源列表。（此列表应包含适合前端显示的人类可读名称）。
| state                           | <code>MediaPlayerState &#124; None</code>       | `None`  | 媒体播放器的状态。
| volume_level                    | <code>float &#124; None</code>                  | `None`  | 媒体播放器的音量级别范围为 (0..1)。
| volume_step                     | <code>float &#124; None</code>                  | 0.1     | 用于 `volume_up` 和 `volume_down` 服务操作的音量步长。

## 支持的功能

支持的功能通过使用 `MediaPlayerEntityFeature` 枚举中的值定义，并使用按位或（`|`）运算符组合。

| 值                   | 描述                                                       |
| ------------------- | ---------------------------------------------------------- |
| `BROWSE_MEDIA`      | 实体允许浏览媒体。                                       |
| `CLEAR_PLAYLIST`    | 实体允许清空活动播放列表。                               |
| `GROUPING`          | 实体可以与其他播放器分组以进行同步播放。                |
| `MEDIA_ANNOUNCE`    | 实体支持 `play_media` 动作的 announce 参数。              |
| `MEDIA_ENQUEUE`     | 实体支持 `play_media` 动作的 enqueue 参数。               |
| `NEXT_TRACK`        | 实体允许跳到下一个媒体曲目。                             |
| `PAUSE`             | 实体允许暂停媒体播放。                                   |
| `PLAY`              | 实体允许播放/恢复媒体播放。                              |
| `PLAY_MEDIA`        | 实体允许播放媒体源。                                    |
| `PREVIOUS_TRACK`    | 实体允许返回到以前的媒体曲目。                           |
| `REPEAT_SET`        | 实体允许设置重复。                                       |
| `SEARCH_MEDIA`      | 实体允许搜索媒体。                                       |
| `SEEK`              | 实体允许在媒体播放期间寻找位置。                        |
| `SELECT_SOUND_MODE` | 实体允许选择声音模式。                                   |
| `SELECT_SOURCE`     | 实体允许选择源/输入。                                    |
| `SHUFFLE_SET`       | 实体允许随机播放活动播放列表。                         |
| `STOP`              | 实体允许停止媒体播放。                                   |
| `TURN_OFF`          | 实体能够关闭。                                           |
| `TURN_ON`           | 实体能够开启。                                           |
| `VOLUME_MUTE`       | 实体音量可以被静音。                                     |
| `VOLUME_SET`        | 实体音量可以设置为特定级别。                             |
| `VOLUME_STEP`       | 实体音量可以向上和向下调节。                             |

## 状态

媒体播放器的状态通过使用 `MediaPlayerState` 枚举中的值定义，可以取以下可能的值。

| 值           | 描述                                                                                                           |
|--------------|-----------------------------------------------------------------------------------------------------------------|
| `OFF`       | 实体关闭，不接受命令，直到被打开。                                                                            |
| `ON`        | 实体开启，但当前状态的细节未知。                                                                             |
| `IDLE`      | 实体开启并接受命令，但目前没有播放任何媒体。可能处于某种空闲的主屏幕状态。                                   |
| `PLAYING`   | 实体当前正在播放媒体。                                                                                       |
| `PAUSED`    | 实体有一个活动媒体且当前处于暂停状态。                                                                        |
| `STANDBY`   | 实体处于低功耗状态，接受命令。                                                                               |
| `BUFFERING` | 实体准备开始播放某些媒体。                                                                                   |

## 方法

### 播放媒体

告诉媒体播放器播放媒体。使用以下代码实现：

```python
class MyMediaPlayer(MediaPlayerEntity):

    def play_media(
        self,
        media_type: str,
        media_id: str,
        enqueue: MediaPlayerEnqueue | None = None,
        announce: bool | None = None, **kwargs: Any
    ) -> None:
        """播放一段媒体。"""

    async def async_play_media(
        self,
        media_type: str,
        media_id: str,
        enqueue: MediaPlayerEnqueue | None = None,
        announce: bool | None = None, **kwargs: Any
    ) -> None:
        """播放一段媒体。"""

```

`enqueue` 属性是一个字符串枚举 `MediaPlayerEnqueue`：

 - `add`: 将给定媒体项添加到队列末尾
 - `next`: 下一个播放给定媒体项，保持队列
 - `play`: 立即播放给定媒体项，保持队列
 - `replace`: 立即播放给定媒体项，清空队列

当 `announce` 布尔属性设置为 `true` 时，媒体播放器应尝试暂停当前音乐，向用户宣布媒体，然后恢复音乐。

### 浏览媒体

如果媒体播放器支持浏览媒体，则应实现以下方法：

```python
class MyMediaPlayer(MediaPlayerEntity):

    async def async_browse_media(
        self, media_content_type: str | None = None, media_content_id: str | None = None
    ) -> BrowseMedia:
        """实现 websocket 媒体浏览助手。"""
        return await media_source.async_browse_media(
            self.hass,
            media_content_id,
            content_filter=lambda item: item.media_content_type.startswith("audio/"),
        )
```

如果媒体播放器也允许从 URL 播放媒体，则您还可以添加对浏览 Home Assistant 媒体源的支持。这些源可以由任何集成提供。示例提供文本到语音和本地媒体。

```python
from homeassistant.components import media_source
from homeassistant.components.media_player.browse_media import (
    async_process_play_media_url,
)

class MyMediaPlayer(MediaPlayerEntity):

    async def async_browse_media(
        self, media_content_type: str | None = None, media_content_id: str | None = None
    ) -> BrowseMedia:
        """实现 websocket 媒体浏览助手。"""
        # 如果您的媒体播放器没有自己的媒体源供浏览，路由所有浏览命令到媒体源集成。
        return await media_source.async_browse_media(
            self.hass,
            media_content_id,
            # 这允许过滤内容。在这种情况下，它将只显示音频源。
            content_filter=lambda item: item.media_content_type.startswith("audio/"),
        )

    async def async_play_media(
        self,
        media_type: str,
        media_id: str,
        enqueue: MediaPlayerEnqueue | None = None,
        announce: bool | None = None, **kwargs: Any
    ) -> None:
        """播放一段媒体。"""
        if media_source.is_media_source_id(media_id):
            media_type = MediaType.MUSIC
            play_item = await media_source.async_resolve_media(self.hass, media_id, self.entity_id)
            # play_item 返回相对 URL，如果需要在 Home Assistant 主机上解析。
            # 此调用将其转换为完整 URL
            media_id = async_process_play_media_url(self.hass, play_item.url)

        # 用调用您的媒体播放器播放媒体功能替换此内容。
        await self._media_player.play_url(media_id)
```

### 搜索媒体

如果媒体播放器支持搜索媒体，则应实现以下方法：

```python
class MyMediaPlayer(MediaPlayerEntity):

    async def async_search_media(
        self,
        query: SearchMediaQuery,
    ) -> SearchMedia:
        """搜索媒体播放器。"""
        # 在您的库客户端上搜索请求的媒体。
        result = await my_client.search(query=query.search_query)
        return SearchMedia(result=result)
```

SearchMediaQuery 是一个数据类，具有以下属性：

| 属性                 | 类型                                  | 默认值     | 描述                                 |
|---------------------|---------------------------------------|-------------|--------------------------------------|
| `search_query`      | `str`                                 | *必填*      | 搜索字符串或查询。                    |
| `media_content_type`| `MediaType \| str \| None`            | `None`      | 要搜索的内容类型。                    |
| `media_content_id`  | `str \| None`                         | `None`      | 要搜索的内容ID。                      |
| `media_filter_classes`| `list[MediaClass] \| None`            | `None`      | 要过滤的媒体类别列表。                |

### 选择声音模式

可选。切换媒体播放器的声音模式。

```python
class MyMediaPlayer(MediaPlayerEntity):
    # 实现以下方法之一。

    def select_sound_mode(self, sound_mode):
        """切换实体的声音模式。"""

    def async_select_sound_mode(self, sound_mode):
        """切换实体的声音模式。"""
```

### 选择源

可选。切换媒体播放器的选定输入源。

```python
class MyMediaPlayer(MediaPlayerEntity):
    # 实现以下方法之一。

    def select_source(self, source):
        """选择输入源。"""

    def async_select_source(self, source):
        """选择输入源。"""
```

### 媒体类型

必填。返回 MediaType 枚举中与媒体类型匹配的值。

| 常量                |
|---------------------|
| MediaType.MUSIC     |
| MediaType.TVSHOW    |
| MediaType.MOVIE     |
| MediaType.VIDEO     |
| MediaType.EPISODE   |
| MediaType.CHANNEL    |
| MediaType.PLAYLIST   |
| MediaType.IMAGE      |
| MediaType.URL        |
| MediaType.GAME       |
| MediaType.APP        |

```python
class MyMediaPlayer(MediaPlayerEntity):
    # 实现以下方法。

    @property
    def media_content_type(self):
        """当前播放媒体的内容类型。"""
```

:::info
在 `play_media` 服务操作中使用集成名称作为 `media_content_type` 也是可以接受的，如果集成提供的处理与定义常量不对应。
:::

### 可用的设备类别

可选。此媒体设备的类型。可能映射到谷歌设备类型。

| 值         | 描述
|-----------|----------------|
| tv        | 设备是电视类型设备。|
| speaker   | 设备是扬声器或立体声类型设备。|
| receiver   | 设备是音频视频接收器类型设备，接受音频并输出给扬声器和视频给某个显示器。|

### 媒体浏览器的代理专辑封面

可选。如果您的媒体播放器仅可从内部网络访问，则需要通过 Home Assistant 代理专辑封面，以便在离家或通过移动应用时也能工作。

要通过 Home Assistant 代理图像，请将 `BrowseMedia` 项的 `thumbnail` 属性设置为通过 `self.get_browse_image_url(media_content_type, media_content_id, media_image_id=None)` 方法生成的 URL。浏览器将获取此 URL，这将导致调用 `async_get_browse_image(media_content_type, media_content_id, media_image_id=None)`。

:::info
仅在网络外部发起web请求时使用代理作为缩略图。您可以通过 `homeassistant.helpers.network` 中导入的 `is_local_request(hass)` 测试这一点。
:::

在 `async_get_browse_image` 中，使用 `self._async_fetch_image(url)` 从本地网络获取图像。不要使用 `self._async_fetch_image_from_cache(url)`，该方法应仅用于当前播放的艺术作品。

:::info
不要将 URL 作为 `media_image_id` 传递。这可能允许攻击者从本地网络中获取任何数据。
:::

```python
class MyMediaPlayer(MediaPlayerEntity):

    # 实现以下方法。
    async def async_get_browse_image(self, media_content_type, media_content_id, media_image_id=None):
        """提供专辑封面。返回 (content, content_type)。"""
        image_url = ...
        return await self._async_fetch_image(image_url)
```

### 将播放器实体组合在一起

可选。如果您的播放器支持将播放器实体组合在一起进行同步播放（通过 `SUPPORT_GROUPING` 指示），则需要定义一个加入和一个退出的方法。

```python
class MyMediaPlayer(MediaPlayerEntity):
    # 实现以下某个加入方法：

    def join_players(self, group_members):
        """将 `group_members` 作为播放器组与当前播放器连接。"""

    async def async_join_players(self, group_members):
        """将 `group_members` 作为播放器组与当前播放器连接。"""

    # 实现以下某个退出方法：

    def unjoin_player(self):
        """将此播放器从任何组中移除。"""

    async def async_unjoin_player(self):
        """将此播放器从任何组中移除。"""