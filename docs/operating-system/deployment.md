---
title: "部署/发布"
sidebar_label: 部署
---

Home Assistant 操作系统的发布是从发布分支构建的。GitHub Actions 用于构建所有公开发布版本。没有固定的时间表，构建根据 HAOS 维护者的需要进行触发。更改需要首先应用于开发分支，并标记为 `rel-x` 标签。维护者将在下一个发布之前将这些补丁回移植到发布分支上。

## 分支

- `dev`：开发分支。在开发期间承载下一个主要版本。在发布候选阶段，此分支上会标记发布候选版本。
- `rel-X`：发布分支。每个主要发布一个。通常新的发布仅从上一个主要发布版本构建。每个发布都被标记其版本号。

## 版本控制

版本的格式是 *MAJOR.BUILD*。每当发布一个新版本时，BUILD号就会增加（存储在 `buildroot-external/meta`）。MAJOR号从开发分支继承，并在发布分支创建后立即递增。

构建系统默认自动添加 *dev\{DATE\}* 后缀来标记开发构建。

在新的主要发布之前，可以在开发分支上构建发布候选版本。发布候选版本后缀用于标记它们，例如 *MAJOR.0.rc1*。

## 部署类型

HAOS 提供 3 种不同类型的部署。这些部署在用于空中更新的公钥上有所不同。部署类型在 Supervisor 网络前端的主机卡的系统标签中显示。

- 开发 (dev)
- 测试 (beta)
- 生产 (stable)

## 构建流水线

GitHub Actions 用于构建 HAOS 开发和发布构建。存在两个工作流程：

- `.github/workflows/dev.yml`：开发构建，手动触发，映像存储在 [os-builds.home-assistant.io](https://os-builds.home-assistant.io/)。
- `.github/workflows/release.yml`：发布（和发布候选）构建，在 GitHub 发布时触发，映像存储为 GitHub 发布资产。

开发构建流水线也可以通过 PR 进行触发：首先需要设置适当的板标签，当添加 `run-dev-build` 标签时，将为这些板触发构建。