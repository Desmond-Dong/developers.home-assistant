---
title: "后端本地化"
---

## 翻译字符串

平台翻译字符串以 JSON 格式存储在 [core](https://github.com/home-assistant/core) 仓库中。这些文件必须位于它们所属的组件/平台旁边。组件必须有自己的目录，文件名简单地命名为 `strings.json` 在该目录中。该文件将包含可翻译的不同字符串。

`strings.json` 包含了集成提供的需要翻译的不同内容的翻译。

| 类别                 | 描述                                            |
| -------------------- | ----------------------------------------------- |
| `title`              | 集成的标题。                                    |
| `common`             | 共享字符串。                                    |
| `config`             | 配置流程的翻译。                                |
| `device`             | 设备的翻译。                                    |
| `device_automation`  | 设备自动化的翻译。                              |
| `entity`             | 实体的翻译。                                    |
| `entity_component`   | 实体组件的翻译。                                |
| `exceptions`         | 错误消息的翻译。                                |
| `issues`             | 修复问题的翻译。                                |
| `options`            | 选项流程的翻译。                                |
| `selectors`          | 集成的选择器。                                  |
| `services`           | 集成的服务操作。                                |

### 标题

该类别只是一个字符串：集成名称的翻译。此键是可选的，如果省略，则 Home Assistant 将回退到集成名称。仅在它不是产品品牌时包含此项。

### 共享字符串

使用超过一次的字符串不应重复，而应使用引用来指代单一定义。引用可以是任何有效的翻译键。可选地，可以将共享字符串放置在 `common` 部分中。

```json
{
  "common": {
    "error_stale_api_key": "如果 `stale_api_key` 被返回为中止原因，将显示此消息。"
  },
  "config": {
    "error": {
      "invalid_api_key": "如果 `invalid_api_key` 被返回作为流程错误，将显示此消息。",
      // 引用到公共部分
      "stale_api_key": "[%key:component::new_integration::common::error_stale_api_key%]"
    },
  }
  "options": {
    "error": {
      // 引用同一文件中的另一个部分
      "invalid_api_key": "[%key:component::new_integration::config::error::invalid_api_key%]",
      // 引用同一文件中的公共部分
      "stale_api_key": "[%key:component::new_integration::common::error_stale_api_key%]"
    },
  }
}
```

### 配置 / 选项 / 子条目流程

配置流处理器、选项流处理器和配置子条目处理器的翻译字符串分别在 `config`、`options` 和 `config_subentries` 键下定义。

请注意 `config_subentries` 是一个映射的地图，其中键是集成支持的子条目类型。

下面的示例字符串文件描述了支持的不同键。尽管示例显示了配置流的翻译，选项和子条目流程的翻译遵循相同的格式。

```json
{
  "config": {
    // 可选。显示在列表中的标题。仅在需要占位符时将被呈现
    "flow_title": "发现的设备 ({host})",
    // 可选，仅在前端默认翻译误导时需要
    "entry_type": "解释条目表示的标签",
    // 可选，仅在前端默认翻译误导时需要
    "initiate_flow": {
        "reconfigure": "启动重新配置流程的菜单或按钮标签",
        "user": "启动用户流程的菜单或按钮标签"
    },
    "step": {
      "init": {
        // 可选。如果省略，将显示集成名称
        "title": "用户可见的 `init` 步骤的标题。",
        // 可选
        "description": "与步骤一起显示的Markdown。",
        "data": {
          "api_key": "`api_key` 输入字段的标签"
        },
        // 仅在表单有部分时需要
        "sections": {
          "auth_options": {
            "name": "`auth_options` 部分的标签"
          }
        }
      }
    },
    "error": {
      "invalid_api_key": "如果 `invalid_api_key` 被返回作为流程错误，将显示此消息。"
    },
    "abort": {
      "stale_api_key": "如果 `stale_api_key` 被返回为中止原因，将显示此消息。"
    },
    "progress": {
      "slow_task": "如果 `slow_task` 被返回作为 `progress_action` 用于 `async_show_progress`，将显示此消息。"
    }
  },
  "options": {
    // 与配置流相同的格式
  },
  "config_subentries": {
    "subentry_type_1": {
      // 与配置流相同的格式
    },
    "subentry_type_2": {
      // 与配置流相同的格式
    }
  }
}
```

### 选择器

选择器的翻译在 `selector` 键下定义。它支持选择器 `select` 的选项标签翻译。集成应在选择器选择配置上设置 `translation_key`。这允许配置和选项流程中用于选择器选择的翻译。下面的示例字符串文件描述了支持的不同键。

```json
{
  "config": {
    "flow_title": "发现的设备 ({host})",
    "step": {
      "init": {
        "title": "用户可见的 `init` 步骤的标题。",
        "description": "与步骤一起显示的Markdown。",
        "data": {
          // 配置流选择器选择，具有支持翻译的选项
          "set_ca_cert": "代理证书验证"
        }
      }
    }
  },
  // 用于选项和配置流的选择器选择的翻译
  "selector": {
    // 该键与需要设置的 `translation_key` 相关联
    // 使用 SelectSelectorConfig 类
    "set_ca_cert": {
      // 选择器选择选项标签的翻译
      "options": {
        "off": "关闭",
        "auto": "自动",
        "custom": "自定义"
      }
    }
  }
}
```

### 服务操作

服务操作字符串的翻译在 `services` 键下定义。

它支持翻译每个操作的 `name` 和 `description`，每个操作 `fields` 的 `name` 和 `description`，以及每个可折叠字段部分的 `name` 和 `description`。

请注意，显示在可折叠节中的字段的 `name` 和 `description` 的翻译也应该在 `fields` 键下。

```json
{
  "selector": {
    "fan_speed": {
      "options": {
        "high": "高",
        "low": "低",
        "medium": "中",
        "off": "关闭"
      }
    }
  },
  "services": {
    "set_speed": {
      "name": "设置速度",
      "description": "设置风扇速度。",
      "fields": {
        "speed": {
          "name": "速度",
          "description": "要设置的速度。"
        }
      },
      "sections": {
        "advanced_fields": {
          "name": "高级选项"
        }
      }
    }
  }
}
```

:::note
服务操作可能在其 `fields` 中使用选择器。可以在 services.yaml 文件中的选择器定义中使用 `translation_key` 属性提供选择器的翻译。有关更多信息，请参见 [选择器](#selectors) 部分和 [服务操作描述](/docs/dev_101_services.md#service-action-descriptions) 页面。
:::

### 设备自动化

设备自动化的翻译字符串在 `device_automation` 键下定义。下面的示例字符串文件描述了支持的不同键。

```json
{
  "device_automation": {
    // 支持设备操作的翻译
    "action_type": {
      "open": "打开 {entity_name}"
    },
    // 支持设备条件的翻译
    "condition_type": {
      "is_open": "{entity_name} 是开着的"
    },
    // 支持设备触发器的翻译
    "trigger_type": {
      "opened": "{entity_name} 被打开",
      "remote_button_short_press": "\"{subtype}\" 按钮被按下",
    },
    // 设备触发器子类型的翻译，通常用于按钮名称
    "trigger_subtype": {
      "button_1": "第一个按钮"
    }
  }
}
```

### 异常

对 `HomeAssistantError` 及其子类支持本地化。在 `strings.json` 文件中，异常的翻译字符串在 `exception` 键下定义。下面的示例描述了支持的不同键。

```json
{
  "exceptions": {
    // 已知异常的翻译
    "invalid_index": {
      "message": "选择的索引无效，期望 [0,1,2]。获得 {index}"
    }
  }
}
```

在服务操作调用期间抛出带有本地化的异常的示例：

```python
async def async_select_index(hass: HomeAssistant, index: int) -> None:
    """为我的设备设置配置条目。"""
    try:
        check_index(index)
    except ValueError as exc:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="invalid_index",
            translation_placeholders={
                "index": index,
            },
        ) from exc
```

### 问题

修复问题的翻译字符串在 `issues` 键下定义。下面的示例字符串文件描述了支持的不同键。

```json
{
  "issues": {
    "cold_tea": {
      // 问题的标题
      "title": "茶是冷的",
      // 可修复问题的修复流程的翻译，按照配置流的翻译相同的方式定义。
      // 必须恰好存在 `fix_flow` 或 `description` 之一。
      "fix_flow": {
        "abort": {
          "not_tea_time": "此时无法重新加热茶"
        }
      }
    },
    "unfixable_problem": {
      "title": "这不是一个可修复的问题",
      // 问题的描述，必须恰好存在 `fix_flow` 或 `description` 之一。
      "description": "这个问题无法通过流程修复。"
    }
  }
}
```

### 设备

#### 设备名称
集成可以提供其设备名称的翻译。为此，提供一个 `device` 对象，包含名称的翻译，并将设备的 `translation_key` 设置为 `device` 对象下的一个键。
如果设备的 `translation_key` 不为 `None`，则在实体的 `device_info` 属性中设置的名称或传递给 `DeviceRegistry.async_get_or_create` 的名称将被忽略。如果设备对象未提供指定 `translation_key` 的翻译名称，则将使用 `translation_key` 作为设备名称。

在翻译中也支持使用占位符。如果在翻译字符串中定义了占位符，则设备的 `translation_placeholders` 也必须相应设置。

以下示例 `strings.json` 是一个设备，其 `translation_key` 设置为 `power_strip`：
```json
{
  "device": {
    "power_strip": {
      "name": "排插"
    }
  }
}
```

以下示例 `strings.json` 是一个设备，其 `translation_key` 属性设置为 `n_ch_power_strip` 并带有占位符 `number_of_sockets`：

```json
{
  "device": {
    "n_ch_power_strip": {
      "name": "带有 {number_of_sockets} 个插座的排插"
    }
  }
}
```

### 实体

#### 实体名称
集成可以提供其实体名称的翻译。为此，提供一个 `entity` 对象，包含名称的翻译，并将实体的 `translation_key` 属性设置为 `entity` 对象下的一个键。
如果实体的 `translation_key` 属性不为 `None` 且 `entity` 对象提供了翻译名称，则将忽略 `EntityDescription.name`。

实体组件，例如 `sensor`，已经存在可重用的翻译，可以通过引用那些翻译来使用。这包括基于设备类别的实体名称的通用翻译。例如，它已经为 "温度传感器" 提供了可引用的翻译。优先引用现有翻译，因为这可以防止多次翻译相同内容。

在翻译中也支持使用占位符。如果在翻译字符串中定义了占位符，则实体的 `translation_placeholders` 属性也必须相应设置。

以下示例 `strings.json` 是一个 `sensor` 实体，其 `translation_key` 属性设置为 `thermostat_mode`：
```json
{
  "entity": {
    "sensor": {
      "thermostat_mode": {
        "name": "温控模式"
      }
    }
  }
}
```

以下示例 `strings.json` 是一个 `sensor` 实体，其 `translation_key` 属性设置为 `temperature_sensor`，并使用 `sensor` 集成提供的共享翻译：

```json
{
  "entity": {
    "sensor": {
      "temperature_sensor": {
        "name": "[%key:component::sensor::entity_component::temperature::name%]"
      }
    }
  }
}
```

以下示例 `strings.json` 是一个 `sensor` 实体，其 `translation_key` 属性设置为 `distance` 并带有占位符 `tracked_device`：

```json
{
  "entity": {
    "sensor": {
      "distance": {
        "name": "{tracked_device} 的距离"
      }
    }
  }
}
```

#### 实体状态

集成可以在其他集成（如传感器）下提供其实体状态的翻译，如果基础实体组件未提供翻译，或者如果基础实体组件提供的翻译与集成的实体不匹配。为此，提供一个 `entity` 对象，包含状态的翻译，并将实体的 `translation_key` 属性设置为 `entity` 对象下的一个键。

为了区分实体及其翻译，提供不同的翻译键。以下示例 `strings.json` 是一个月亮域 `sensor` 实体，其 `translation_key` 属性设置为 `phase`：

```json
{
  "entity": {
    "sensor": {
      "phase": {
        "state": {
          "new_moon": "新月",
          "first_quarter": "上弦月",
          "full_moon": "满月",
          "last_quarter": "下弦月"
        }
      }
    }
  }
}
```

#### 实体状态属性

集成可以在其他集成（如传感器）下提供其实体状态属性的翻译，如果基础实体组件未提供翻译，或者如果基础实体组件提供的翻译与集成的实体不匹配。为此，提供一个 `entity` 对象，包含实体状态属性的翻译，并将实体的 `translation_key` 属性设置为 `entity` 对象下的一个键。

为了区分实体及其翻译，提供不同的翻译键。以下示例 `strings.json` 是一个 `demo` 域 `climate` 实体，其 `translation_key` 属性设置为 `ubercool`，具有自定义的 `fan_mode` 和 `swing_mode` 设置：

```json
{
  "entity": {
    "climate": {
      "ubercool": {
        "state_attributes": {
          "fan_mode": {
            "state": {
              "auto_high": "自动高级",
              "auto_low": "自动低级",
              "on_high": "开启高级",
              "on_low": "开启低级"
            }
          },
          "swing_mode": {
            "state": {
              "1": "1",
              "2": "2",
              "3": "3",
              "auto": "自动",
              "off": "关闭"
            }
          }
        }
      }
    }
  }
}
```

#### 实体组件的状态

如果您的集成在其域下提供实体，您将希望翻译状态。这可以通过在 `entity_component` 字典下提供一个 `states` 对象来实现，该对象包含不同设备类别的状态翻译。键 `_` 用于没有设备类别的实体。

```json
{
  "entity_component": {
    "problem": {
      "state": {
        "off": "正常",
        "on": "有问题"
      }
    },
    "safety": {
      "state": {
        "off": "安全",
        "on": "不安全"
      }
    },
    "_": {
      "state": {
        "off": "[%key:common::state::off%]",
        "on": "[%key:common::state::on%]"
      }
    }
  }
}
```

#### 实体属性名称和实体组件的状态

:::info
实体属性名称和状态的翻译也需要前端支持，目前仅对 `climate` 实体可用。
:::

如果您的集成在其域下提供实体，您将希望翻译实体属性和实体状态属性的名称。为此，在 `entity_component` 字典中提供一个 `state_attributes` 对象，该对象包含不同设备类别的实体属性的翻译。键 `_` 用于没有设备类别的实体。

```json
{
  "entity_component": {
    "_": {
      "state_attributes": {
        "aux_heat": { "name": "辅助加热" },
        "current_humidity": { "name": "当前湿度" },
        "current_temperature": { "name": "当前温度" },
        "fan_mode": {
          "name": "风扇模式",
          "state": {
            "off": "[%key:common::state::off%]",
            "on": "[%key:common::state::on%]",
            "auto": "自动",
            "low": "低",
            "medium": "中",
            "high": "高",
            "top": "上",
            "middle": "中",
            "focus": "集聚",
            "diffuse": "散布"
          }
        }
      }
    }
  }
}
```

#### 实体的测量单位

集成可以提供其实体的测量单位的翻译。为此，提供一个 `entity` 对象，包含单位的翻译，并将实体的 `translation_key` 属性设置为 `entity` 对象下的一个键。
如果实体的 `translation_key` 属性不为 `None`，而且 `entity` 对象提供了翻译的测量单位，则不应定义 `SensorEntityDescription.native_unit_of_measurement` 或 `NumberEntityDescription.native_unit_of_measurement`。

以下示例 `strings.json` 是一个 `sensor` 实体，其 `translation_key` 属性设置为 `goal`：
```json
{
  "entity": {
    "sensor": {
      "goal": {
        "unit_of_measurement": "步数"
      }
    }
  }
}
```

## 测试翻译

为了测试翻译文件的更改，必须通过运行以下脚本将翻译字符串编译到 Home Assistant 的翻译目录中：

```shell
python3 -m script.translations develop
```

如果翻译没有显示，清除浏览器缓存（MacOS 上为 cmd + R，Windows 和 Linux 上为 ctrl + F5）

## 引入新字符串

要引入新字符串，添加到 `strings.json` 或平台字符串文件中。尽量尽可能多地使用对公共字符串的引用。公共字符串位于 `homeassistant/strings.json` 中。您可以通过引用这些翻译来引用它们。例如：

```json
{
  "config": {
    "abort": {
      "already_configured": "[%key:common::config_flow::abort::already_configured_device%]"
    }
  }
}
```

在与字符串文件的拉取请求合并到 `dev` 分支后，字符串将自动上传到 Lokalise，贡献者可以提交翻译。Lokalise 中的翻译字符串会定期拉取到核心仓库中。