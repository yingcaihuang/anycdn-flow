# AnyCDN Flow - 可视化 CDN 加速工作流构建器

<div align="center">

![AnyCDN Flow Logo](https://img.shields.io/badge/AnyCDN-Flow-blue?style=for-the-badge&logo=react)

[![Version](https://img.shields.io/badge/version-1.8.0-green.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue.svg)](https://www.typescriptlang.org/)

**基于 Block 的可视化 CDN 加速工作流构建器**

[快速开始](#快速开始) • [功能特性](#功能特性) • [架构设计](#架构设计) • [开发指南](#开发指南) • [贡献指南](#贡献指南)

</div>

## 🌟 项目概述

AnyCDN Flow 是一个现代化的可视化多融合CDN加速工作流构建器，灵感来源于 [fxdreema.com/builder](https://fxdreema.com/builder) 的 Block 设计理念。通过直观的拖拽式界面，用户可以轻松构建、配置和管理复杂的多供应商CDN融合加速策略。

### 🎯 设计理念

- **可视化优先**: 通过直观的图形界面替代复杂的配置文件
- **模块化设计**: 每个功能都是独立的可重用组件
- **实时反馈**: 提供即时的性能监控和状态反馈
- **易于扩展**: 开放的架构支持自定义节点和功能

## ✨ 功能特性

### 🧩 多供应商组件库

#### 🏢 按供应商分组

# anycdn-flow

|--------|------|------|
| **阿里云** | CDN、OSS、WAF、DCDN、图片优化 | 阿里云全栈CDN解决方案 |
| **AWS** | CloudFront、S3、WAF、Shield、Lambda Edge | Amazon Web Services CDN生态 |
| **Cloudflare** | CDN、Workers、WAF、Images、Analytics | Cloudflare边缘计算平台 |
| **通用组件** | 源站服务器、负载均衡、缓存、优化、安全、监控 | 跨供应商通用功能 |
|------|------|------|
| **数据源** | 源站服务器、OSS、S3 | 原始内容存储和访问 |
| **缓存层** | 边缘缓存、区域缓存、浏览器缓存 | 多级缓存策略 |
| **优化处理** | 图片优化、代码压缩、Gzip/Brotli | 内容优化和压缩 |
| **安全防护** | WAF、DDoS防护、SSL终止 | 全方位安全保护 |
| **监控分析** | 数据分析、性能监控、告警系统 | 实时监控和分析 |
| **路由调度** | 地理路由、智能路由、故障转移 | 智能流量调度 |

### 🎨 用户界面

- **现代化设计**: 基于 Tailwind CSS 的美观界面
- **响应式布局**: 适配各种屏幕尺寸
- **暗色主题**: 支持明暗主题切换（计划中）
- **国际化**: 多语言支持（计划中）

### ⚡ 核心功能

- **拖拽式构建**: 直观的可视化工作流编辑器
- **实时预览**: 工作流变更的即时反馈
- **配置管理**: 每个节点的详细参数配置
- **状态监控**: 实时的节点状态和性能指标
### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/anycdn-flow.git
   cd anycdn-flow
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

4. **打开浏览器**
   
   访问 [http://localhost:3000](http://localhost:3000) 开始使用

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

## 🏗️ 架构设计

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.2.0 | 前端框架 |
| TypeScript | 5.0.2 | 类型安全 |
| ReactFlow | 11.10.1 | 工作流引擎 |
| Tailwind CSS | 3.3.3 | 样式框架 |
| Zustand | 4.4.1 | 状态管理 |
| Vite | 4.4.5 | 构建工具 |
| Lucide React | 0.263.1 | 图标库 |

### 项目结构

```
src/
├── components/          # React 组件
│   ├── nodes/          # 节点组件
│   ├── Header.tsx      # 顶部导航
│   ├── Sidebar.tsx     # 侧边栏
│   └── WorkflowBuilder.tsx  # 主工作流编辑器
├── config/             # 配置文件
│   └── nodeTypes.ts    # 节点类型定义
├── store/              # 状态管理
│   └── WorkflowStore.tsx    # 工作流状态
├── types/              # TypeScript 类型定义
│   └── index.ts
└── main.tsx           # 应用入口
```

### 核心概念

#### 节点类型 (Node Types)
每个 CDN 功能都被抽象为一个节点类型，包含：
- **配置模式**: 定义可配置的参数
- **视觉表示**: 图标、颜色、布局
- **业务逻辑**: 功能实现和数据处理

#### 工作流 (Workflow)
由节点和连接组成的有向图，表示 CDN 的数据流向和处理流程。

#### 状态管理
使用 Zustand 进行轻量级状态管理，支持：
- 工作流的 CRUD 操作
- 节点选择和配置
- 执行状态跟踪

## 🛠️ 开发指南

### 添加新的节点类型

1. **定义节点类型**
   ```typescript
   // src/types/index.ts
   export enum CDNNodeType {
     YOUR_NEW_NODE = 'your-new-node',
   }
   ```

2. **配置节点**
   ```typescript
   // src/config/nodeTypes.ts
   [CDNNodeType.YOUR_NEW_NODE]: {
     type: CDNNodeType.YOUR_NEW_NODE,
     label: '您的新节点',
     description: '节点描述',
     category: 'optimization',
     icon: 'settings',
     color: '#3b82f6',
     defaultConfig: {
       // 默认配置
     },
     configSchema: [
       // 配置字段定义
     ],
   }
   ```

3. **创建图标映射**
   ```typescript
   // src/components/Sidebar.tsx 和 nodes/CDNNodeComponent.tsx
   const iconMap = {
     'your-icon': YourIconComponent,
   };
   ```

### 自定义样式

项目使用 Tailwind CSS，可以通过以下方式自定义：

1. **修改主题配置**
   ```javascript
   // tailwind.config.js
   theme: {
     extend: {
       colors: {
         primary: {
           // 自定义主色调
         }
       }
     }
   }
   ```

2. **添加自定义组件样式**
   ```css
   /* src/index.css */
   @layer components {
     .your-custom-class {
       @apply bg-blue-500 text-white rounded-lg;
     }
   }
   ```

### 调试技巧

- **React DevTools**: 安装浏览器扩展查看组件状态
- **Redux DevTools**: 查看 Zustand 状态变化
- **网络面板**: 监控 API 请求和响应
- **控制台日志**: 使用 `console.log` 调试关键逻辑

## 📊 性能优化

### 代码分割
```typescript
// 使用 React.lazy 进行组件懒加载
const NodeConfigPanel = React.lazy(() => import('./NodeConfigPanel'));
```

### 内存优化
- 使用 `React.memo` 避免不必要的重渲染
- 合理使用 `useCallback` 和 `useMemo`
- 及时清理事件监听器和定时器

### 构建优化
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@headlessui/react', 'lucide-react'],
        }
      }
    }
  }
});
```

## 🧪 测试

### 单元测试
```bash
npm run test
# 或
yarn test
```

### E2E 测试（计划中）
```bash
npm run test:e2e
# 或
yarn test:e2e
```

## 📦 部署

### 静态部署
```bash
# 构建生产版本
npm run build

