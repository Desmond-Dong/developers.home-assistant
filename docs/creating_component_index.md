---
title: "创建你的第一个集成"
---

好的，现在是时候为你的集成编写你的第一段代码了。太棒了。别担心，我们已经尽力将其保持得尽可能简单。在 Home Assistant 开发环境中，输入以下命令并按照说明进行操作：

```shell
python3 -m script.scaffold integration
```

这将为您提供构建可通过用户界面设置的集成所需的一切。有关集成的更多详细示例，请参阅[我们的示例库](https://github.com/home-assistant/example-custom-config/tree/master/custom_components/)。

:::tip
此示例库展示了存放在 `<config_dir>/custom_components` 目录中的自定义集成。这些必须在其[清单文件](/docs/creating_integration_manifest/#version)中包含 `version` 键。核心集成位于 `homeassistant/components` 目录中，不需要 `version` 键。在这两种情况下，架构是相同的。
:::

## 最小配置

脚手架集成包含的不仅仅是最低限度。最低限度是你需要定义一个包含集成域的 `DOMAIN` 常量。第二部分是它需要定义一个设置方法，该方法返回一个布尔值以指示设置是否成功。

根据你的需要，创建一个文件 `homeassistant/components/hello_state/__init__.py`，并选择以下两个代码块之一：

- 同步组件：

```python
DOMAIN = "hello_state"


def setup(hass, config):
    hass.states.set("hello_state.world", "Paulus")

    # 返回布尔值以指示初始化是否成功。
    return True
```

- 如果你更喜欢异步组件：

```python
DOMAIN = "hello_state"


async def async_setup(hass, config):
    hass.states.async_set("hello_state.world", "Paulus")

    # 返回布尔值以指示初始化是否成功。
    return True
```

此外，还需要一个清单文件，作为最低要求包含以下键。创建 `homeassistant/components/hello_state/manifest.json`。

```json
{
  "domain": "hello_state",
  "name": "你好，状态！"
}
```

要加载此文件，请在 `configuration.yaml` 文件中添加 `hello_state:`。 

## 脚手架提供的内容

使用脚手架脚本时，它将超出集成的最低要求。它将包括配置流程、配置流程的测试以及基本的翻译基础设施，以为你的配置流程提供国际化支持。