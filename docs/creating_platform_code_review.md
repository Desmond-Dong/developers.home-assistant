---
title: "创建平台的清单"
sidebar_label: 平台清单
---

添加新平台时要做的事情清单。

:::info
并非所有现有平台都遵循此清单中的要求。这不能作为不遵循它们的理由！
:::

### 0. 通用

1. 遵循我们的 [风格指南](development_guidelines.md)
2. 使用 [`const.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/const.py) 中现有的常量
   - 仅在常量被广泛使用时才将其添加到 `const.py`。否则保持在平台级别
   - 使用 `CONF_MONITORED_CONDITIONS` 而不是 `CONF_MONITORED_VARIABLES`

### 1. 外部要求

1. 要求已添加到 [`manifest.json`](creating_integration_manifest.md)。`REQUIREMENTS` 常量已被弃用。
2. 要求版本应被固定: `"requirements": ['phue==0.8.1']`
3. 我们不再希望要求托管在 GitHub 上。请将其上传到 PyPi。
4. 每个要求都符合 [库的要求](api_lib_index.md#basic-library-requirements)。

### 2. 配置

1. 如果平台可以直接设置，请添加一个用于 [配置验证](development_validation.md) 的 voluptuous 模式
2. Voluptuous 模式扩展组件的模式  
   (例如，`hue.light.PLATFORM_SCHEMA` 扩展 `light.PLATFORM_SCHEMA`)
3. 默认参数在 voluptuous 模式中指定，而不是在 `setup_platform(...)` 中
4. 你的 `PLATFORM_SCHEMA` 应尽可能多地使用来自 `homeassistant.const` 的通用配置键
5. 永远不要依赖用户将内容添加到 `customize` 来配置平台内部的行为。

```python
import voluptuous as vol

from homeassistant.const import CONF_FILENAME, CONF_HOST
from homeassistant.components.light import PLATFORM_SCHEMA
import homeassistant.helpers.config_validation as cv

CONF_ALLOW_UNREACHABLE = "allow_unreachable"
DEFAULT_UNREACHABLE = False

PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend(
    {
        vol.Required(CONF_HOST): cv.string,
        vol.Optional(CONF_ALLOW_UNREACHABLE, default=DEFAULT_UNREACHABLE): cv.boolean,
        vol.Optional(CONF_FILENAME): cv.string,
    }
)
```

### 3. 设置平台

1. 验证传入的配置（用户/密码/主机等）是否有效。
2. 如果可能，将您的调用分组到 `add_entities` 中。
3. 如果平台添加了额外的动作，格式应为 `<你集成的域>.<服务动作名称>`。因此，如果您的集成域是 "awesome_sauce"，而您正在制作一个灯光平台，您将要在 `awesome_sauce` 域下注册服务动作。确保您的服务动作 [验证权限](auth_permissions.md#checking-permissions)。

### 4. 实体

1. 从您正在构建平台的集成中扩展实体。

    ```python
    from homeassistant.components.light import Light
    
    
    class HueLight(Light):
        """Hue 灯光组件."""
    ```

2. 避免将 `hass` 作为参数传递给实体。当实体被添加到 Home Assistant 时，`hass` 会在实体上设置。这意味着您可以在实体内部通过 `self.hass` 访问 `hass`。
3. 不要在构造函数中调用 `update()`，请改用 `add_entities(devices, update_before_add=True)`。
4. 不要在属性内部执行任何 I/O 操作。在 `update()` 内部缓存值。
5. 在处理时间时，状态和/或属性不应包含相对时间，而应存储 UTC 时间戳。
6. 利用 [实体生命周期回调](core/entity.md#lifecycle-hooks) 附加事件监听器或清理连接。

### 5. 与设备/服务的通信

1. 所有 API 特定代码必须是托管在 PyPi 上的第三方库的一部分。Home Assistant 应仅与对象交互，而不是直接调用 API。

    ```python
    # 不好
    status = requests.get(url("/status"))
    # 好
    from phue import Bridge

    bridge = Bridge(...)
    status = bridge.status()
    ```

    [发布您自己的 PyPI 包的教程](https://towardsdatascience.com/how-to-open-source-your-first-python-package-e717444e1da0)

    其他值得注意的发布 python 包的资源:  
    [Cookiecutter 项目](https://cookiecutter.readthedocs.io/)  
    [flit](https://flit.readthedocs.io/)  
    [Poetry](https://python-poetry.org/)  
