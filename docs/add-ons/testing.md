---
title: "本地插件测试"
---

开发插件的最快且推荐的方法是使用本地的 Visual Studio Code 开发容器。我们维护了一个 [用于此目的的开发容器](https://github.com/home-assistant/devcontainer)，该容器在我们所有的插件库中使用。此 VS Code 的开发容器设置运行 Supervisor 和 Home Assistant，并将所有插件作为本地插件映射在其中，使得 Windows、Mac 和 Linux 桌面操作系统上的插件开发者能够简单使用。

- 按照说明下载并安装 [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VS Code 扩展。
- 将 [`devcontainer.json`](https://github.com/home-assistant/devcontainer/raw/main/addons/devcontainer.json) 文件复制到你仓库中的 `.devcontainer/devcontainer.json`。
- 将 [`tasks.json`](https://github.com/home-assistant/devcontainer/raw/main/addons/tasks.json) 文件复制到你仓库中的 `.vscode/tasks.json`。
- 在 VS Code 中打开根文件夹，当提示时在容器内重新打开窗口（或者，从命令面板中选择“重建并在容器中重新打开”）。
- 当 VS Code 在容器中打开你的文件夹时（第一次运行可能需要一些时间），你需要运行任务（终端 -> 运行任务）“启动 Home Assistant”，这将引导 Supervisor 和 Home Assistant。
- 然后你将能够通过 Home Assistant 实例在 `http://localhost:7123/` 访问正常的引导过程。
- 你根文件夹中的插件将自动在本地插件库中被找到。

## 远程开发

如果你需要访问不可本地模拟的物理硬件或其他资源（例如串口），开发插件的下一个最佳选择是在运行 Home Assistant 的真实设备上将插件添加到本地插件库。要访问远程设备上的本地插件库，请安装 [Samba](https://my.home-assistant.io/redirect/supervisor_addon/?addon=core_samba) 或 [SSH](https://my.home-assistant.io/redirect/supervisor_addon/?addon=core_ssh) 插件，并将插件文件复制到 `/addons` 的子目录中。

现在，插件将与存储在 Docker Hub 上的图像一起使用（使用来自插件配置的 `image`）。为了确保插件是本地构建的，而不是从上游库获取的，请确保在你的 `config.yaml` 文件中将 `image` 键注释掉（你可以在前面添加 `#`，例如 `#image: xxx`）。

## 本地构建

如果你不想使用开发容器环境，你仍然可以使用 Docker 在本地构建插件。推荐的方法是使用 [官方构建工具][hassio-builder] 来创建 Docker 镜像。

假设你的插件在 `/path/to/addon` 文件夹中，并且你的 Docker 套接字在 `/var/run/docker.sock`，你可以通过运行下列命令为所有受支持的架构构建插件：

```shell
docker run \
  --rm \
  -it \
  --name builder \
  --privileged \
  -v /path/to/addon:/data \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  ghcr.io/home-assistant/amd64-builder \
  -t /data \
  --all \
  --test \
  -i my-test-addon-{arch} \
  -d local
```

如果你不想使用官方构建工具，你仍然可以使用独立的 Docker 进行构建。如果你使用 `FROM $BUILD_FROM`，你需要使用构建参数设置基础镜像。通常你可以使用以下基础镜像：

- armhf: `ghcr.io/home-assistant/armhf-base:latest`
- aarch64: `ghcr.io/home-assistant/aarch64-base:latest`
- amd64: `ghcr.io/home-assistant/amd64-base:latest`
- i386: `ghcr.io/home-assistant/i386-base:latest`

从包含插件文件的目录使用 `docker` 构建测试插件：

```shell
docker build \
  --build-arg BUILD_FROM="ghcr.io/home-assistant/amd64-base:latest" \
  -t local/my-test-addon \
  .
```

[hassio-builder]: https://github.com/home-assistant/builder

## 本地运行

如果你不想使用开发容器环境，你仍然可以使用 Docker 在本地运行插件。

为此，你可以使用以下命令：

```shell
docker run \
  --rm \
  -v /tmp/my_test_data:/data \
  -p PORT_STUFF_IF_NEEDED \
  local/my-test-addon
```

## 日志

所有的 `stdout` 和 `stderr` 输出都被重定向到 Docker 日志。可以通过 Home Assistant 中 Supervisor 面板的插件页面获取日志。