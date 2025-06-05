---
title: 待办事项实体
sidebar_label: 待办事项
---

待办事项实体是一个表示待办事项列表的实体。待办事项列表包含已排序且具有状态（完成或进行中）的待办事项。待办事项实体源自 [`homeassistant.components.todo.TodoListEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/todo/__init__.py)。

## 属性

:::tip
属性应该仅从内存中返回信息，而不进行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称         | 类型                             | 默认               | 描述                                                 |
| ------------ | -------------------------------- | ------------------ | ---------------------------------------------------- |
| todo_items   | <code>list[TodoItem] &#124; None</code> | `None`             | **必填。** 待办事项列表的有序内容。                  |

### 状态

`TodoListEntity` 状态是待办事项列表中未完成项目的计数。

## 支持的特性

支持的特性通过使用 `TodoListEntityFeature` 枚举中的值定义，并使用按位或 (`|`) 运算符合并。

| 值                       | 描述                                                         |
| ------------------------ | ------------------------------------------------------------ |
| `CREATE_TODO_ITEM`      | 实体实现了允许创建待办事项的方法。                          |
| `DELETE_TODO_ITEM`      | 实体实现了允许删除待办事项的方法。                          |
| `UPDATE_TODO_ITEM`      | 实体实现了允许更新待办事项的方法。                          |
| `MOVE_TODO_ITEM`        | 实体实现了允许重新排序待办事项的方法。                      |
| `SET_DUE_DATE_ON_ITEM`  | 实体在创建或更新待办事项时实现将项目的 `due` 字段设置为 `datetime.date`。 |
| `SET_DUE_DATETIME_ON_ITEM` | 实体在创建或更新待办事项时实现将项目的 `due` 字段设置为 `datetime.datetime`。 |
| `SET_DESCRIPTION_ON_ITEM` | 实体在创建或更新待办事项时实现设置项目的 `description` 字段。  |

## 方法

### 创建待办事项

待办事项实体可以通过指定支持的特性 `CREATE_TODO_ITEM` 来支持创建待办事项。

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_create_todo_item(self, item: TodoItem) -> None:
        """将项目添加到待办事项列表中。"""
```

### 删除待办事项

待办事项实体可以通过指定支持的特性 `DELETE_TODO_ITEM` 来支持删除待办事项。集成必须支持删除多个项目。

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_delete_todo_items(self, uids: list[str]) -> None:
        """从待办事项列表中删除项目。"""
```

### 更新待办事项

待办事项实体可以通过指定支持的特性 `UPDATE_TODO_ITEM` 来支持更新待办事项。`TodoItem` 字段 `uid` 始终存在，并指示应该更新哪个项目。传递给更新的项目是原始项目的副本，字段已更新或清空。

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_update_todo_item(self, item: TodoItem) -> None:
        """将项目添加到待办事项列表中。"""
```

### 移动待办事项

待办事项实体可以通过指定支持的特性 `MOVE_TODO_ITEM` 来支持在列表中重新排序待办事项。具有指定 `uid` 的待办事项应移动到指定 `previous_uid` 之后的位置（`None` 表示移动到待办事项列表的第一位）。

```python
from homeassistant.components.todo import TodoListEntity

class MyTodoListEntity(TodoListEntity):

    async def async_move_todo_item(
        self,
        uid: str,
        previous_uid: str | None = None
    ) -> None:
        """在待办事项列表中移动项目。"""
```

## TodoItem

`TodoItem` 表示待办事项列表中的单个项目。上述方法描述了在创建或更新时哪些字段是可选的差异。

| 名称        | 类型                             | 默认          | 描述                                                                                                                                  |
| ----------- | -------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| uid         | <code>string &#124; None</code> | `None`       | 待办事项的唯一标识符。此字段在更新时是必需的，并且在实体状态中。                                                                   |
| summary     | <code>string &#124; None</code> | `None`       | 待办事项的标题或摘要。此字段在实体状态中是必需的。                                                                                 |
| status      | <code>TodoItemStatus &#124; None</code> | `None`       | 定义待办事项的整体状态，可以是 `NEEDS_ACTION` 或 `COMPLETE`。此字段在实体状态中是必需的。                                          |
| due         | <code>datetime.date &#124; datetime.datetime &#124; None</code> | `None`       | 预计完成待办事项的日期和时间。作为 datetime，必须具有时区。                                                                         |
| description | <code>string &#124; None</code>  | `None`       | 相比摘要，待办事项的更完整描述。                                                                                                      |