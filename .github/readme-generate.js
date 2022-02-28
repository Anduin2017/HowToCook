const { readdir, writeFile, stat } = require('fs/promises');

const ignorePaths = ['.git', 'README.md', 'node_modules', 'CONTRIBUTING.md', '.github'];

const categories = {
  'home-cooking': {
    title: '家常菜',
    template: '',
  },
  breakfast: {
    title: '早餐',
    template: '',
  },
  staple: {
    title: '主食',
    template: '',
  },
  'semi-finished': {
    title: '半成品加工',
    template: '',
  },
  soup: {
    title: '汤与粥',
    template: '',
  },
  drink: {
    title: '饮料',
    template: '',
  },
  condiment: {
    title: '酱料和其它材料',
    template: '',
  },
  dessert: {
    title: '甜品',
    template: '',
  },
};

let README_TEMPLATE = `# 程序员做饭指南

[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/Anduin2017/HowToCook/Continuous%20Integration/master)](https://github.com/Anduin2017/HowToCook/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/Anduin2017/HowToCook)](./LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/Anduin2017/HowToCook)](https://github.com/Anduin2017/HowToCook/graphs/contributors)

最近在家隔离，出不了门。只能宅在家做饭了。作为程序员，我偶尔在网上找找菜谱和做法。但是这些菜谱往往写法千奇百怪，经常中间莫名出来一些材料。对于习惯了形式语言的程序员来说极其不友好。

所以，我计划自己搜寻菜谱和并结合实际做菜的经验，准备用更清晰精准的描述来整理常见菜的做法，以方便程序员在家做饭。

同样，我希望它是一个由社区驱动和维护的开源项目，使更多人能够一起做一个有趣的仓库。所以非常欢迎大家贡献它~

## 如何贡献

针对发现的问题，直接修改并提交 Pull request 即可。

在写新菜谱时，请复制并修改已有的菜谱模板: [示例菜](https://github.com/Anduin2017/HowToCook/blob/master/dishes/template/%E7%A4%BA%E4%BE%8B%E8%8F%9C/%E7%A4%BA%E4%BE%8B%E8%8F%9C.md?plain=1)。
在提交 Pull Request 前更新一下 README.md 里的引用。

## 做菜之前

{{before}}
## 菜谱
{{main}}
## 进阶知识学习

如果你已经做了许多上面的菜，对于厨艺已经入门，并且想学习更加高深的烹饪技巧，请继续阅读下面的内容：

{{after}}`;

async function main() {
  try {
    let BEFORE = (MAIN = AFTER = '');
    const markdownObj = await getAllMarkdown('.');
    for (const markdown of markdownObj) {
      if (markdown.path.includes('tips/advanced')) {
        AFTER += inlineTemplate(markdown.file, markdown.path, true);
        continue;
      }
      if (markdown.path.includes('tips')) {
        BEFORE += inlineTemplate(markdown.file, markdown.path, true);
        continue;
      }

      for (const category of Object.keys(categories)) {
        if (markdown.path.includes(category)) {
          let currentCategoryStr = categories[category].template;
          currentCategoryStr += inlineTemplate(markdown.file, markdown.path);
          categories[category].template = currentCategoryStr;
        }
      }
    }

    for (const category of Object.values(categories)) {
      MAIN += categoryTemplate(category.title, category.template);
    }

    await writeFile(
      './README.md',
      README_TEMPLATE.replace('{{before}}', BEFORE)
        .replace('{{main}}', MAIN)
        .replace('{{after}}', AFTER),
    );
  } catch (error) {
    console.error(error);
  }
}

async function getAllMarkdown(path) {
  const paths = [];
  const files = await readdir(path);
  // chinese alphabetic order
  files.sort((a, b) => a.localeCompare(b, 'zh-CN'));

  // mtime order
  // files.sort(async (a, b) => {
  //   const aStat = await stat(`${path}/${a}`);
  //   const bStat = await stat(`${path}/${b}`);
  //   return aStat.mtime - bStat.mtime;
  // });
  for (const file of files) {
    const filePath = `${path}/${file}`;
    if (ignorePaths.includes(file)) continue;
    const fileStat = await stat(filePath);
    if (fileStat.isFile() && file.endsWith('.md')) {
      paths.push({ path, file });
    } else if (fileStat.isDirectory()) {
      const subFiles = await getAllMarkdown(filePath);
      paths.push(...subFiles);
    }
  }
  return paths;
}

function inlineTemplate(file, path) {
  return `* [${file.replace('.md', '')}](${path}/${file})\n`;
}

function categoryTemplate(title, inlineStr) {
  return `\n### ${title}\n\n${inlineStr}`;
}

main();
