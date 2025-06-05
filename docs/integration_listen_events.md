---
title: "监听事件"
---

您的集成可能需要在 Home Assistant 内发生特定事件时采取行动。 Home Assistant 提供事件助手来监听特定事件类型并直接访问事件总线。这些辅助工具经过高度优化，以最小化回调的数量。如果已经有针对您需要监听的特定事件的辅助工具，最好使用该辅助工具，而不是直接监听事件总线。

## 可用的事件助手

事件助手在 `homeassistant.helpers.event` 命名空间中可用。这些函数返回一个可调用对象，用于取消监听器。

下面函数的同步版本也可用，不带 `async_` 前缀。

### 示例

```python3
unsub = async_track_state_change_event(hass, entity_ids, state_automation_listener)
unsub()
```

### 追踪实体状态变化

| 函数                                   | 用例
| -------------------------------------- | --------------------------------------------------------------------------
| `async_track_state_change`             | 追踪特定状态变化
| `async_track_state_change_event`       | 追踪按 entity_id 索引的特定状态变化事件
| `async_track_state_added_domain`       | 追踪实体添加到域时的状态变化事件
| `async_track_state_removed_domain`     | 追踪实体从域中移除时的状态变化事件
| `async_track_state_change_filtered`    | 使用可更新的 TrackStates 过滤器追踪状态变化
| `async_track_same_state`               | 在一段时间内追踪实体的状态并执行操作

### 追踪模板变化

| 函数                                   | 用例
| -------------------------------------- | --------------------------------------------------------------------------
| `async_track_template`                 | 添加在模板评估为 'true' 时触发的侦听器
| `async_track_template_result`          | 添加在模板结果发生变化时触发的侦听器

### 追踪实体注册表变化

| 函数                                       | 用例
| ------------------------------------------ | --------------------------------------------------------------------------
| `async_track_entity_registry_updated_event` | 追踪按 entity_id 索引的特定实体注册表更新事件

### 追踪时间变化

| 函数                                       | 用例
| ------------------------------------------ | --------------------------------------------------------------------------
| `async_track_point_in_time`                | 添加一个在特定时间点触发的侦听器
| `async_track_point_in_utc_time`            | 添加一个在特定 UTC 时间点触发的侦听器
| `async_call_later`                         | 添加一个延迟调用的侦听器
| `async_track_time_interval`                | 添加一个在每个时间间隔反复触发的侦听器
| `async_track_utc_time_change`              | 添加一个如果时间匹配模式则触发的侦听器
| `async_track_time_change`                  | 添加一个如果本地时间匹配模式则触发的侦听器

### 追踪太阳

| 函数                                       | 用例
| ------------------------------------------ | --------------------------------------------------------------------------
| `async_track_sunrise`                      | 添加一个每天在日出时会触发的侦听器
| `async_track_sunset`                       | 添加一个每天在日落时会触发的侦听器

## 直接监听事件总线

提供两个函数用于创建侦听器。这两个函数都返回一个可调用对象，用于取消侦听器。

- `async_listen_once` - 仅监听一次事件并且不再触发
- `async_listen` - 继续监听直到被取消

使用 `async_listen` 的情况相对少见，因为 `EVENT_HOMEASSISTANT_START`、`EVENT_HOMEASSISTANT_STARTED` 和 `EVENT_HOMEASSISTANT_STOP` 每次运行只会触发一次。

### 异步上下文

```python3
cancel = hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, disconnect_service)
cancel()
```

```python3
cancel = hass.bus.async_listen(EVENT_STATE_CHANGED, forward_event)
cancel()
```

### 同步上下文
```python3
cancel = hass.bus.listen_once(EVENT_HOMEASSISTANT_STOP, disconnect_service)
cancel()
```

```python3
cancel = hass.bus.listen(EVENT_STATE_CHANGED, forward_event)
cancel()
```

### 常见事件

下面的事件通常会被直接监听。

| 事件名称                           | 描述
| ---------------------------------- | --------------------------------------------------------------------------
| `EVENT_HOMEASSISTANT_START`        | 完成设置并进入开始阶段
| `EVENT_HOMEASSISTANT_STARTED`      | 完成启动阶段，所有集成功能都有机会加载；主要用于语音助手和将状态导出到外部服务的集成
| `EVENT_HOMEASSISTANT_STOP`         | 进入停止阶段

### 其他事件

这些事件很少直接被监听，除非该集成是核心的一部分。通常，有可用的助手来处理这些事件，在这种情况下，不应直接监听它们。

| 事件名称                           | 描述                                  | 优选助手
| ---------------------------------- | -------------------------------------- | ----------------------------
| `EVENT_HOMEASSISTANT_FINAL_WRITE`  | 最后一次写入数据到磁盘的机会          | 
| `EVENT_HOMEASSISTANT_CLOSE`        | 拆除                                  | 
| `EVENT_COMPONENT_LOADED`           | 集成已完成加载                        | `homeassistant.helpers.start.async_at_start`
| `EVENT_SERVICE_REGISTERED`         | 新服务已注册                          |
| `EVENT_SERVICE_REMOVED`            | 服务已被移除                          |
| `EVENT_CALL_SERVICE`               | 服务已被调用                          |
| `EVENT_STATE_CHANGED`              | 实体状态已改变                        | [追踪实体状态变化](#追踪实体状态变化)
| `EVENT_THEMES_UPDATED`             | 主题已更新                            |
| `EVENT_CORE_CONFIG_UPDATE`         | 核心配置已更新                        |
| `EVENT_ENTITY_REGISTRY_UPDATED`    | 实体注册表已更新                      | [追踪实体注册表变化](#追踪实体注册表变化)