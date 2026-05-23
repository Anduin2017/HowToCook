# 程序员做饭指南

[![License](https://img.shields.io/github/license/Anduin2017/HowToCook)](./LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/Anduin2017/HowToCook)](https://github.com/Anduin2017/HowToCook/graphs/contributors)
[![Man hours](https://manhours.aiursoft.com/r/github.com/Anduin2017/HowToCook.svg)](https://manhours.aiursoft.com/r/github.com/Anduin2017/HowToCook.html)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fhowtocook.aiursoft.com)](https://howtocook.aiursoft.com)
[![Docker](https://img.shields.io/docker/pulls/aiursoft/howtocookviewer.svg)](https://hub.docker.com/r/aiursoft/howtocookviewer)

最近宅在家做饭，作为程序员，我偶尔在网上找找菜谱和做法。但是这些菜谱往往写法千奇百怪，经常中间莫名出来一些材料。对于习惯了形式语言的程序员来说极其不友好。

所以，我计划自己搜寻菜谱并结合实际做菜的经验，准备用更清晰精准的描述来整理常见菜的做法，以方便程序员在家做饭。

同样，我希望它是一个由社区驱动和维护的开源项目，使更多人能够一起做一个有趣的仓库。所以非常欢迎大家贡献它~

## 浏览菜谱

请直接访问 HowToCook 网站浏览菜谱可视化：

[https://howtocook.aiursoft.com/](https://howtocook.aiursoft.com/)

## 本地部署

如果需要在本地部署菜谱 Web 服务，可以在安装 Docker 后运行下面命令：

```bash
docker pull aiursoft/howtocookviewer
docker run -d -p 5000:5000 aiursoft/howtocookviewer
```

默认用户名密码: `admin`,`Admin@123456!`。启动后 30 分钟内会自动索引。

## 如何贡献

针对发现的问题，直接修改并提交 Pull request 即可。

在写新菜谱时，请复制并修改已有的菜谱模板: [示例菜](https://github.com/Anduin2017/HowToCook/blob/master/dishes/template/%E7%A4%BA%E4%BE%8B%E8%8F%9C/%E7%A4%BA%E4%BE%8B%E8%8F%9C.md?plain=1)。

## 搭建环境

{{before}}

## 菜谱

{{main}}

## 进阶知识学习

如果你已经做了许多上面的菜，对于厨艺已经入门，并且想学习更加高深的烹饪技巧，请继续阅读下面的内容：

{{after}}

## 衍生作品推荐

- [图像化菜谱：支持在线预览与 PDF 导出](https://king-jingxiang.github.io/HowToCook/)
- [HowToCook-mcp 让 AI 助手变身私人大厨，为你的一日三餐出谋划策](https://github.com/worryzyy/HowToCook-mcp)
- [HowToCook-py-mcp 让 AI 助手变身私人大厨，为你的一日三餐出谋划策 (Python)](https://github.com/DusKing1/howtocook-py-mcp)
- [whatToEat 今天吃什么？的决策工具，帮助你快速选择合适的菜谱。](https://github.com/ryanuo/whatToEat)
- [厨房计划：开源中文菜谱 API - 由社区贡献，人人可用](https://proj.kitchen)
