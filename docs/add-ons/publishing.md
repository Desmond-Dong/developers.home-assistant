---
title: "发布您的插件"
---

有两种不同的插件发布方式。一种是将预构建的容器发布到容器注册表，另一种是让用户在其 Home Assistant 实例上本地构建容器。

#### 预构建的容器

使用预构建的容器，开发者负责在其机器上为每种架构构建镜像并将结果推送到容器注册表。这对用户有很多优点，用户只需下载最终的容器，一旦下载完成即可开始使用。这使得安装过程快速且几乎没有失败的可能性，因此这是首选的方法。

我们已经自动化了构建和发布插件的过程。请参阅下面的说明。

#### 本地构建容器

通过 Supervisor，分发将在用户机器上构建的插件是可能的。优点是作为开发者，很容易测试一个想法，并查看人们是否对您的插件感兴趣。这种方法包括安装和可能编译代码。这意味着安装这样的插件比较慢，并且比上面提到的预构建解决方案对用户的 SD 卡/硬盘造成更多磨损。如果容器的某个依赖项发生了变化或不再可用，它的失败几率也更高。

在您尝试插件并看看是否有人对您的工作感兴趣时使用此选项。一旦您成为一个成熟的仓库，请迁移到推送构建到容器注册表，因为这会极大地改善用户体验。将来，我们将在插件商店中标记本地构建的插件，以提醒用户。

## 发布插件到容器注册表的构建脚本

所有插件都是容器。在您的插件 `config.yaml` 中，您指定将为您的插件安装的容器镜像：

```yaml
...
image: "myhub/image-{arch}-addon-name"
...
```

您可以在镜像名称中使用 `{arch}` 以支持一个（1）配置文件下的多种架构。当我们加载镜像时，它将被替换为用户的架构。如果您使用 `Buildargs`，您可以使用 `build.yaml` 来覆盖我们的默认参数。

Home Assistant 假定您的插件仓库的默认分支与容器注册表上的最新标签匹配。当您构建新版本时，建议您使用另一个分支，例如 `build` 或通过 GitHub 进行 PR。在您将插件推送到容器注册表后，可以将此分支合并到主分支。

## 自定义插件

您需要一个 Docker Hub 账户来制作自己的插件。您可以使用 Docker 的 `build` 命令构建容器镜像，或者使用我们的 [builder] 来简化该过程。拉取我们的 [Builder Docker engine][builder] ，并运行以下命令之一。

对于 git 仓库：

```shell
docker run \
  --rm \
  --privileged \
  -v ~/.docker:/root/.docker \
  ghcr.io/home-assistant/amd64-builder \
  --all \
  -t addon-folder \
  -r https://github.com/xy/addons \
  -b branchname
```

对于本地仓库：

```shell
docker run \
  --rm \
  --privileged \
  -v ~/.docker:/root/.docker \
  -v /my_addon:/data \
  ghcr.io/home-assistant/amd64-builder \
  --all \
  -t /data
```

:::tip
如果您在 macOS 上开发并使用 Docker for Mac，您可能会遇到类似以下的错误信息：`error creating aufs mount to /var/lib/docker/aufs/mnt/<SOME_ID>-init: invalid argument`。一个建议的解决方法是通过 Docker > Preferences > Daemon > Advanced 在高级守护程序 JSON 配置中添加以下内容：`"storage-driver" : "aufs"` 或将 docker 套接字映射到容器中。
:::

[builder]: https://github.com/home-assistant/builder