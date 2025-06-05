---
title: 实体注册和禁用实体
sidebar_label: 禁用实体
---

实体注册表跟踪所有具有唯一 ID 的实体。对于每个实体，注册表跟踪影响实体与核心交互的选项。其中一个选项是 `disabled_by`。

当 `disabled_by` 设置且不为 `None` 时，该实体在集成将其传递给 `async_add_entities` 时将不会被添加到 Home Assistant。

## 集成架构

集成需要确保在其实体被禁用时正常工作。如果您的集成保留对已创建实体对象的引用，则应仅在实体的生命周期方法 `async_added_to_hass` 内注册这些引用。该生命周期方法仅在实体实际添加到 Home Assistant 时调用（因此它没有被禁用）。

实体禁用适用于通过配置条目或在 configuration.yaml 中提供的条目提供的实体。如果您的集成通过配置条目进行设置，并支持 [卸载](config_entries_index.md#unloading-entries)，Home Assistant 将能够在实体启用/禁用后重新加载您的集成，以在不重新启动的情况下应用更改。

## 用户编辑实体注册表

禁用实体的一种方式是用户通过 UI 编辑实体注册表。在这种情况下，`disabled_by` 的值将设置为 `RegistryEntryDisabler.USER`。这将仅适用于已经注册的实体。

## 集成为新的实体注册条目设置 disabled_by 的默认值

作为一个集成，您可以控制实体在首次注册时是否启用。这由 `entity_registry_enabled_default` 属性控制。默认值为 `True`，这意味着实体将被启用。

如果该属性返回 `False`，新注册实体的 `disabled_by` 值将设置为 `RegistryEntryDisabler.INTEGRATION`。

## 配置条目系统选项为新的实体注册条目设置 disabled_by 的默认值

用户还可以通过将配置条目的系统选项 `disable_new_entities` 设置为 `True` 来控制与配置条目相关的新实体的接收方式。这可以通过 UI 完成。

如果一个实体正在注册并且此系统选项设置为 `True`，则 `disabled_by` 属性将初始化为 `RegistryEntryDisabler.CONFIG_ENTRY`。

如果 `disable_new_entities` 设置为 `True` 且 `entity_registry_enabled_default` 返回 `False`，则 `disabled_by` 值将设置为 `RegistryEntryDisabler.INTEGRATION`。

## 提供接收选项以控制 disabled_by 的集成

一些集成希望为用户提供选项，以控制哪些实体被添加到 Home Assistant。例如，Unifi 集成提供选项以启用/禁用无线和有线客户端。

集成可以通过 [configuration.yaml](/configuration_yaml_index.md) 或使用 [Options Flow](/config_entries_options_flow_handler.md) 向用户提供选项。

如果此选项由集成提供，则不应在实体注册表中利用 disabled_by 属性。相反，如果通过配置选项流禁用实体，则应从设备和实体注册表中移除它们。