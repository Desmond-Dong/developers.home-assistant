---
title: "测试你的代码"
---

如[风格指南部分](development_guidelines.md)所述，所有代码都需要检查以下内容：

- 所有单元测试通过
- 所有代码通过代码检查工具的检查

本地测试使用[pytest](https://docs.pytest.org/)进行，并使用[pre-commit](https://pre-commit.com/)来运行我们的代码检查工具，它是在运行`script/setup`时作为[虚拟环境](development_environment.mdx)的一部分安装的。

在运行测试之前需要安装Python测试依赖项。这可以通过使用VScode开发容器和相应的任务来实现。请检查[开发容器文档](/docs/development_environment#tasks)以获取运行任务的指导。

要在整个代码库上运行我们的代码检查工具，请运行以下命令：

```shell
pre-commit run --all-files
```

要运行完整的测试套件，比开发容器默认设置的更多依赖项是必需的。要安装所有依赖项，请激活虚拟环境并运行命令：

```shell
uv pip install -r requirements_test_all.txt
```

或者，在Visual Studio Code中，启动**安装所有测试要求**任务。

要开始测试并运行完整的测试套件，请激活虚拟环境并运行命令：

```shell
pytest tests
```

或者，在Visual Studio Code中，启动**Pytest**任务。

可能需要根据您的发行版/操作系统安装额外的软件包：

- Fedora: `sudo dnf -y install systemd-devel gcc-c++`
- Ubuntu: `sudo apt-get install libudev-dev`

:::info 重要
在创建拉取请求之前运行`pytest`和`pre-commit`以避免麻烦的修复。`pre-commit`将在提交更改时由git自动调用。
:::

:::note
运行完整的`pytest`测试套件将花费相当长的时间，因此作为拉取请求的最低要求，请至少运行与您的代码更改相关的测试（有关如何操作的详细信息见下文）。完整的测试套件将在您创建拉取请求后由CI运行，并在可以合并之前运行。
:::

运行`pytest`将对本地可用的Python版本运行单元测试。我们在CI中对所有支持的Python版本运行测试。

### 向测试环境添加新依赖项

如果您正在为某个集成编写测试，并且您更改了依赖项，则运行`script/gen_requirements_all.py`脚本以更新所有需求文件。
接下来，您可以通过运行以下命令在开发环境中更新所有依赖项：

```shell
uv pip install -r requirements_test_all.txt
```

或者，在Visual Studio Code中，启动**安装所有测试要求**任务。

### 运行有限的测试套件

您可以向`pytest`传递参数，以便能够运行单个测试套件或测试文件。
以下是一些有用的命令：

```shell
# 在第一个测试失败后停止
$ pytest tests/test_core.py -x

# 运行指定名称的测试
$ pytest tests/test_core.py -k test_split_entity_id

# 测试在运行2秒后失败
$ pytest tests/test_core.py --timeout 2

# 显示10个最慢的测试
$ pytest tests/test_core.py --duration=10
```

如果您只想测试您的集成，并包括测试覆盖率报告，建议使用以下命令：

```shell
pytest ./tests/components/<your_component>/ --cov=homeassistant.components.<your_component> --cov-report term-missing -vv
```

或者，在Visual Studio Code中，启动**代码覆盖率**任务。

### 防止代码检查错误

在您尝试提交时，已有几个代码检查工具设置为自动运行，作为运行`script/setup`的一部分，位于[虚拟环境](development_environment.mdx)中。

您也可以手动运行这些代码检查工具：

```shell
pre-commit run --show-diff-on-failure
```

或者，在Visual Studio Code中，启动**Pre-commit**任务。

这些代码检查工具也可以直接运行，您可以对单个文件运行测试：

```shell
ruff check homeassistant/core.py
pylint homeassistant/core.py
```

### 关于PyLint和PEP8验证的说明

如果您无法避免某个PyLint警告，请在该行添加注释以禁用PyLint检查，格式为`# pylint: disable=YOUR-ERROR-NAME`。例如，如果PyLint错误地报告某个对象没有某个成员，就可能避免它。

### 为集成编写测试

- 确保在集成的测试中不与任何集成细节进行交互。遵循这个模式会使测试在集成发生变化时更加稳健。
  - 使用核心接口设置集成，可以使用[`async_setup_component`](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/setup.py#L44-L46)或[`hass.config_entries.async_setup`](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/config_entries.py#L693)，如果集成支持配置条目。
  - 通过核心状态机[`hass.states`](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/core.py#L887)断言实体状态。
  - 通过核心服务注册表[`hass.services`](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/core.py#L1133)执行服务操作调用。
  - 通过[设备注册表](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/helpers/device_registry.py#L101)断言`DeviceEntry`状态。
  - 通过[实体注册表](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/helpers/entity_registry.py#L120)断言实体注册表`RegistryEntry`状态。
  - 通过配置条目接口[`hass.config_entries`](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/config_entries.py#L570)修改`ConfigEntry`。
  - 通过[`ConfigEntry.state`](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/homeassistant/config_entries.py#L169)属性断言配置条目的状态。
  - 通过[`tests/common.py`](https://github.com/home-assistant/core/blob/4cce724473233d4fb32c08bd251940b1ce2ba570/tests/common.py#L658)中的`MockConfigEntry`类模拟一个配置条目。

### 快照测试

Home Assistant支持一种称为快照测试（也称为审批测试）的测试概念，这些测试将值与存储的参考值（快照）进行断言。

快照测试与常规（功能）测试不同，不能替代功能测试，但对于测试较大的输出非常有用。
在Home Assistant中，例如，它们可以用于：

- 确保实体状态的输出是并且保持预期状态。
- 确保注册中的区域、配置、设备、实体或问题条目是并且保持预期状态。
- 确保诊断转储的输出是并且保持预期状态。
- 确保`FlowResult`是并且保持预期状态。

还有许多其他大型输出的情况，如JSON、YAML或XML结果。

快照测试和常规测试之间的一个重大区别在于，结果是通过在特殊模式下运行测试来捕获的，该模式创建快照。任何后续测试的顺序运行将比较结果与快照。如果结果不同，测试将失败。

Home Assistant中的快照测试建立在[Syrupy](https://github.com/tophat/syrupy)之上，因此在编写Home Assistant测试时可以应用其文档。
这是一个快照测试，断言实体状态的输出：

```python
# tests/components/example/test_sensor.py
from homeassistant.core import HomeAssistant
from syrupy.assertion import SnapshotAssertion


async def test_sensor(
    hass: HomeAssistant,
    snapshot: SnapshotAssertion,
) -> None:
    """测试传感器状态。"""
    state = hass.states.get("sensor.whatever")
    assert state == snapshot
```

当第一次运行此测试时，它将失败，因为没有快照存在。
要创建（或更新）快照，请使用`--snapshot-update`标志运行测试：

```shell
pytest tests/components/example/test_sensor.py --snapshot-update
```

或者，在Visual Studio Code中，启动**更新syrupy快照**任务。

这将在`tests/components/example/snapshots`中创建一个快照文件。快照文件的命名与测试文件相同，在本例中为`test_sensor.ambr`，并且是人类可读的。快照文件必须提交到版本库。

当再次运行测试时（不带更新标志），将比较结果与存储的快照，所有内容应通过。

当测试结果发生变化时，测试将失败，快照需要再次更新。

谨慎使用快照测试！由于很容易创建快照，因此很容易倾向于对快照断言所有内容。但是，请记住，这并不是功能测试的替代。

作为示例，当测试实体在设备返回错误时是否变得不可用时，最好断言您期望的具体变化：断言实体的状态变为`unavailable`。此功能测试比使用快照断言该实体的所有状态更好，因为它假定在拍摄快照时它按预期工作。