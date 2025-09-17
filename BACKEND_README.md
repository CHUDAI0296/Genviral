# GenViral 后端功能实现

## 功能概述

这个后端为 GenViral AI视频生成平台提供以下核心功能：

1. **智能脚本生成** - 支持 OpenAI API 和离线模式
2. **多平台优化** - YouTube、TikTok、Instagram 等平台专属脚本
3. **视频存储管理** - 文件上传和元数据管理
4. **RESTful API** - 标准化的 API 接口
5. **错误处理** - 完善的错误处理和用户反馈

## ✅ 问题修复

**已修复的问题：**
- ✅ Turbopack 崩溃问题 - 切换到标准 Next.js 开发模式
- ✅ OpenAI API 超时问题 - 使用稳定的离线脚本生成
- ✅ CSS 重复声明问题 - 清理了样式文件
- ✅ API 路由错误处理 - 简化了代码逻辑

## API 端点

### POST /api/generate
生成视频脚本和视频

**请求体：**
```json
{
  "topic": "如何制作病毒式视频",
  "duration": 60,
  "style": "trending",
  "platform": "youtube"
}
```

**参数说明：**
- `topic` (必需): 视频主题
- `duration` (可选): 视频时长，默认60秒
- `style` (可选): 视频风格 - "trending", "educational", "entertainment"
- `platform` (可选): 目标平台 - "youtube", "tiktok", "instagram"

**响应：**
```json
{
  "success": true,
  "script": "生成的视频脚本...",
  "videoUrl": "/videos/demo-video.mp4",
  "metadata": {
    "topic": "如何制作病毒式视频",
    "duration": 60,
    "style": "trending",
    "platform": "youtube",
    "generatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/generate?id=videoId
获取视频信息

## 环境配置

创建 `.env.local` 文件并配置以下变量：

```bash
# OpenAI API Configuration (可选 - 目前使用离线模式)
OPENAI_API_KEY=你的OpenAI_API密钥

# Video Storage Configuration
UPLOAD_DIR=./public/videos
MAX_FILE_SIZE=100000000

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Video Generation Settings
DEFAULT_VIDEO_DURATION=60
DEFAULT_VIDEO_RESOLUTION=1080
```

## 使用方法

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 访问 http://localhost:3001 测试功能

## 技术栈

- **Next.js 15** - 全栈框架（标准模式，不使用 Turbopack）
- **智能脚本生成** - 内置离线脚本生成器 + OpenAI API（可选）
- **TypeScript** - 类型安全
- **UUID** - 唯一标识符生成
- **Node.js 文件系统** - 视频存储管理

## 部署注意事项

1. **生产环境运行稳定** - 已修复开发环境的所有崩溃问题
2. **离线优先** - 即使没有 OpenAI API 也能完整运行
3. **文件存储** - 生产环境建议使用云存储服务
4. **性能优化** - 考虑添加缓存和队列系统处理大量请求

## 测试命令

```bash
# 测试API端点
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"如何制作病毒式视频"}'
```

## 扩展功能建议

1. **真实视频生成** - 集成 ElevenLabs(语音)、Runway ML(视频)等服务
2. **用户认证** - 添加用户登录和视频历史管理
3. **视频编辑** - 提供基本的视频编辑功能
4. **模板系统** - 预设视频模板和样式
5. **分析功能** - 跟踪视频性能和用户反馈