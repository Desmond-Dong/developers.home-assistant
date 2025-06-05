---
title: "文档"
---

用户文档位于 [https://www.home-assistant.io](https://www.home-assistant.io)。本节是我们提供文档和有关创建或修改内容的附加详细信息的地方。

[home-assistant.io](https://home-assistant.io) 网站是使用 [Jekyll](https://github.com/jekyll/jekyll) 和 [这些依赖项](https://pages.github.com/versions/) 构建的。页面是用 [Markdown](https://daringfireball.net/projects/markdown/) 编写的。要添加页面，您不需要了解 HTML。

## 小更改

您可以使用 "**在 GitHub 上编辑此页面**" 链接来编辑页面，这将自动创建一个分支并允许您快速编辑。请记住，您在这种方式下无法上传图像。您可以在此基础上进行更改并通过 Pull Request (PR) 提出建议。

一旦您创建了 Pull Request (PR)，在部署完成后，您可以通过单击 PR 检查器部分中 Netlify 检查器旁边的 *Details* 查看建议更改的预览。

## 大更改

对于大更改，我们建议您克隆网站的代码库。这样，您可以在本地查看您的更改。处理网站的过程和处理 Home Assistant 本身没有什么不同。

### 使用 Visual Studio Code + devcontainer 开发

开始开发的最简单方法是使用带有开发容器的 Visual Studio Code，类似于处理 Home Assistant Core 开发的方式。请查看 [开发环境](https://developers.home-assistant.io/docs/development_environment) 页面以获取说明。

要查看更改，请打开命令面板并选择 ´Tasks: Run Task´ 然后选择 ´Preview´。

### 手动环境

也可以建立更传统的开发环境。

要在本地测试您的更改，您需要安装 **Ruby** 及其依赖项（gem）：

- [安装 Ruby](https://www.ruby-lang.org/en/documentation/installation/)，如果您尚未安装。需要 Ruby 版本 3.1。
- 安装 `bundler`，Ruby 的依赖管理器：`gem install bundler`（您可能需要以 `sudo` 身份运行此命令）。

- Fedora 的快捷方式：

    ```shell
    sudo dnf -y install gcc-c++ ruby ruby-devel rubygem-bundler rubygem-json && bundle
    ```

- Debian/Ubuntu 的快捷方式：

    ```shell
    sudo apt-get install ruby ruby-dev ruby-bundler ruby-json g++ zlib1g-dev && bundle
    ```

- Mac 的快捷方式（如果捆绑的 Ruby 无法工作）：

    ```shell
    brew install ruby@3.1 && export PATH="/usr/local/opt/ruby@3.1/bin:$PATH"
    ```

- 叉取 home-assistant.io 的 [git 代码库](https://github.com/home-assistant/home-assistant.io)。
- 在您的 home-assistant.io 根目录中运行 `bundle` 来安装您所需的 gem。

然后您可以继续处理文档：

- 运行 `bundle exec rake generate` 来生成第一个预览。这将花费一分钟。
- 创建/编辑/更新页面。集成/平台文档位于 `source/_integrations/`。`source/_docs/` 包含 Home Assistant 本身的文档。
- 在本地测试您对 home-assistant.io 的更改：运行 `bundle exec rake preview` 并导航到 [http://127.0.0.1:4000](http://127.0.0.1:4000)。在此命令运行时，对文件的任何更改会自动被检测到，并会更新相关页面。不过，您需要手动在浏览器中重新加载它们。
- 如果您的文档是新功能、平台或集成，请针对 home-assistant.io 的 **next** 分支创建一个 Pull Request (PR)。
- 如果您修复了内容，创建了烹饪书条目或扩展了现有文档，请针对 home-assistant.io 的 **current** 分支创建一个 Pull Request (PR)。

通过 `bundle exec rake` 生成的网站仅在本地可用。如果您在无头机器上进行开发，请使用端口转发：

```shell
ssh -L 4000:localhost:4000 user_on_headless_machine@ip_of_headless_machine