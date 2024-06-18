const { readdir, writeFile, stat } = require('fs/promises');
const fs = require('fs').promises;
const path = require('path');

const README_PATH = './README.md';
const MKDOCS_PATH = 'mkdocs.yml';
const dishesFolder = 'dishes';
const starsystemFolder = 'starsystem';

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

async function countStars(filename) {
  const data = await fs.readFile(filename, 'utf-8');
  let stars = 0;
  const lines = data.split('\n');
  lines.forEach(line => {
    stars += (line.match(/★/g) || []).length;
  });
  return stars;
}

async function organizeByStars(dishesFolder, starsystemFolder) {
  const dishes = {};

  async function processFolder(folderPath) {
    const files = await readdir(folderPath);
    for (const filename of files) {
      const filepath = path.join(folderPath, filename);
      const fileStat = await stat(filepath);
      if (fileStat.isFile() && filename.endsWith('.md')) {
        const stars = await countStars(filepath);
        dishes[filepath] = stars;
      } else if (fileStat.isDirectory()) {
        await processFolder(filepath);
      }
    }
  }

  const dishesFolderAbs = path.resolve(dishesFolder);
  const starsystemFolderAbs = path.resolve(starsystemFolder);

  if (!await fs.access(starsystemFolderAbs).then(() => true).catch(() => false)) {
    await fs.mkdir(starsystemFolderAbs, { recursive: true });
  }

  if (!await fs.access(dishesFolderAbs).then(() => true).catch(() => false)) {
    console.log(`Directory not found: ${dishesFolderAbs}, creating directory...`);
    await fs.mkdir(dishesFolderAbs, { recursive: true });
  }

  await processFolder(dishesFolderAbs);

  const starRatings = Array.from(new Set(Object.values(dishes))).sort((a, b) => a - b);
  const navigationLinks = []; 

  for (const stars of starRatings) {
    const starsFile = path.join(starsystemFolderAbs, `${stars}Star.md`);
    const content = [`# ${stars} 星难度菜品`, ''];
    for (const [filepath, starCount] of Object.entries(dishes)) {
      if (starCount === stars) {
        const relativePath = path.relative(starsystemFolderAbs, filepath).replace(/\\/g, '/');
        content.push(`* [${path.basename(filepath, '.md')}](./${relativePath})`);
      }
    }
    await writeFile(starsFile, content.join('\n'), 'utf-8');
    navigationLinks.push(`- [${stars} 星难度](${path.relative(path.dirname(README_PATH), starsFile).replace(/\\/g, '/')})`);
    }

  return navigationLinks;
}

async function main() {
  try {
    let README_BEFORE = '', README_MAIN = '', README_AFTER = '';
    let MKDOCS_BEFORE = '', MKDOCS_MAIN = '', MKDOCS_AFTER = '';
    const markdownObj = await getAllMarkdown('.');
    
    // Debug logging to understand the structure of markdownObj
    console.log("Markdown Object Structure:", JSON.stringify(markdownObj, null, 2));
    
    for (const markdown of markdownObj) {
      console.log("Processing markdown:", markdown);
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

    let MKDOCS_TEMPLATE;
    let README_TEMPLATE;

    try {
      MKDOCS_TEMPLATE = await fs.readFile("./.github/templates/mkdocs_template.yml", "utf-8");
    } catch (error) {
      MKDOCS_TEMPLATE = `site_name: My Docs\nnav:\n  {{main}}\n`;
      console.warn("mkdocs_template.yml not found, using default template");
    }

    try {
      README_TEMPLATE = await fs.readFile("./.github/templates/readme_template.md", "utf-8");
    } catch (error) {
      README_TEMPLATE = `# My Project\n\n{{before}}\n\n{{main}}\n\n{{after}}`;
      console.warn("readme_template.md not found, using default template");
    }

    const navigationLinks = await organizeByStars(dishesFolder, starsystemFolder);
    // Debug logging to ensure navigationLinks is defined and contains data
    console.log("难度索引", navigationLinks);
    const navigationSection = `\n### 按难度索引\n\n${navigationLinks.join('\n')}`;

    await writeFile(
      README_PATH,
      README_TEMPLATE
        .replace('{{before}}', README_BEFORE.trim())
        .replace('{{index_stars}}', navigationSection.trim())
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

    // Organize files by star rating
    //await organizeByStars(dishesFolder, starsystemFolder);
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

function inlineMkdocsTemplate(file, path, isDish = false) {
  return `${' '.repeat(isDish ? 10 : 6)}- ${file.replace('.md', '')}: ${path}/${file}\n`;
}

function categoryMkdocsTemplate(title, inlineStr) {
  return `\n${' '.repeat(6)}- ${title}:\n${inlineStr}`;
}

main();