# 部署到静态托管服务
# 如 Vercel, Netlify, GitHub Pages 等
```

### Docker 部署
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献方式

1. **报告问题**: 在 GitHub Issues 中提交 bug 报告
2. **功能建议**: 提出新功能的想法和建议
3. **代码贡献**: 提交 Pull Request
4. **文档改进**: 完善项目文档
5. **测试用例**: 增加测试覆盖率

### 开发流程

1. Fork 项目到您的 GitHub 账户
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add some amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 创建 Pull Request

### 代码规范

- 使用 TypeScript 编写类型安全的代码
- 遵循 ESLint 配置的代码风格
- 编写清晰的注释和文档
- 保持组件的单一职责原则

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [ReactFlow](https://reactflow.dev/) - 强大的工作流引擎
- [Tailwind CSS](https://tailwindcss.com/) - 优秀的 CSS 框架
- [Lucide](https://lucide.dev/) - 美观的图标库
- [fxDreema](https://fxdreema.com/) - 设计灵感来源

## 📞 联系方式

- 项目主页: [https://github.com/your-username/anycdn-flow](https://github.com/your-username/anycdn-flow)
- 问题反馈: [GitHub Issues](https://github.com/your-username/anycdn-flow/issues)
- 讨论交流: [GitHub Discussions](https://github.com/your-username/anycdn-flow/discussions)

---

<div align="center">

**如果这个项目对您有帮助，请给它一个 ⭐️！**

Made with ❤️ by [Betty](https://github.com/your-username)

</div>
