---
title: "意图匹配测试语法"
sidebar_label: "测试语法"
---

为了确保模板句子按预期工作，我们有一个广泛的测试套件。这个测试套件基于包含输入句子列表及预期匹配意图和槽位的 YAML 文件。

测试存储在 [GitHub](https://github.com/home-assistant/intents/tree/main/tests) 上，并通过为每种语言设置一个目录 `tests/<language>/` 来组织：

 - `_fixtures.yaml` - 可以在测试期间引用的虚构实体和区域
 - `<domain>_<intent>.yaml` - 针对 [单一意图](../../intent_builtin) 和领域的句子。这些文件只应测试在 [匹配句子文件](./template-sentence-syntax) 中定义的同名句子。

``` yaml
# 示例 homeassistant_HassTurnOn.yaml
language: "en"
tests:
  # 您可以有多个测试块，每个块具有不同的预期匹配数据
  - sentences:
      # 可以同时测试多个句子
      - "打开天花板风扇"
      - "将天花板风扇打开"
    # 预期匹配数据
    intent:
      name: "HassTurnOn"
      slots:
        name: "fan.ceiling"
```

## Fixtures

当 Home Assistant 匹配句子时，它将提供可以在句子中引用的区域和实体列表。对于测试，我们在 `_fixtures.yaml` 中定义这些内容。

```yaml
# 示例 _fixtures.yaml（英语）
language: "en"
areas:
  - name: "厨房"
    id: "kitchen"
  - name: "客厅"
    id: "living_room"
entities:
  - name: "厨房开关"
    id: "switch.kitchen"
    area: "kitchen"
  - name: "左侧窗帘"
    id: "cover.curtain_left"
    area: "living_room"
```

确保 fixtures 不要有像 "车库门" 或 "窗帘" 这样的通用名称。相反，使用唯一名称，如 "左侧车库门" 或 "左侧窗帘"。这是必要的，以允许根据通用名称定义匹配句子，例如 "打开车库门"。