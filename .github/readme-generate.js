const { readdir, writeFile, stat } = require('fs/promises');

const README_PATH = './README.md';

const MKDOCS_PATH = 'mkdocs.yml';

const ignorePaths = ['.git', 'README.md', 'node_modules', 'CONTRIBUTING.md', '.github'];

const categories = {
  vegetable_dish: {
    title: '素菜',
    readme: '',
    mkdocs: '',
  },
  meat_dish: {
    title: '荤菜',
    readme: '',
    mkdocs: '',
  },
  aquatic: {
    title: '水产',
    readme: '',
    mkdocs: '',
  },
  breakfast: {
    title: '早餐',
    readme: '',
    mkdocs: '',
  },
  staple: {
    title: '主食',
    readme: '',
    mkdocs: '',
  },
  'semi-finished': {
    title: '半成品加工',
    readme: '',
    mkdocs: '',
  },
  soup: {
    title: '汤与粥',
    readme: '',
    mkdocs: '',
  },
  drink: {
    title: '饮料',
    readme: '',
    mkdocs: '',
  },
  condiment: {
    title: '酱料和其它材料',
    readme: '',
    mkdocs: '',
  },
  dessert: {
    title: '甜品',
    readme: '',
    mkdocs: '',
  },
};

let README_TEMPLATE = `# 程序员做饭指南

[![build](https://github.com/Anduin2017/HowToCook/actions/workflows/build.yml/badge.svg)](https://github.com/Anduin2017/HowToCook/actions/workflows/build.yml)
[![License](https://img.shields.io/github/license/Anduin2017/HowToCook)](./LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/Anduin2017/HowToCook)](https://github.com/Anduin2017/HowToCook/graphs/contributors)
[![npm](https://img.shields.io/npm/v/how-to-cook)](https://www.npmjs.com/package/how-to-cook)

最近在家隔离，出不了门。只能宅在家做饭了。作为程序员，我偶尔在网上找找菜谱和做法。但是这些菜谱往往写法千奇百怪，经常中间莫名出来一些材料。对于习惯了形式语言的程序员来说极其不友好。

所以，我计划自己搜寻菜谱和并结合实际做菜的经验，准备用更清晰精准的描述来整理常见菜的做法，以方便程序员在家做饭。

同样，我希望它是一个由社区驱动和维护的开源项目，使更多人能够一起做一个有趣的仓库。所以非常欢迎大家贡献它~

## 如何贡献

针对发现的问题，直接修改并提交 Pull request 即可。

在写新菜谱时，请复制并修改已有的菜谱模板: [示例菜](https://github.com/Anduin2017/HowToCook/blob/master/dishes/template/%E7%A4%BA%E4%BE%8B%E8%8F%9C/%E7%A4%BA%E4%BE%8B%E8%8F%9C.md?plain=1)。

## 做菜之前

{{before}}
## 菜谱

### 家常菜
{{main}}
## 进阶知识学习

如果你已经做了许多上面的菜，对于厨艺已经入门，并且想学习更加高深的烹饪技巧，请继续阅读下面的内容：

{{after}}`;

let MKDOCS_TEMPLATE = `site_name: How To Cook

# Repository
repo_name: Anduin2017/HowToCook
repo_url: https://github.com/Anduin2017/HowToCook
edit_uri: ""

use_directory_urls: true
docs_dir: .
theme:
  name: material
  language: zh
  features:
    - content.code.annotate
    # - content.tabs.link
    # - header.autohide
    #- navigation.expand
    #- navigation.indexes
    - navigation.instant
    - navigation.sections
    - navigation.tabs
    - navigation.tabs.sticky
    - navigation.top
    - navigation.tracking
    - search.highlight
    - search.share
    - search.suggest
    - toc.follow
    # # - toc.integrate
  search_index_only: true
  palette:
    - media: "(prefers-color-scheme: light)"
      scheme: default
      toggle:
        icon: material//weather-sunny
        name: Switch to dark mode
    - media: "(prefers-color-scheme: dark)"
      scheme: slate
      toggle:
        icon: material/weather-night
        name: Switch to light mode

  icon:
    admonition:
      note: octicons/tag-16
      abstract: octicons/checklist-16
      info: octicons/info-16
      tip: octicons/squirrel-16
      success: octicons/check-16
      question: octicons/question-16
      warning: octicons/alert-16
      failure: octicons/x-circle-16
      danger: octicons/zap-16
      bug: octicons/bug-16
      example: octicons/beaker-16
      quote: octicons/quote-16

markdown_extensions:
  - admonition
  - pymdownx.details
  - pymdownx.superfences
  - abbr
  - pymdownx.snippets
  - def_list
  - pymdownx.tasklist:
      custom_checkbox: true
  - attr_list

plugins:
  - same-dir
  - search
  - minify:
      minify_html: true

nav:
  - README.md
  - 做菜之前:
{{before}}
  - 菜谱:
    - 按种类: # 只有两层section以上才能出现navigation expansion https://squidfunk.github.io/mkdocs-material/setup/setting-up-navigation/#navigation-sections
{{main}}
  - 进阶知识学习:
{{after}}
  - CONTRIBUTING.md
`;

async function main() {
  try {
    let README_BEFORE = (README_MAIN = README_AFTER = '');
    let MKDOCS_BEFORE = (MKDOCS_MAIN = MKDOCS_AFTER = '');
    const markdownObj = await getAllMarkdown('.');
    for (const markdown of markdownObj) {
      if (markdown.path.includes('tips/advanced')) {
        README_AFTER += inlineReadmeTemplate(markdown.file, markdown.path);
        MKDOCS_AFTER += inlineMkdocsTemplate(markdown.file, markdown.path);
        continue;
      }

      if (markdown.path.includes('tips')) {
        README_BEFORE += inlineReadmeTemplate(markdown.file, markdown.path);
        MKDOCS_BEFORE += inlineMkdocsTemplate(markdown.file, markdown.path);
        continue;
      }

      for (const category of Object.keys(categories)) {
        if (!markdown.path.includes(category)) continue;
        categories[category].readme += inlineReadmeTemplate(markdown.file, markdown.path);
        categories[category].mkdocs += inlineMkdocsTemplate(
          markdown.file,
          markdown.path,
          true,
        );
      }
    }

    for (const category of Object.values(categories)) {
      README_MAIN += categoryReadmeTemplate(category.title, category.readme);
      MKDOCS_MAIN += categoryMkdocsTemplate(category.title, category.mkdocs);
    }

    await writeFile(
      README_PATH,
      README_TEMPLATE.replace('{{before}}', README_BEFORE)
        .replace('{{main}}', README_MAIN)
        .replace('{{after}}', README_AFTER),
    );

    await writeFile(
      MKDOCS_PATH,
      MKDOCS_TEMPLATE.replace('{{before}}', MKDOCS_BEFORE)
        .replace('{{main}}', MKDOCS_MAIN)
        .replace('{{after}}', MKDOCS_AFTER),
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

function inlineReadmeTemplate(file, path) {
  return `- [${file.replace('.md', '')}](${path}/${file})\n`;
}

function categoryReadmeTemplate(title, inlineStr) {
  return `\n### ${title}\n\n${inlineStr}`;
}

function inlineMkdocsTemplate(file, path, isDish = false) {
  return `${' '.repeat(isDish ? 10 : 6)}- ${file.replace('.md', '')}: ${path}/${file}\n`;
}

function categoryMkdocsTemplate(title, inlineStr) {
  return `\n${' '.repeat(6)}- ${title}:\n${inlineStr}`;
}

main();
