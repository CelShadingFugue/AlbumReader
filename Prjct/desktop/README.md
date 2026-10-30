# AlbumReader Desktop

桌面端图片 / 压缩包查看器的 Electron 初始化工程。

当前版本：`0.1.0`  
技术栈：**Electron Forge + Vite + TypeScript + React**

## 先回答：Electron 有自己的 IDE 吗？

**没有。** Electron 官方没有提供完整的项目 IDE，因此本次在 `Prjct/desktop/` 进行了手动初始化，而不是等待 IDE 安装。

容易混淆的两个东西：

| 工具                                                 | 性质                                    | 是否适合本项目                          |
| ---------------------------------------------------- | --------------------------------------- | --------------------------------------- |
| [Electron Fiddle](https://www.electronjs.org/fiddle) | 官方提供的 Electron 实验 / 代码片段工具 | 适合验证小 Demo，不适合长期维护完整工程 |
| [Electron Forge](https://www.electronforge.io/)      | 官方项目脚手架与打包工具链              | 已使用                                  |
| VS Code                                              | 编辑器                                  | 推荐，已安装即可                        |

如果换一台机器重新安装工具链：

```powershell
# Node.js LTS（Electron 和 Vite 的运行基础）
winget install OpenJS.NodeJS.LTS

# 推荐编辑器
winget install Microsoft.VisualStudioCode

# 可选：只用于快速试验 Electron 小片段
winget install ElectronCommunity.ElectronFiddle
```

Electron 本身是项目依赖，**不需要全局安装**。

## 本机运行

```powershell
cd D:\START\MyWorks\Practice\AlbumReader\Prjct\desktop

# 首次运行
corepack enable
corepack prepare pnpm@12.16.1 --activate
pnpm install

# 开发模式：启动 Vite + Electron
pnpm start
```

如果机器上没有 Corepack，也可以：

```powershell
npm install -g pnpm@12.16.1
```

常用命令：

| 命令             | 用途                              |
| ---------------- | --------------------------------- |
| `pnpm start`     | 开发模式，带 Vite HMR 与 DevTools |
| `pnpm typecheck` | TypeScript 类型检查               |
| `pnpm lint`      | Oxlint + Oxfmt 检查               |
| `pnpm lint:fix`  | 自动修复 lint 与格式              |
| `pnpm check`     | 类型检查 + lint                   |
| `pnpm package`   | 生成未安装版应用目录              |
| `pnpm make`      | 生成平台安装包                    |

## 目录结构

```text
Prjct/desktop/
├─ src/
│  ├─ main.ts                 # Electron 主进程入口（组合根）
│  ├─ preload.ts              # 唯一的浏览器桥接层
│  ├─ main/
│  │  ├─ ipc.ts               # IPC：桌面端后端 API
│  │  └─ security.ts          # CSP、导航与窗口安全策略
│  ├─ shared/
│  │  └─ contracts.ts         # 主进程 / 渲染进程共享的稳定契约
│  └─ renderer/
│     ├─ App.tsx              # 页面状态与业务编排
│     ├─ components/          # 布局与交互组件
│     ├─ data/                # 当前的前端演示数据
│     ├─ domain/              # 前端领域类型
│     ├─ lib/                 # 视图辅助函数
│     └─ styles/global.css    # Design tokens + 全部界面样式
├─ index.html
├─ forge.config.mts
└─ vite.*.config.mts
```

### 为什么这样分层

- `src/renderer` 只负责 UI、交互和视图状态，不直接接触文件系统。
- `src/main` 负责窗口、文件系统、原生对话框。未来 Rust / C++ 核心层也从这里接入。
- `src/preload.ts` 只暴露少量、可序列化、带类型的方法；绝不暴露 `ipcRenderer`。
- `src/shared/contracts.ts` 是不依赖 Node/Electron 的边界，未来换核心实现时保持稳定。
- 当前真实文件扫描尚未接入，画廊使用 `data/mockCatalog.ts` 中的演示数据；右上角「打开工作区」已经能调用原生文件夹选择器。

## 日常开发方式：新增一个能力

以「扫描工作区图片」为例，按下面的顺序添加：

1. **定义契约**：在 `src/shared/contracts.ts` 增加通道名和返回类型。
2. **实现主进程服务**：在 `src/main/` 添加扫描服务，并在 `ipc.ts` 注册 handler。
3. **收窄 preload**：在 `src/preload.ts` 暴露一个语义明确的方法。
4. **渲染层调用**：通过页面 service / hook 调用 `window.albumReader.*`，组件只消费视图数据。
5. **保持可替换**：让 Rust/C++ 核心藏在主进程服务后面，而不是把 FFI 细节写进 React 组件。

### 不要打破的三条边界

- `nodeIntegration: false`，`contextIsolation: true`，`sandbox: true`。
- 渲染进程不直接 `import fs`、`child_process` 或 `ipcRenderer`。
- IPC 返回值保持可序列化；文件句柄、原生指针等不要传给渲染层。

## 关于后续安卓端

现在不做 Flutter 适配层，避免过早抽象。只需要守住「界面 → 共享契约 → 核心服务」的边界：

- 桌面端：Electron 渲染层 → preload → 主进程 → Rust/C++ 核心。
- 安卓端：Flutter 界面 → 平台桥接 → 同一套 Rust/C++ 核心。

这也是当前不把业务逻辑写进 React 组件、不提前引入复杂状态管理框架的原因。等真实扫描、缩略图缓存、压缩包读取等需求稳定后，再决定核心层用 Rust 还是 C++。若没有既有 C++ 资产，个人项目建议优先评估 Rust（内存安全、跨平台构建、后续 Android FFI 工具链较完整）。

## 设计资料

界面布局、动画和官方学习资源见：

- [前端设计入门与资源](../../DesignIdeas/前端设计入门与资源.md)
- 当前暗色原型截图：[albumreader-prototype-dark.png](../../DesignIdeas/assets/albumreader-prototype-dark.png)

## 当前已验证

- `pnpm typecheck` 通过
- `pnpm lint` 通过
- pnpm start 可以启动 Electron 窗口并加载 React 界面
- pnpm package 已验证可以生成 Windows 应用目录
- 打包版中 preload 桥接可用，渲染层能读取 14 张演示图片
