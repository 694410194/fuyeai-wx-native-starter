# fuyeai-wx-native-starter

副业 AI 微信原生小程序通用脚手架，基于 **TypeScript + MobX + TDesign + SCSS**，开箱即用，适合作为业务项目的起始模板。

## 项目简介

该模板聚焦于「企业项目可落地」场景，内置了常见的基础能力：

- TypeScript 严格模式配置（减少线上低级错误）
- MobX 全局状态管理（含登录态持久化）
- `request` 二次封装（Token 注入、统一错误处理、401 自动跳转）
- 隐私授权检查工具（适配微信隐私政策流程）
- 多环境 API 基地址切换（develop / trial / release）
- TDesign 组件库集成与全局样式入口

## 技术栈

- **小程序框架**：微信原生小程序
- **语言**：TypeScript 5
- **状态管理**：mobx-miniprogram + mobx-miniprogram-bindings
- **UI 组件**：tdesign-miniprogram
- **样式**：SCSS（通过微信开发者工具构建）

## 快速开始

### 1）安装依赖

```bash
npm install
```

### 2）导入微信开发者工具

1. 打开微信开发者工具
2. 选择「导入项目」
3. 项目目录选择仓库根目录
4. `AppID` 可先使用 `touristappid`（体验/开发）
5. 确认 `project.config.json` 中 `srcMiniprogramRoot` 为 `src/`

### 3）构建 npm

首次运行（或新增 npm 依赖）后，在微信开发者工具执行：

`工具 -> 构建 npm`

你也可以通过命令提醒：

```bash
npm run build:npm
```

### 4）运行与调试

- 在微信开发者工具直接编译预览
- 默认首页：`pages/index/index`
- 演示登录页：`pages/login/login`

## 可用脚本

```bash
# TypeScript 类型检查
npm run type-check

# 提示你在微信开发者工具执行“构建 npm”
npm run build:npm
```

## 目录结构

```text
.
├── src
│   ├── api                  # API 层（按业务模块拆分）
│   │   └── index.ts
│   ├── pages                # 页面
│   │   ├── index            # 首页：登录态展示 + 请求示例
│   │   └── login            # 登录页：模拟登录流程
│   ├── store                # 全局状态（MobX）
│   │   ├── index.ts
│   │   └── user.ts
│   ├── styles               # 全局样式
│   │   └── app.scss
│   ├── utils                # 工具层
│   │   ├── privacy.ts       # 隐私授权检查
│   │   ├── request.ts       # 请求封装
│   │   └── runtime.ts       # 小程序环境识别
│   ├── app.json
│   ├── app.scss
│   └── app.ts
├── package.json
├── project.config.json
└── tsconfig.json
```

## 核心能力说明

### 1）登录态管理（MobX + 本地持久化）

`src/store/user.ts` 提供以下能力：

- `token` 与 `userInfo` 的可观察状态
- `login` / `logout` 统一入口
- 启动时从本地缓存恢复状态
- 登录前隐私授权校验（`checkPrivacy`）

### 2）请求封装（统一拦截逻辑）

`src/utils/request.ts` 提供：

- 自动拼接 `baseURL`
- 自动注入 `Authorization: Bearer <token>`
- 统一处理错误提示
- `401` 自动清空登录态并跳转登录页
- `request.get` / `request.post` 快捷方法

### 3）环境识别与多环境网关

`src/utils/runtime.ts` 通过 `wx.getAccountInfoSync()` 判断当前环境：

- `develop`（开发版）
- `trial`（体验版）
- `release`（正式版）

`request` 中默认网关策略：

- `release` -> `https://api.fuyeai.cn/api`
- `develop` / `trial` -> `http://localhost:3000/api`

> 如需改成你自己的网关地址，直接修改 `src/utils/request.ts` 的 `getBaseURL` 即可。

### 4）隐私授权检查

`src/utils/privacy.ts` 对 `wx.requirePrivacyAuthorize` 做了统一封装：

- 低版本基础库自动兜底
- 未同意隐私协议时统一提示
- 方便在关键能力调用前复用

## 开发建议

### 新增一个业务 API

1. 在 `src/api/` 新建模块（如 `order.ts`）
2. 调用 `request<T>()` 并声明返回类型
3. 页面层只处理业务数据，不重复写请求通用逻辑

### 新增一个页面

1. 在 `src/pages/` 下创建页面目录
2. 在 `src/app.json` 的 `pages` 中注册
3. 按需在页面 `.json` 中声明 TDesign 组件

### 新增全局状态

1. 在 `src/store/` 新增 store 文件
2. 使用 `makeAutoObservable` 管理状态与 action
3. 页面内通过 `createStoreBindings` 绑定并在 `onUnload` 释放

## 常见问题

### Q1：为什么组件样式或 TDesign 不生效？

- 请先在微信开发者工具执行一次 `工具 -> 构建 npm`
- 检查是否生成了 `src/miniprogram_npm/`

### Q2：为什么请求本地接口失败？

- 开发环境默认请求 `http://localhost:3000/api`
- 请确认本地服务已启动，并检查开发者工具的域名与网络设置

### Q3：`@/` 路径别名失效怎么办？

- 已在 `tsconfig.json` 与 `app.json`（`resolveAlias`）配置
- 若仍异常，尝试重启微信开发者工具并重新构建 npm

## 后续可扩展方向

- 接入真实 `wx.login` + 后端鉴权
- 增加分模块 API（用户、订单、支付）
- 封装更完整的错误码与重试机制
- 增加 ESLint / Prettier / 单元测试

---

如果你愿意，我还可以继续帮你补一版：

- 「面向团队协作」版 README（含提交流程、分支规范、发布流程）
- 「面向业务开发」版 README（含页面模板、接口模板、store 模板）
