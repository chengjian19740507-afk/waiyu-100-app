# 海外旅游日常用语150句 · 多语种入门

**作者 / Author**：北极虎

## 版权声明 / Copyright

© 2026 北极虎。保留所有权利。

本项目源码仅供个人学习参考，**未经作者书面授权，禁止任何形式的商业用途、转载、二次分发或衍生作品**。

For commercial use, redistribution, or derivative works, written permission from the author (北极虎) is required.

## 功能

英 / 西 / 法 / 俄 / 日 / 韩 / 阿 7 语种切换，文字 + 罗马字 + 中文翻译 + 浏览器原生语音合成（TTS）。支持顶部搜索框，按中文/外语/罗马字实时过滤当前语种句子。

**在线访问**：https://chengjian19740507-afk.github.io/waiyu-100-app/

- **7 语种切换**：英语 / 西班牙语 / 法语 / 俄语 / 日语 / 韩语 / 阿拉伯语（العربية）
- 每个语种 160 句常用日常表达（18 类别）
- 18 大类别（含旅游实用）：问候 / 自我介绍 / 机场海关 / **签证类型** / 宾馆入住 / 前台常用 / 饮食 / 交通 / 购物 / 时间日期 / 问路 / 数字 / 家庭 / 常用表达 / 餐厅 / 医疗 / 旅游实用
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

## 赞赏支持

打开页面底部的双码卡片（横排），任选一种扫码即可支持北极虎持续创作。

- 微信赞赏码：见页面底部 `tip-card.png`
- 支付宝收款码：见页面底部 `tip-alipay.png`
- Buy Me a Coffee：https://www.buymeacoffee.com/jimmaa （待替换为正式链接）

## 关联项目

| 项目 | 链接 |
|---|---|
| 海外旅游日常用语150句（本仓） | https://github.com/chengjian19740507-afk/waiyu-100-app |

> 注：阿拉伯语 100 句原独立仓 `arabic-100-app` 已废弃，相关内容已合并至本仓（阿语 160 句 / 18 类别）。

## License

© 2026 北极虎 · 保留所有权利。  
未经授权禁止商业用途、转载、二次分发或衍生作品。