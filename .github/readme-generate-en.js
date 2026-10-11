const { readdir, writeFile, stat } = require('fs/promises');
const fs = require('fs').promises;
const path = require('path');

const EN_ROOT = './en';
const README_PATH = './en/README.md';
const ignorePaths = ['README.md', 'template'];

const categories = {
  vegetable_dish: {
    title: 'Vegetable Dishes',
    readme: '',
  },
  meat_dish: {
    title: 'Meat Dishes',
    readme: '',
  },
  aquatic: {
    title: 'Seafood',
    readme: '',
  },
  breakfast: {
    title: 'Breakfast',
    readme: '',
  },
  staple: {
    title: 'Staples',
    readme: '',
  },
  'semi-finished': {
    title: 'Semi-finished Foods',
    readme: '',
  },
  soup: {
    title: 'Soups and Congee',
    readme: '',
  },
  drink: {
    title: 'Drinks',
    readme: '',
  },
  condiment: {
    title: 'Sauces and Other Ingredients',
    readme: '',
  },
  dessert: {
    title: 'Desserts',
    readme: '',
  },
};

async function main() {
  try {
    let README_BEFORE = '', README_MAIN = '', README_AFTER = '';
    const markdownObj = await getAllMarkdown(EN_ROOT);

    for (const markdown of markdownObj) {
      // Paths in en/README.md are relative to en/.
      const relPath = path.relative(EN_ROOT, markdown.path).split(path.sep).join('/');

      if (relPath.startsWith('tips/advanced')) {
        README_AFTER += inlineReadmeTemplate(markdown.title, relPath, markdown.file);
        continue;
      }

      if (relPath.startsWith('tips')) {
        README_BEFORE += inlineReadmeTemplate(markdown.title, relPath, markdown.file);
        continue;
      }

      for (const category of Object.keys(categories)) {
        if (relPath !== `dishes/${category}`) continue;
        categories[category].readme += inlineReadmeTemplate(markdown.title, relPath, markdown.file);
      }
    }

    for (const category of Object.values(categories)) {
      README_MAIN += categoryReadmeTemplate(category.title, category.readme);
    }

    let README_TEMPLATE;

    try {
      README_TEMPLATE = await fs.readFile('./.github/templates/readme_template_en.md', 'utf-8');
    } catch (error) {
      README_TEMPLATE = `# How To Cook\n\n{{before}}\n\n{{main}}\n\n{{after}}`;
      console.warn('readme_template_en.md not found, using default template');
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

// Collects every markdown file under dir, with its title taken from the H1.
// Files are sorted by title within each folder.
async function getAllMarkdown(dir) {
  const files = [];
  const subDirs = [];

  for (const file of await readdir(dir)) {
    if (ignorePaths.includes(file)) continue;
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);
    if (fileStat.isFile() && file.endsWith('.md')) {
      const content = await fs.readFile(filePath, 'utf-8');
      files.push({ path: dir, file, title: getTitle(content, file) });
    } else if (fileStat.isDirectory()) {
      subDirs.push(filePath);
    }
  }

  files.sort((a, b) => a.title.localeCompare(b.title, 'en'));
  subDirs.sort((a, b) => a.localeCompare(b, 'en'));

  const paths = [...files];
  for (const subDir of subDirs) {
    paths.push(...await getAllMarkdown(subDir));
  }
  return paths;
}

function getTitle(content, file) {
  const match = content.match(/^#\s+(.+)$/m);
  if (!match) return file.replace('.md', '');
  return match[1].trim().replace(/^How to Make /, '');
}

function inlineReadmeTemplate(title, dir, file) {
  return `- [${title}](./${dir}/${file})\n`;
}

function categoryReadmeTemplate(title, inlineStr) {
  return `\n### ${title}\n\n${inlineStr}`;
}

main();
