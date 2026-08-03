# 出境无忧180句 · 7 语种速查

**作者 / Author**：北极虎

## 版权声明 / Copyright

© 2026 北极虎。保留所有权利。

本项目源码仅供个人学习参考，**未经作者书面授权，禁止任何形式的商业用途、转载、二次分发或衍生作品**。

For commercial use, redistribution, or derivative works, written permission from the author (北极虎) is required.

## 功能

英 / 西 / 法 / 俄 / 日 / 韩 / 阿 7 语种切换，文字 + 罗马字 + 中文翻译 + 浏览器原生语音合成（TTS）。支持顶部搜索框，按中文/外语/罗马字实时过滤当前语种句子。

**在线访问**：https://chengjian19740507-afk.github.io/waiyu-100-app/

- **7 语种切换**：英语 / 西班牙语 / 法语 / 俄语 / 日语 / 韩语 / 阿拉伯语（العربية）
- 每个语种 180 句常用日常表达（18 类别）
- 18 大类别：问候 / 自我介绍 / 机场海关 / 宾馆入住 / 前台常用 / 饮食 / 交通 / 购物 / 时间日期 / 问路 / 数字 / 家庭 / 常用表达 / 餐厅 / 医疗 / **工作场景** / **社交礼仪** / 旅游实用
- 文字 + 罗马字/拼音 + 中文翻译三行对照
- **顶部搜索框**：实时过滤当前语种，匹配中文翻译 / 外语 / 罗马字三字段
- 浏览器原生 SpeechSynthesis 发音（无需 mp3 音频文件）
- 响应式设计，手机 / 平板 / 电脑自适应
- PWA-ready（移动端可添加到主屏幕）
- 阿语支持 RTL（从右往左）显示
- 微信赞赏卡片 `tip-card.png`（程序化渲染，中文 100% 准确）

## 技术栈

- 纯静态 HTML + CSS + JavaScript，无任何依赖
- SpeechSynthesis API（Chrome / Safari / Edge 自带，无需联网）
- localStorage 保存语种偏好
- GitHub Pages 托管
- 赞赏卡片使用 Playwright (Chromium headless) 程序化渲染

## 数据结构

每个 `sentences-{lang}.json` 含 160 条：

```json
{
  "id": 1,
  "category": "greetings",
  "category_zh": "问候",
  "text": "Bonjour",
  "romanization": "Bonjour",
  "translation": "你好"
}
```

## 本地运行

```bash
python3 -m http.server 8000
# 访问 http://localhost:8000
```

注意：`SpeechSynthesis` 要求页面通过 HTTP(S) 协议访问，不能直接打开 file://。

## 赞赏支持 / 解锁机制

本应用由 **北极虎** 独立维护。免费仅 `问候 + 自我介绍` 两类（共 20 句），其他 **15 类共 140 句** 需要打赏后解锁。

### 🆓 免费内容（20 句）

- 问候（greetings）
- 自我介绍（intro）

### 🔒 付费内容（140 句 · 解锁后可用）

机场海关 · 签证类型 · 宾馆入住 · 前台常用 · 饮食 · 交通 · 购物 · 时间日期 · 问路 · 数字 · 家庭 · 常用表达 · 餐厅 · 医疗 · 旅游实用

### 💝 打赏方式（任选其一）

- **微信赞赏码**：见页面底部 `tip-card.png`
- **支付宝收款码**：见页面底部 `tip-alipay.png`

### 🔑 解锁码获取流程

1. 任一渠道打赏（任意金额均可）
2. 微信联系 **北极虎** 提供打赏截图
3. 获取解锁码 → 在付费弹窗输入 → 本设备永久解锁

> 一个解锁码可在多个设备重复使用。无期限，不绑定手机号。

### 📌 解锁码获取

解锁码 **不在公开文档中明文显示**（任何人都能看到 GitHub README）。

打赏后微信联系 **北极虎** 私聊索取 → 输入到付费弹窗即可解锁。

### ⚙️ 技术说明

- 静态站点，无后端校验（GitHub Pages 托管）
- 解锁码以 **SHA256 哈希** 存于 `app.js`（`UNLOCK_HASH` 常量），原始码仅打赏用户可知
- 解锁状态保存在 `localStorage['paid']='1'`
- 清除浏览器数据可重置锁定状态
- **更换解锁码**：`shasum -a 256 <<< "新码"` → 替换 `app.js` 中 `UNLOCK_HASH` → `git push`

## 关联项目

| 项目 | 链接 |
|---|---|
| 海外旅游日常用语150句（本仓） | https://github.com/chengjian19740507-afk/waiyu-100-app |

> 注：阿拉伯语 100 句原独立仓 `arabic-100-app` 已废弃，相关内容已合并至本仓（阿语 160 句 / 18 类别）。

---

## Changelog

- **2026-08-02** · `953f61f` 付费门控（greetings/intro 免费，15 类解锁后用）
- **2026-08-02** · `71ede5f` 声音设置弹窗（手动选择 voice）
- **2026-08-02** · `213514b` TTS 修复（显式选最佳 voice + 预加载）
- **2026-08-02** · `62f8d27` og:image 1200×630 + 顶部 hero section + PWA manifest

## License

© 2026 北极虎 · 保留所有权利。  
未经授权禁止商业用途、转载、二次分发或衍生作品。