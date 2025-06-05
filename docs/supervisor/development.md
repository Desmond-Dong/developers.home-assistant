---
title: "监督者开发"
sidebar_label: "开发"
---

这些说明适用于监督者、监督者前端面板和 `hassio` 集成的开发，通过与开发或远程监督者交互，这假设您正在使用开发机器进行开发，这些说明还将使用 devcontainer 和其他依赖于 Docker 的工具，因此如果您尚未设置，请先完成此操作。

## 监督者开发

这里的说明适用于监督者本身的开发。

1. 叉取（Fork）监督者库（https://github.com/home-assistant/supervisor）并将其克隆到您的开发机器中。
2. 使用 Visual Studio Code devcontainer 打开该库。
3. 在您的叉取中创建一个分支。
4. 进行更改。
5. 使用下面的说明测试您的更改。
6. 提交并推送您的更改，并在 https://github.com/home-assistant/supervisor 上针对 `main` 分支创建一个 PR。

### 本地测试

在 Visual Studio Code 中启动“运行监督者”任务，这将在 devcontainer 内启动一个监督者实例，您可以用来测试您的更改。
初始化完成后，您可以通过 `http://localhost:9123` 访问 Home Assistant 前端。

### 在远程系统上测试

为此，您首先需要在 [Docker Hub](https://hub.docker.com/) 创建一个账户。

1. 通过 SSH 或直接控制台访问远程系统。
2. 使用 `ha info` 检查机器的架构，如果是 Home Assistant OS，则只需 `info`。
3. 在您的开发机器上使用我们的 [构建工具](https://github.com/home-assistant/builder) 来构建并发布您的监督者映像。

示例：

:::note

所有示例都将具有您需要调整的值。

- 将 `aarch64` 调整为您在步骤 2 中找到的架构。
- 将 `awesome-user` 调整为您的 Docker Hub 用户名。
- 将 `secret-password` 调整为您的 Docker Hub 密码或发布令牌。

:::

```bash
docker run --rm \
    --privileged \
    -v /run/docker.sock:/run/docker.sock \
    -v "$(pwd):/data" \
    ghcr.io/home-assistant/amd64-builder:dev \
        --generic latest \
        --target /data \
        --aarch64 \
        --docker-hub awesome-user \
        --docker-user awesome-user \
        --docker-password secret-password \
        --no-cache
```

4. 在远程系统上使用 `ha supervisor --channel dev` 或如果是 Home Assistant OS，则只需 `supervisor --channel dev` 将频道更改为 `dev`。
5. 使用 `docker pull awesome-user/aarch64-hassio-supervisor:latest` 拉取您的监督者映像。
6. 将您的监督者映像标记为 `homeassistant/aarch64-hassio-supervisor:latest`。

```bash
docker tag awesome-user/aarch64-hassio-supervisor:latest homeassistant/aarch64-hassio-supervisor:latest
```

7. 使用 `systemctl restart hassos-supervisor` 重新启动 `hassio-supervisor` 服务。
8. 使用 `journalctl -fu hassos-supervisor` 检查问题。

## 集成开发

这里的说明适用于 `hassio` 集成的开发，我们假设您已经设置了 [Home Assistant Core 开发环境](development_environment.mdx)，并且您已设置 [监督者 API 访问](#supervisor-api-access)。

要配置 Home Assistant Core 以连接到远程监督者，请在启动 Home Assistant 时设置以下环境变量：

- `SUPERVISOR`：设置为运行 Home Assistant 的机器的 IP 地址和端口 80（API 代理附加组件）
- `SUPERVISOR_TOKEN`：将此设置为您在 [监督者 API 访问](#supervisor-api-access) 中找到的令牌。

```shell
SUPERVISOR=192.168.1.100:80 SUPERVISOR_TOKEN=abcdefghj1234 hass
```

您的本地 Home Assistant 安装现在将连接到远程的 Home Assistant 实例。

## 前端开发

这里的说明适用于监督者面板的开发，我们假设您已经设置了带有 devcontainer 的 [Home Assistant 前端开发环境](/frontend/development.md)，并且您已设置 [监督者 API 访问](#supervisor-api-access)。

1. 运行“开发监督者面板”任务。
2. 运行任务“在 devcontainer 中为监督者运行 HA Core”。
3. 当询问 IP 时，使用运行 [监督者 API 访问](#supervisor-api-access) 的主机的 IP。
4. 当询问令牌时，使用您在 [监督者 API 访问](#supervisor-api-access) 中找到的令牌。

### 没有前端 devcontainer

在您的 `configuration.yaml` 文件中更新 `hassio` 集成配置，以指向前端库：

```yaml
# configuration.yaml
hassio:
  # 示例路径。更改为您检出的前端库的路径
  development_repo: /home/paulus/dev/hass/frontend
```

要构建监督者面板的本地版本，请转到前端库并运行：

```shell
cd hassio
script/develop
```

当 `script/develop` 正在运行时，每当您更改源文件时，监督者面板将重新构建。

## 监督者 API 访问

为了开发 `hassio` 集成和监督者面板，我们将需要对监督者的 API 访问。该 API 受到令牌的保护，我们可以通过特殊的附加组件提取该令牌。这可以在运行系统上完成或使用 [devcontainer](#local-testing)。

[![打开您的 Home Assistant 实例，并显示带有预填充特定库 URL 的添加附加组件库对话框。](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fhome-assistant%2Faddons-development)
[![打开您的 Home Assistant 实例，并显示监督者附加组件的仪表板。](https://my.home-assistant.io/badges/supervisor_addon.svg)](https://my.home-assistant.io/redirect/supervisor_addon/?addon=ae6e943c_remote_api)

1. 添加我们的开发者附加组件库：[https://github.com/home-assistant/addons-development](https://github.com/home-assistant/addons-development)
2. 安装附加组件“远程 API 代理”。
3. 点击开始。
4. 令牌将打印在日志中。

此附加组件需要保持运行，以允许 Home Assistant Core 连接。

远程 API 代理令牌的权限略低于生产中 Home Assistant Core 的权限。要获取具有完全权限的实际令牌，您需要 SSH 进入主机系统并运行：

```shell
docker inspect homeassistant | grep SUPERVISOR_TOKEN
```

请注意，重启或更新操作系统/容器后，任一令牌都可能会更改。