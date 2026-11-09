# create-mesh-avatar-studio

## 简体中文

一条命令搭建 [Mesh Avatar Studio](https://github.com/shinshin86/mesh-avatar-studio),并使用简体中文提示:

```sh
npx create-mesh-avatar-studio --lang zh
```

该命令会用 Git 将仓库下载到 `mesh-avatar-studio/`(或你指定的目录),安装依赖包并检查所需工具。
完成后启动编辑器:

```sh
cd mesh-avatar-studio
npm run dev
```

需要 Node.js 22.17+ 和 Git。也可以指定目录,例如 `npx create-mesh-avatar-studio my-avatars --lang zh`。
未显式指定 `--lang` 时,默认跟随系统区域设置(中文环境自动使用简体中文)。

进入目录后,随时可用 `npm run doctor -- --lang zh` 重新检查环境;
用插画创建虚拟形象可运行 `npm run create -- <image.png> --lang zh`(发送给编程助手的指令保持英文)。
更多中文说明见本仓库的 [README.md](../../README.md)(中文汉化版主文档)。

---

Set up [Mesh Avatar Studio](https://github.com/shinshin86/mesh-avatar-studio) in one command.

<p align="center">
  <img src="https://raw.githubusercontent.com/shinshin86/mesh-avatar-studio/main/docs/images/face-tracking.gif" width="400" alt="A Mesh Avatar Studio avatar following a face through a webcam">
</p>

```sh
npx create-mesh-avatar-studio
```

It downloads the repository with Git into `mesh-avatar-studio/` (or the folder you name),
installs its packages and checks the tools it needs. Then start the editor:

```sh
cd mesh-avatar-studio
npm run dev
```

Requires Node.js 22.17+ and Git.

## Options

```sh
npx create-mesh-avatar-studio my-avatars   # choose the folder
npx create-mesh-avatar-studio --lang ja    # messages in Japanese (default follows your locale)
npx create-mesh-avatar-studio --lang zh    # messages in Simplified Chinese
```

## What the check reports

The same check runs any time with `npm run doctor` inside the folder.

| Tool | Needed for |
|---|---|
| Node.js 22.17+ and the installed packages | The editor and the Live page. Missing ones are errors. |
| uv and Python 3.10+ | Rebuilding layers and creating avatars. Missing ones are warnings. |
| Playwright Chromium | Rendering the motion review when an agent creates an avatar or imports drawn eyes and mouths. A missing browser is a warning. |

To try an avatar without installing anything, open the
[Player](https://shinshin86.github.io/mesh-avatar-studio/play/) in Chrome or Edge.

## License

MIT. See [LICENSE](./LICENSE).
