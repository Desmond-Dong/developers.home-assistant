---
title: "SARIF 报告"
sidebar_label: "SARIF 报告"
---

## 概述

SARIF（静态分析结果交换格式）报告用于 GitHub Actions，以通知通过 lint 工具或代码风格工具发现的问题。本指南解释了我们项目中如何处理 SARIF 报告，以及如何将多个报告合并为一个，以与 GitHub Actions 兼容。

## 为什么使用 SARIF 报告？

GitHub Actions 支持 SARIF 报告进行代码扫描，使得在 pull 请求或仓库的安全选项卡中直接识别和解决问题变得更容易。有关 SARIF 的更多信息，请参阅 [GitHub 文档](https://docs.github.com/en/code-security/code-scanning/integrating-with-code-scanning/sarif-support-for-code-scanning)。

## 处理多个 SARIF 报告

### 问题

在我们的项目中，我们使用多个 Gradle 模块。当运行生成 SARIF 报告的任务时，每个模块都会生成自己的报告。然而，GitHub Actions 不再支持在单次工作流运行中处理多个 SARIF 报告。

### 解决方案

为了解决这个问题，我们使用一个自定义的 Python 脚本将所有 SARIF 报告合并为一个文件。这确保了与 GitHub Actions 的兼容性。

合并 SARIF 报告的脚本位于 `.github/scripts/merge_sarif.py`。请按照以下步骤使用它：

1. **生成 SARIF 报告**
2. 运行 `python3 .github/scripts/merge_sarif.py`

您将在仓库的根目录下得到一个新的 SARIF 文件。