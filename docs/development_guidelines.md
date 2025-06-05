---
title: "样式指南"
---

Home Assistant 对提交的所有代码执行相当严格的 [PEP8 风格](https://peps.python.org/pep-0008/) 和 [PEP 257（文档字符串约定）](https://peps.python.org/pep-0257/) 合规性检查。

我们使用 [Ruff](https://docs.astral.sh/ruff/) 进行代码格式化。每个拉取请求在 linting 过程中会自动检查，我们绝不会合并不符合标准的提交。

最相关点的摘要：

- 注释应为完整句子并以句号结束。
- [导入](https://peps.python.org/pep-0008/#imports) 应有序。
- 常量及列表和字典的内容应按字母顺序排列。

建议调整 IDE 或编辑器设置以符合这些要求。

## 我们的建议

对于某些情况 [PEPs](https://peps.python.org/) 并没有明确的说明。此部分涵盖了我们对代码风格的建议。这些要点来自现有代码，并基于贡献者和开发者最常使用的内容。这基本上是多数决策，因此您可能不同意。但我们希望鼓励您遵循这些建议，以保持代码的一致性。

### 文件头

文件头中的文档字符串应描述该文件的内容。

```python
"""对 MQTT 灯的支持。"""
```

### 日志消息

日志消息中无需添加平台或组件名称。这将自动添加。与 `syslog` 消息一样，末尾不应有句号。以下是广泛使用的风格，但您可以随意编写消息。

```python
_LOGGER.error("无法连接设备: %s", self._resource)
```

```log
2017-05-01 14:28:07 ERROR [homeassistant.components.sensor.arest] 无法连接设备: 192.168.0.18
```

请勿打印 API 密钥、令牌、用户名或密码（即使它们是错误的）。
对 `_LOGGER.info` 要限制使用，对于任何不针对用户的内容，请使用 `_LOGGER.debug`。

### 使用新的字符串格式化风格

优先使用 [f-strings](https://docs.python.org/3/reference/lexical_analysis.html#f-strings)，而不是 `%` 或 `str.format`。

```python
# 新的
f"{some_value} {some_other_value}"
# 旧的，不正确
"{} {}".format("新", "风格")
"%s %s" % ("旧", "风格")
```

唯一的例外是日志记录，它使用百分号格式化。这是为了避免在消息被抑制时格式化日志消息。

```python
_LOGGER.info("无法连接到 webservice %s 在 %s", string1, string2)
```

### 类型提示

我们鼓励完全为代码进行类型提示。这有助于在我们的代码库中发现/防止问题和错误，
同时也有助于未来的其他贡献者对您的代码进行调整。

默认情况下，Home Assistant 在我们的自动化 CI 过程中会静态检查类型提示。
如果 Python 模块完全类型化，可以通过在 Home Assistant Core 项目根目录下的 `.strict-typing` 文件中添加条目进行严格检查。