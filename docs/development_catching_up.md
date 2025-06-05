---
title: "追赶现实"
---

如果开发你的功能花费了一段时间，而你想要跟上当前 Home Assistant `dev` 分支的进展，你可以使用 `git merge` 或 `git rebase`。
下面你可以找到使用 `git merge` 的指令。这将会把最新的 Home Assistant 修改拉取到本地，并通过创建一个合并提交将其合并到你的分支中。

在克隆你的 fork 之后，你应该已经添加了一个额外的 `remote`。如果没有， 请在继续之前现在就添加：

```shell
git remote add upstream https://github.com/home-assistant/core.git
```

```shell
# 从你的功能分支运行此命令
git fetch upstream dev  # 将最新的修改拉取到本地 dev 分支
git merge upstream/dev  # 在你的修改之前将这些修改合并到你的功能分支
```

如果 git 检测到任何冲突，请按照以下步骤解决它们：

1. 使用 `git status` 查看有冲突的文件；编辑文件并解决 `<<<< | >>>>` 之间的行
2. 添加修改后的文件：`git add <file>` 或 `git add .`
3. 通过提交完成合并（你可以保持默认的合并提交信息不变）：`git commit`

最后，像往常一样推送你的更改：

```shell
# 从你的功能分支运行此命令
git push
```

如果该命令失败，说明在你上次更新以来，你或其他贡献者已经向分支推送了新的工作。在这种情况下，只需将它们拉入你的本地分支，解决任何冲突并再次推送所有内容：

```shell
# 从你的功能分支运行此命令
git pull --no-rebase
git push
```

其他工作流程在 [Github 文档](https://docs.github.com/get-started/quickstart/fork-a-repo) 中有详细介绍。