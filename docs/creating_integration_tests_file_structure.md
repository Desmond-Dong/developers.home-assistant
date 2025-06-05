---
title: "集成测试文件结构"
sidebar_label: "测试文件结构"
---

每个集成的测试都存储在一个以集成领域命名的目录中。例如，移动应用集成的测试应存储在 `tests/components/mobile_app` 中。

该文件夹的内容如下所示：

- `__init__.py`: 这是 `pytest` 查找测试所必需的，您可以将此文件限制为介绍集成测试的文档字符串 `"""移动应用集成的测试."""`。
- `conftest.py`: Pytest 测试夹具
- `test_xxx.py`: 测试与集成相应部分的测试。功能测试在 `__init__.py` 中，例如设置、重新加载和卸载配置项，应放在名为 `test_init.py` 的文件中。

## 与其他集成共享测试夹具

如果您的集成是与其他集成共享平台的实体集成，例如 `light` 或 `sensor`，则该集成可以提供在为其他集成编写测试时可以使用的测试夹具。

例如，`light` 集成可能通过向 `tests/components/conftest.py` 添加夹具存根来提供用于创建模拟灯实体的夹具，并在 `tests/components/light/common.py` 中实现这些夹具的实际代码。