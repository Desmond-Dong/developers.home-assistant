---
title: "配置流程的完整测试覆盖"
related_rules:
  - config-flow
  - test-before-configure
  - unique-config-entry
  - discovery
  - reauthentication-flow
  - reconfiguration-flow
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

配置流程是用户与您的集成进行的第一次交互。
确保配置流程按预期工作，并且用户能够顺利设置集成而不会遇到任何问题或（与配置流程相关的）错误是很重要的。

这意味着我们希望配置流程的测试覆盖率达到 **100%**。
在这些测试中，我们需要验证流程能够从错误中恢复，以确认用户能够完成流程，即使出现某些问题。

由于我们希望用户在使用其他集成流程时有顺畅的体验，因此这个规则同样适用于重新配置、重新验证和选项流程。

拥有集成测试的额外好处是它使开发人员接触到测试，从而更容易为集成的其他部分编写测试。

:::warning
尽管用于检查配置条目唯一性的代码很可能会被愉快流程测试触及，但请确保还测试该流程不允许添加多个唯一配置条目，以达到完全覆盖。
:::

## 示例实现

我们需要对配置流程的每种启动方式进行以下场景的测试，启动方式可以是用户、发现或导入流程。

下面的示例展示了由用户启动的基本愉快流程。

`test_config_flow.py`:
```python showLineNumbers
async def test_full_flow(
    hass: HomeAssistant,
    mock_my_client: AsyncMock,
    mock_setup_entry: AsyncMock,
) -> None:
    """测试完整流程。"""
    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": SOURCE_USER},
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {CONF_HOST: "10.0.0.131"},
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "我的集成"
    assert result["data"] == {
        CONF_HOST: "10.0.0.131",
    }
```

## 额外资源

有关配置流程的更多信息，请参阅 [配置流程文档](/docs/config_entries_config_flow_handler)。
有关集成测试的更多信息，请参阅 [测试文档](/docs/development_testing)。

## 例外情况

此规则没有例外情况。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>