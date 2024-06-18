# 程序员做饭指南

[![build](https://github.com/Anduin2017/HowToCook/actions/workflows/build.yml/badge.svg)](https://github.com/Anduin2017/HowToCook/actions/workflows/build.yml)
[![License](https://img.shields.io/github/license/Anduin2017/HowToCook)](./LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/Anduin2017/HowToCook)](https://github.com/Anduin2017/HowToCook/graphs/contributors)
[![npm](https://img.shields.io/npm/v/how-to-cook)](https://www.npmjs.com/package/how-to-cook)
![Man hours](https://manhours.aiursoft.cn/r/github.com/anduin2017/howtocook.svg)
[![Docker](https://img.shields.io/badge/docker-latest-blue?logo=docker)](https://github.com/Anduin2017/HowToCook/pkgs/container/how-to-cook)

最近在家隔离，出不了门。只能宅在家做饭了。作为程序员，我偶尔在网上找找菜谱和做法。但是这些菜谱往往写法千奇百怪，经常中间莫名出来一些材料。对于习惯了形式语言的程序员来说极其不友好。

所以，我计划自己搜寻菜谱并结合实际做菜的经验，准备用更清晰精准的描述来整理常见菜的做法，以方便程序员在家做饭。

同样，我希望它是一个由社区驱动和维护的开源项目，使更多人能够一起做一个有趣的仓库。所以非常欢迎大家贡献它~

## 本地部署

如果需要在本地部署菜谱 Web 服务，可以在安装 Docker 后运行下面命令：

```bash
docker pull ghcr.io/anduin2017/how-to-cook:latest
docker run -d -p 5000:5000 ghcr.io/anduin2017/how-to-cook:latest
```

如需下载 PDF 版本，可以在浏览器中访问 [/document.pdf](https://cook.aiursoft.cn/document.pdf)

## 如何贡献

针对发现的问题，直接修改并提交 Pull request 即可。

在写新菜谱时，请复制并修改已有的菜谱模板: [示例菜](https://github.com/Anduin2017/HowToCook/blob/master/dishes/template/%E7%A4%BA%E4%BE%8B%E8%8F%9C/%E7%A4%BA%E4%BE%8B%E8%8F%9C.md?plain=1)。

## 做菜之前

{{before}}

## 菜谱

{{index_stars}}

{{main}}

## 进阶知识学习

如果你已经做了许多上面的菜，对于厨艺已经入门，并且想学习更加高深的烹饪技巧，请继续阅读下面的内容：

{{after}}
