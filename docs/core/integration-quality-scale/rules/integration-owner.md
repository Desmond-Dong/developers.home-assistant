---
title: "有集成所有者"
---

## 理由

Home Assistant 与成千上万种不同的设备和服务集成，大多数集成是由项目的核心维护者以外的人贡献的。  
添加和维护集成的贡献者被鼓励成为“集成所有者”。  
这个角色赋予贡献者更多的权力，处理 GitHub 上集成的问题和拉取请求，并意味着贡献者承担了集成管理的责任。  
集成所有者在其集成有新问题或拉取请求时会自动收到通知。  
在 GitHub 上，集成所有者被称为“代码所有者”。

集成所有者在每个集成的 `manifest.json` 文件中进行追踪。  
要成为集成所有者，请提交一个拉取请求，将您的 GitHub 用户名添加到清单中的 `"codeowners"` 字段。  
一个集成可以有多个所有者。

我们喜欢集成所有者！  
我们相信有所有者的集成会得到更好的维护。  
在审核过程中，我们将集成所有者视为集成的专家，并更加重视他们的意见。

## 示例实现

集成所有者在 `manifest.json` 中设置。

```json {4} showLineNumbers
{
  "domain": "my_integration",
  "name": "My Integration",
  "codeowners": ["@me"]
}
```

## 其他资源

关于集成所有者的更多信息可以在 [ADR-0008](https://github.com/home-assistant/architecture/blob/master/adr/0008-code-owners.md) 中找到。

## 例外情况

此规则没有例外。