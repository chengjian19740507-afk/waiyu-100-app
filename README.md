# 外语日常生活100句 · 多语种入门

英 / 西 / 法 / 俄 4 语种切换，文字 + 拼音 + 中文翻译 + 浏览器原生语音合成（TTS）。

**在线访问**：https://chengjian19740507-afk.github.io/waiyu-100-app/

## 功能

- 4 语种切换：英语 / 西班牙语 / 法语 / 俄语
- 每个语种 100 句常用日常表达
- 10 大类别：问候 / 自我介绍 / 饮食 / 交通 / 购物 / 时间 / 问路 / 数字 / 家庭 / 常用
- 文字 + 拼音/罗马化 + 中文翻译三行对照
- 浏览器原生 SpeechSynthesis 发音（无需 mp3 音频文件）
- 响应式设计，手机 / 平板 / 电脑自适应
- PWA-ready（移动端可添加到主屏幕）

## 技术栈

- 纯静态 HTML + CSS + JavaScript，无任何依赖
- SpeechSynthesis API（Chrome / Safari / Edge 自带，无需联网）
- localStorage 保存语种偏好
- GitHub Pages 托管

## 数据结构

每个 `sentences-{lang}.json` 含 100 条：

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

## 关联项目

| 项目 | 链接 |
|---|---|
| 阿语日常生活100句 | https://github.com/chengjian19740507-afk/arabic-100-app |
| 外语日常生活100句（本仓） | https://github.com/chengjian19740507-afk/waiyu-100-app |

## License

MIT