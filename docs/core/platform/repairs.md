---
title: "修复"
---

Home Assistant 记录应该引起用户注意的问题。这些问题可以由集成或 Home Assistant 本身创建。问题可以通过 RepairsFlow 进行修复，或者通过链接到包含用户如何自行解决信息的网站。

## 创建问题

```python
from homeassistant.helpers import issue_registry as ir

ir.async_create_issue(
    hass,
    DOMAIN,
    "manual_migration",
    breaks_in_ha_version="2022.9.0",
    is_fixable=False,
    severity=ir.IssueSeverity.ERROR,
    translation_key="manual_migration",
)
```

| 属性 | 类型 | 默认值 | 描述 |
| ---- | ---- | ---- | ---- |
| domain | 字符串 |  | 引发问题的域 |
| issue_id | 字符串 |  | 问题的标识符，必须在 `domain` 内唯一 |
| breaks_in_ha_version | 字符串 | `None` | 问题破坏发生的版本 |
| data | 字典 | `None` | 任意数据，用户不可见 |
| is_fixable | 布尔值 |  | 如果问题可以自动修复则为 True |
| is_persistent | 布尔值 |  | 如果问题应该在 Home Assistant 重新启动后保持存在则为 True |
| issue_domain | 字符串 | `None` | 由代表其他集成创建问题的集成设置 |
| learn_more_url | 字符串 | `None` | 用户可以在此找到更多关于问题的详情的 URL |
| severity | IssueSeverity |  | 问题的严重程度 |
| translation_key | 字符串 |  | 带有问题简要说明的翻译键 |
| translation_placeholders | 字典 | `None` | 将被注入翻译中的占位符 |

### 问题的严重程度

为了更好地理解选择哪个严重级别，请参见下面的列表。

| IssueSeverity | 描述 |
|---------------|--------------------------------------------------------------------|
| CRITICAL      | 被认为是保留，仅用于真正的恐慌 |
| ERROR         | 当前存在问题，需要立即关注 |
| WARNING       | 将来会出现问题（例如 API 停止服务），需要关注 |

## 提供修复

在您的集成文件夹中创建一个新的平台文件，名为 `repairs.py`，并根据以下模式添加代码。

```python
from __future__ import annotations

import voluptuous as vol

from homeassistant import data_entry_flow
from homeassistant.components.repairs import ConfirmRepairFlow, RepairsFlow
from homeassistant.core import HomeAssistant


class Issue1RepairFlow(RepairsFlow):
    """问题修复流的处理程序。"""

    async def async_step_init(
        self, user_input: dict[str, str] | None = None
    ) -> data_entry_flow.FlowResult:
        """处理修复流的第一步。"""

        return await (self.async_step_confirm())

    async def async_step_confirm(
        self, user_input: dict[str, str] | None = None
    ) -> data_entry_flow.FlowResult:
        """处理修复流的确认步骤。"""
        if user_input is not None:
            return self.async_create_entry(title="", data={})

        return self.async_show_form(step_id="confirm", data_schema=vol.Schema({}))


async def async_create_fix_flow(
    hass: HomeAssistant,
    issue_id: str,
    data: dict[str, str | int | float | None] | None,
) -> RepairsFlow:
    """创建流。"""
    if issue_id == "issue_1":
        return Issue1RepairFlow()
```

## 问题生命周期

### 问题持久性

问题将保留在问题注册表中，直到被创建它的集成或用户 [修复](#fixing-an-issue) 删除。

`is_persistent` 标志控制问题在 Home Assistant 重新启动后是否应向用户显示：
- 如果问题上设置了 `is_persistent` 标志，则问题将在重新启动后再次显示给用户。对于只能在发生时检测到的问题（如更新失败、自动化中未知操作），请使用此标志。
- 如果问题上未设置 `is_persistent` 标志，则问题在重新启动后不会再次显示给用户，直到其集成再次创建。对于可以检查的问题（如磁盘空间不足），请使用此标志。

### 被忽略的问题

用户可以选择“忽略”问题。被忽略的问题会被忽略，直到明确删除 - 无论是通过集成，还是用户成功走完其 [修复流](#fixing-an-issue) 并再次创建。忽略问题在 Home Assistant 的重启过程中生效，与 [问题持久性](#issue-persistence) 无关。

## 删除问题

集成通常不需要删除问题，但在某些情况下可能会有用。

```python
from homeassistant.helpers import issue_registry as ir

ir.async_delete_issue(hass, DOMAIN, "manual_migration")
```

## 修复问题

如果问题的 `is_fixable` 被设置为 `True`，用户将被允许修复该问题。成功修复的问题将从问题注册表中删除。