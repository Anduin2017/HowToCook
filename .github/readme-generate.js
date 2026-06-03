const { readdir, writeFile, stat } = require('fs/promises');
const fs = require('fs').promises;
const path = require('path');

const README_PATH = './README.md';
const ignorePaths = ['.git', 'README.md', 'node_modules', 'CONTRIBUTING.md', '.github', 'en', 'site'];

const categories = {
  vegetable_dish: {
    title: '素菜',
    readme: '',
  },
  meat_dish: {
    title: '荤菜',
    readme: '',
  },
  aquatic: {
    title: '水产',
    readme: '',
  },
  breakfast: {
    title: '早餐',
    readme: '',
  },
  staple: {
    title: '主食',
    readme: '',
  },
  'semi-finished': {
    title: '半成品加工',
    readme: '',
  },
  soup: {
    title: '汤与粥',
    readme: '',
  },
  drink: {
    title: '饮料',
    readme: '',
  },
  condiment: {
    title: '酱料和其它材料',
    readme: '',
  },
  dessert: {
    title: '甜品',
    readme: '',
  },
};

async function main() {
  try {
    let README_BEFORE = '', README_MAIN = '', README_AFTER = '';
    const markdownObj = await getAllMarkdown('.');
    
    for (const markdown of markdownObj) {
      if (markdown.path.includes('tips/advanced')) {
        README_AFTER += inlineReadmeTemplate(markdown.file, markdown.path);
        continue;
      }

      if (markdown.path.includes('tips')) {
        README_BEFORE += inlineReadmeTemplate(markdown.file, markdown.path);
        continue;
      }

      for (const category of Object.keys(categories)) {
        if (!markdown.path.includes(category)) continue;
        categories[category].readme += inlineReadmeTemplate(markdown.file, markdown.path);
      }
    }

    for (const category of Object.values(categories)) {
      README_MAIN += categoryReadmeTemplate(category.title, category.readme);
    }

    let README_TEMPLATE;

    try {
      README_TEMPLATE = await fs.readFile("./.github/templates/readme_template.md", "utf-8");
    } catch (error) {
      README_TEMPLATE = `# My Project\n\n{{before}}\n\n{{main}}\n\n{{after}}`;
      console.warn("readme_template.md not found, using default template");
    }

    await writeFile(
      README_PATH,
      README_TEMPLATE
        .replace('{{before}}', README_BEFORE.trim())
        .replace('{{main}}', README_MAIN.trim())
        .replace('{{after}}', README_AFTER.trim()),
    );
  } catch (error) {
    console.error(error);
  }
}

async function getAllMarkdown(dir) {
  const paths = [];
  const files = await readdir(dir);
  files.sort((a, b) => a.localeCompare(b, 'zh-CN'));

  for (const file of files) {
    const filePath = path.join(dir, file);
    if (ignorePaths.includes(file)) continue;
    const fileStat = await stat(filePath);
    if (fileStat.isFile() && file.endsWith('.md')) {
      paths.push({ path: dir, file });
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

main();
