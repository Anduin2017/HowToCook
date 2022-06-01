const { readdir, writeFile, stat } = require('fs/promises');
const fs = require('fs').promises;

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

    const MKDOCS_TEMPLATE = await fs.readFile("./.github/templates/mkdocs_template.yml", "utf-8");
    const README_TEMPLATE = await fs.readFile("./.github/templates/readme_template.md", "utf-8");

    await writeFile(
      README_PATH,
      README_TEMPLATE
        .replace('{{before}}', README_BEFORE.trim())
        .replace('{{main}}', README_MAIN.trim())
        .replace('{{after}}', README_AFTER.trim()),
    );


    await writeFile(
      MKDOCS_PATH,
      MKDOCS_TEMPLATE
        .replace('{{before}}', MKDOCS_BEFORE)
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
