---
title: "品牌"
---

一个商业品牌可能有多个集成，这些集成为该品牌下的不同产品提供支持。此外，一个品牌可能会提供符合IoT标准的设备，例如Zigbee或Z-Wave。
第一个案例的例子是，有多个集成为不同的Google产品提供支持，例如`google`集成的Google日历和`google_sheets`集成的Google表格。
第二个案例的例子是，Innovelli提供Zigbee和Z-Wave设备，并不需要自己的集成。

为了使用户更容易找到这些集成，它们应被收集在`homeassistant/brands`文件夹中的一个文件内。

示例：
```json
{
  "domain": "google",
  "name": "Google",
  "integrations": ["google", "google_sheets"]
}
```

```json
{
  "domain": "innovelli",
  "name": "Innovelli",
  "iot_standards": ["zigbee", "zwave"]
}
```

或者一个可以复制到您项目中的最小示例：

```json
{
  "domain": "your_brand_domain",
  "name": "Your Brand",
  "integrations": [],
  "iot_standards": []
}
```

## 域

域是一个由字符和下划线组成的短名称。该域必须是唯一的，并且不能更改。Google品牌的域例子：`google`。域键必须与其所在品牌文件的文件名匹配。如果有一个具有相同域的集成，它必须在品牌的`integrations`中列出。

## 名称

品牌的名称。

## 集成

实现该品牌产品的集成域列表。

## IoT标准

品牌设备支持的IoT标准列表。可能的值包括`homekit`、`zigbee`和`zwave`。请注意，某些设备可能不支持任何列出的IoT标准。