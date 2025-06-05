---
title: 更新实体
sidebar_label: 更新
---

更新实体是指示设备或服务是否有可用更新的实体。这可以是任何更新，包括对设备（如灯泡或路由器）的固件更新，或对附加组件或容器等的软件下载更新。

它可以用于：

- 提供指示，如果设备或服务有可用更新。
- 一种安装方法，用于允许安装更新或特定版本的软件。
- 允许在安装新更新之前提供备份。

## 属性

:::tip
属性应始终只从内存返回信息，而不执行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称 | 类型 | 默认值 | 描述
| ---- | ---- | ------- | -----------
| auto_update | bool | `False` | 实体所代表的设备或服务具有自动更新逻辑。当此项设置为 `True` 时，您不能跳过更新。
| display_precision | int | `0` | 更新进度显示的小数位数。
| in_progress | bool | `None` | 更新安装进度。应返回一个布尔值（如果正在进行则为 True，否则为 False）。
| installed_version | str | `None` | 当前安装并使用的软件版本。
| latest_version | str | `None` | 可用的软件的最新版本。
| release_summary | str | `None` | 发布说明或变更日志的摘要。这不适合较长的变更日志，而只是适合最多 255 个字符的简短更新描述。
| release_url | str | `None` | 可用最新版本的完整发布说明的 URL。
| title | str | `None` | 软件的标题。这有助于区分设备或实体名称与已安装软件的标题。
| update_percentage | int, float | `None` | 更新安装进度。可以返回一个数字以指示从 0 到 100% 的进度或返回 None。

其他所有实体通用的属性，如 `device_class`、`entity_category`、`icon`、`name` 等，仍然适用。

## 支持的功能

支持的功能通过使用 `UpdateEntityFeature` 枚举中的值来定义。

| 值 | 描述 |
|----------|--------------------------------------|
| 'BACKUP' | 更新前可以自动进行备份。
| 'INSTALL' | 可以从 Home Assistant 安装更新。
| 'PROGRESS' | 此集成能够提供进度信息。如果省略，Home Assistant 将尝试提供进度状态；虽然如果可以从设备或服务 API 中提取进度，则更好。
| 'SPECIFIC_VERSION' | 可以使用 `update.install` 服务操作安装特定版本的更新。
| 'RELEASE_NOTES' | 实体提供方法来获取完整的变更日志。

## 方法

### 比较版本

当需要覆盖默认的版本比较逻辑时，应实现此方法。
以下是一个示例：

```python
def version_is_newer(self, latest_version: str, installed_version: str) -> bool:
    """如果 latest_version 比 installed_version 新则返回 True。"""
    return AwesomeVersion(
        latest_version,
        find_first_match=True,
        ensure_strategy=[AwesomeVersionStrategy.SEMVER],
    ) > AwesomeVersion(
        installed_version,
        find_first_match=True,
        ensure_strategy=[AwesomeVersionStrategy.SEMVER],
    )
```

它允许开发人员指定自定义逻辑，以确定一个版本是否比另一个版本更新。首次尝试应基于 [AwesomeVersion 库](https://github.com/ludeeus/awesomeversion?tab=readme-ov-file#awesomeversion-class) 提供的策略。

### 安装

可以实现此方法，以便用户可以直接从 Home Assistant 安装提供的更新。

此方法需要设置 `UpdateEntityFeature.INSTALL`。此外，如果此集成支持安装特定版本或能够在开始更新安装过程之前进行备份，可以分别设置 `UpdateEntityFeature.SPECIFIC_VERSION` 和 `UpdateEntityFeature.BACKUP`。

```python
class MyUpdate(UpdateEntity):
    # 实现这些方法之一。

    def install(
        self, version: str | None, backup: bool, **kwargs: Any
    ) -> None:
        """安装更新。"""

    async def async_install(
        self, version: str | None, backup: bool, **kwargs: Any
    ) -> None:
        """安装更新。

        可以指定版本以安装特定版本。当 `None` 时，需要安装最新版本。

        备份参数表示在安装更新之前应进行备份。
        """
```

### 发布说明

可以实现此方法，以便用户可以在安装更新之前在 Home Assistant 前端的更多信息对话框中获取完整的发布说明。

返回的字符串可以包含 markdown，前端将正确格式化它。

此方法需要设置 `UpdateEntityFeature.RELEASE_NOTES`。

```python
class MyUpdate(UpdateEntity):
    # 实现这些方法之一。

    def release_notes(self) -> str | None:
        """返回发布说明。"""
        return "Lorem ipsum"

    async def async_release_notes(self) -> str | None:
        """返回发布说明。"""
        return "Lorem ipsum"
```

### 可用设备类别

可选地指定它是什么类型的实体。

| 常量 | 描述
| ----- | -----------
| `UpdateDeviceClass.FIRMWARE` | 该更新是设备的固件更新。