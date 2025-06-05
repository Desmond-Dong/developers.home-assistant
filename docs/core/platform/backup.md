---
title: "备份"
---

集成实现备份平台的主要目的是两个：

1. 添加一个备份代理，能够将备份上传到本地或远程位置。
2. 在创建备份之前暂停或准备集成操作和/或在备份后运行某些操作。

## 备份代理

要添加一个或多个备份代理，请在 `backup.py` 中实现两个方法 `async_get_backup_agents` 和 `async_register_backup_agents_listener`。示例：

```python
async def async_get_backup_agents(
    hass: HomeAssistant,
) -> list[BackupAgent]:
    """返回备份代理的列表。"""
    if not hass.config_entries.async_loaded_entries(DOMAIN):
        LOGGER.debug("没有找到配置项或项未加载")
        return []
    return [ExampleBackupAgent()]


@callback
def async_register_backup_agents_listener(
    hass: HomeAssistant,
    *,
    listener: Callable[[], None],
    **kwargs: Any,
) -> Callable[[], None]:
    """注册一个监听器，当代理被添加或移除时调用。

    :return: 用于注销监听器的函数。
    """
    hass.data.setdefault(DATA_BACKUP_AGENT_LISTENERS, []).append(listener)

    @callback
    def remove_listener() -> None:
        """移除监听器。"""
        hass.data[DATA_BACKUP_AGENT_LISTENERS].remove(listener)

    return remove_listener
```

在需要重新加载备份代理时，应每次调用存储在 `async_register_backup_agents_listener` 中的监听器，以移除过时的代理并添加新的。这可以在 `async_setup_entry` 中注册监听器：

```python
async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """设置配置项。"""
    # 进行设置配置项的操作

    # 通知备份监听器
    def notify_backup_listeners() -> None:
        for listener in hass.data.get(DATA_BACKUP_AGENT_LISTENERS, []):
            listener()
    entry.async_on_unload(entry.async_on_state_change(notify_backup_listeners))

    return True
```

备份代理应实现 `BackupAgent` 基类的抽象接口，如下示例所示：

```python
from homeassistant.components.backup import BackupAgent, BackupAgentError

from .const import DOMAIN


class ExampleBackupAgent(BackupAgent):
    """备份代理接口。"""

    domain = DOMAIN
    name = "示例备份代理"
    unique_id = "example_stable_id"

    async def async_download_backup(
        self,
        backup_id: str,
        **kwargs: Any,
    ) -> AsyncIterator[bytes]:
        """下载备份文件。

        如果备份不存在则引发 BackupNotFound。

        :param backup_id: 在 async_list_backups 中返回的备份 ID。
        :return: 一个异步迭代器，生成字节。
        """

    async def async_upload_backup(
        self,
        *,
        open_stream: Callable[[], Coroutine[Any, Any, AsyncIterator[bytes]]],
        backup: AgentBackup,
        **kwargs: Any,
    ) -> None:
        """上传备份。

        :param open_stream: 返回一个异步迭代器的函数，该迭代器生成字节。
        :param backup: 需要上传的备份的元数据。
        """

    async def async_delete_backup(
        self,
        backup_id: str,
        **kwargs: Any,
    ) -> None:
        """删除备份文件。

        如果备份不存在则引发 BackupNotFound。

        :param backup_id: 在 async_list_backups 中返回的备份 ID。
        """

    async def async_list_backups(self, **kwargs: Any) -> list[AgentBackup]:
        """列出备份。"""

    async def async_get_backup(
        self,
        backup_id: str,
        **kwargs: Any,
    ) -> AgentBackup:
        """返回一个备份。

        如果备份不存在则引发 BackupNotFound。
        """
```

备份代理在出错时应引发 `BackupAgentError`（或 `BackupAgentError` 的子类）异常。其他异常不应离开备份代理。

## 前后操作

当 Home Assistant 正在创建备份时，可能需要暂停集成中的某些操作，或转储数据以便能够正确恢复。

这可以通过在 `backup.py` 中添加两个函数（`async_pre_backup` 和 `async_post_backup`）来完成。

### 添加支持

给新集成添加备份支持的最快方法是使用我们内置的脚手架模板。在 Home Assistant 开发环境中运行 `python3 -m script.scaffold backup` 并按照说明进行操作。

如果您更喜欢手动方式，请在您的集成文件夹中创建一个名为 `backup.py` 的新文件，并实现以下方法：

```python
from homeassistant.core import HomeAssistant


async def async_pre_backup(hass: HomeAssistant) -> None:
    """在备份开始之前执行操作。"""

async def async_post_backup(hass: HomeAssistant) -> None:
    """在备份完成后执行操作。"""