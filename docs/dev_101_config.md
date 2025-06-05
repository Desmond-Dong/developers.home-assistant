---
title: "配置"
---

在[ hass 对象](./dev_101_hass.md)上，有一个 Config 类的实例。Config 类包含用户首选的单位、配置目录的路径以及加载的组件。

| 名称 | 类型 | 描述 |
| ---- | ---- | ----------- |
| latitude | float | 实例位置的纬度 |
| longitude | float | 实例位置的经度 |
| elevation | int | 实例的海拔 |
| location_name | str | 实例的名称 |
| time_zone | str | 时区 |
| units | UnitSystem | 单位系统 |
| internal_url | str | 实例可以在内部访问的 URL |
| external_url | str | 实例可以在外部访问的 URL |
| currency | str | 首选货币 |
| country | str | 实例所在的国家 |
| language | str | 首选语言 |
| config_source | ConfigSource | 配置是通过 UI 设置的还是存储在 YAML 中 |
| skip_pip | bool | 如果为 True，则在启动时跳过 pip 安装要求 |
| skip_pip_packages | list[str] | 启动时安装要求时要跳过的包列表 |
| components | set[str] | 加载的组件列表 |
| api | ApiConfig | API（HTTP）服务器配置 |
| config_dir | str | 存放配置的目录 |
| allowlist_external_dirs | set[str] | 允许访问的外部目录列表 |
| allowlist_external_urls | set[str] | 集成可能使用的允许的外部 URL 列表 |
| media_dirs | dict[str, str] | 集成可能使用的媒体文件夹字典 |
| safe_mode | bool | 如果 Home Assistant 正在安全模式下运行 |
| legacy_templates | bool | 使用传统模板行为 |

它还提供了一些辅助方法。