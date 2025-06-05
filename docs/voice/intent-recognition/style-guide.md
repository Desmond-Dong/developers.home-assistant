---
title: 响应风格指南
---

本文档描述了响应的风格指南。

## 简洁明了

响应应该简洁明了，直截了当。它们不应包含不必要的信息。

- 如果一个命令只针对单个设备，请不要在响应中重复实体的名称。
- 如果一个命令针对一个区域，请不要在响应中重复区域或它的实体的名称。
- 如果一个命令请求列出实体，若数量为4个或更少，则全部列出。否则列出前3个，并说“+ 2个更多”。

可读性很重要，因此在必要时使用下面的代码生成“+ 2个更多”风格的句子。请勿自创变体。

```jinja2
{% if query.matched %}
  {% set match = query.matched | map(attribute="name") | sort | list %}
  {% if match | length > 4 %}
    是的，{{ match[:3] | join(", ") }} 和 {{ (match | length - 3) }} 个更多
  {%- else -%}
    是的，
    {% for name in match -%}
      {% if not loop.first and not loop.last %}, {% elif loop.last and not loop.first %} 和 {% endif -%}
      {{ name }}
    {%- endfor -%}
  {% endif %}
{% else %}
  不是
{% endif %}
```

## 使用正确的时态

响应应使用现在时。例如，“灯是亮的”而不是“灯曾是亮的”。

## 使用正确的语态

响应应使用主动语态。例如，“灯是亮的”而不是“灯正在被打开”。这里的例外是`cover`领域，因为这些动作需要相当长的时间才能完成。