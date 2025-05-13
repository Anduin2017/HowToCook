const util = require("util");
const glob = util.promisify(require('glob'));
const fs = require("fs").promises;
const path = require('path');

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
// glob 模式，定位菜谱 Markdown 文件和所有文件
const DISHES_GLOB = path.resolve(__dirname, '../../dishes/**/*.md');
const ALL_FILES_GLOB = path.resolve(__dirname, '../../dishes/**/*');

// 工具函数：获取文件大小，返回字节数
async function getFileSize(filePath) {
  try {
    const { size } = await fs.stat(filePath);
    return size;
  } catch (err) {
    console.error(`检查文件大小时出错: ${filePath} -> ${err.message}`);
    return 0;
  }
}

// 工具函数：读取文件内容并按行返回
async function readLines(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  return content.split('\n').map(line => line.trim());
}

// 校验函数集合
const validators = [
  
  async (filePath, lines, errors) => {
    const name = path.parse(filePath).base;
    if (name.includes(' ')) {
      errors.push(`文件 ${filePath} 文件名不能包含空格！`);
    }
  },

  
  async (filePath, lines, errors) => {
    const filename = path.parse(filePath).name;
    const expectedTitle = `# ${filename}的做法`;
    const titles = lines.filter(l => l.startsWith('#'));
    
    if (!titles.length || titles[0] !== expectedTitle) {
      errors.push(`文件 ${filePath} 主标题应为 "${expectedTitle}"，当前为 "${titles[0] || ''}"！`);
      return;
    }
    
    const sections = lines.filter(l => l.startsWith('## '));
    const required = ['## 必备原料和工具', '## 计算', '## 操作', '## 附加内容'];
    required.forEach((sec, idx) => {
      if (sections[idx] !== sec) {
        errors.push(`文件 ${filePath} 第${idx+1}个二级标题应为 "${sec}"，当前为 "${sections[idx] || ''}"！`);
      }
    });
    
    const start = lines.indexOf(expectedTitle) + 1;
    const firstSecIndex = lines.indexOf(sections[0]);
    const fragment = lines.slice(start, firstSecIndex);
    const diffLine = fragment.find(l => /^预估烹饪难度：★{1,5}$/.test(l));
    if (!diffLine) {
      errors.push(`文件 ${filePath} 缺少 "预估烹饪难度：★n" (1-5颗)！`);
    }
  },

  
  async (filePath, lines, errors) => {
    const count = keyword => lines.filter(l => l.includes(keyword)).length;
    
    if (count('勺') > count('勺子') + count('炒勺') + count('漏勺') + count('吧勺')) {
      errors.push(`文件 ${filePath} “勺”不是精准单位！`);
    }
    
    if (count(' 杯') > count('杯子')) {
      errors.push(`文件 ${filePath} “杯”不是精准单位！`);
    }
    
    ['适量', '少许'].forEach(w => {
      if (count(w) > 0) {
        errors.push(`文件 ${filePath} “${w}”不是精准描述！请用 克(g) 或 毫升(ml)。`);
      }
    });
    
    if (count('min') > 0) {
      errors.push(`文件 ${filePath} “min”含义不明确，请改成“分钟”。`);
    }
    
    if (count('左右') > 0) {
      errors.push(`文件 ${filePath} “左右”不够明确，建议使用“大约”。`);
    }
    
    ['你', '我'].forEach(pronoun => {
      if (count(pronoun) > 0) {
        errors.push(`文件 ${filePath} 不可出现人称代词“${pronoun}”。`);
      }
    });
  },

  
  async (filePath, lines, errors) => {
    const hasPortion = lines.some(l => l.includes('份数'));
    const hasTotal = lines.some(l => l.includes('总量'));
    const hasTemplateLine = lines.some(l => l.includes('每次制作前需要确定计划做几份。一份正好够'));
    if (hasPortion && (!hasTotal || !hasTemplateLine)) {
      errors.push(`文件 ${filePath} 使用“份数”需同时包含“总量”及“每次制作前需要确定计划做几份……”说明！`);
    }
    if (lines.some(l => l.includes('每人') || l.includes('人数'))) {
      errors.push(`文件 ${filePath} 请基于每道菜/每份为基准，不可基于人数！`);
    }
  },

  
  async (filePath, lines, errors) => {
    const footer = '如果您遵循本指南的制作流程而发现有问题或可以改进的流程，请提出 Issue 或 Pull request 。';
    if (!lines.includes(footer)) {
      errors.push(`文件 ${filePath} 缺少模板结尾：“${footer}”`);
    }
  }
];


async function main() {
  const errors = [];
  // 获取所有文件和 Markdown 文件路径
  const allPaths = await glob(ALL_FILES_GLOB);
  const mdPaths = await glob(DISHES_GLOB);

  // 检查文件大小和扩展名
  for (const p of allPaths) {
    const size = await getFileSize(p);
    if (size > MAX_FILE_SIZE) {
      errors.push(`文件 ${p} 超过 1MB 大小限制 (${(size/1048576).toFixed(2)}MB)！`);
    }
    const ext = path.extname(p);
    if (!ext) {
      errors.push(`文件 ${p} 缺少扩展名！`);
    }
  }

  // 对 Markdown 文件逐项校验内容
  for (const p of mdPaths) {
    const lines = await readLines(p);
    for (const validate of validators) {
      await validate(p, lines, errors);
    }
  }

  // 输出错误并退出
  if (errors.length) {
    errors.forEach(e => console.error(e));
    throw new Error(`Found ${errors.length} errors! Please fix!`);
  }
}


main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
