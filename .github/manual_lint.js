const util = require("util");
const glob = util.promisify(require('glob'));
const fs = require("fs").promises;
const path = require('path');

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
// glob 模式，定位菜谱 Markdown 文件和所有文件
const DISHES_GLOB = path.resolve(__dirname, '../dishes/**/*.md');
const ALL_FILES_GLOB = path.resolve(__dirname, '../dishes/**/*');

// 工具函数：获取文件状态，包括大小
async function getFileStats(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats;
  } catch (err) {
    console.error(`检查文件状态时出错: ${filePath} -> ${err.message}`);
    return null;
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
    const filenameWithoutExt = path.parse(filePath).name; // .name 是不带扩展名的文件名
    if (filenameWithoutExt.includes(' ')) {
      errors.push(`文件 ${filePath} 不符合仓库的规范！文件名不能包含空格！ (当前文件名: ${filenameWithoutExt})`);
    }
  },

  
  async (filePath, lines, errors) => {
    const filenameWithoutExt = path.parse(filePath).name;
    const expectedMainTitle = `# ${filenameWithoutExt}的做法`;
    const titles = lines.filter(l => l.startsWith('#'));

    if (!titles.length || titles[0] !== expectedMainTitle) {
      errors.push(`文件 ${filePath} 不符合仓库的规范！它的大标题应该是: "${expectedMainTitle}"! 而它现在是 "${titles[0] || '未找到主标题'}"!`);
      return;
    }

    const sections = lines.filter(l => l.startsWith('## '));
    const requiredSections = ['## 必备原料和工具', '## 计算', '## 操作', '## 附加内容'];

    
    if (sections.length !== requiredSections.length) {
        errors.push(`文件 ${filePath} 不符合仓库的规范！它并不是四个二级标题的格式 (应为 ${requiredSections.length} 个，实际 ${sections.length} 个)。请从示例菜模板中创建菜谱！请不要破坏模板的格式！`);
        return;
    }

    requiredSections.forEach((sec, idx) => {
      if (sections[idx] !== sec) {
        let titleName = "";
        if (idx === 0) titleName = "第一个";
        else if (idx === 1) titleName = "第二个";
        else if (idx === 2) titleName = "第三个";
        else if (idx === 3) titleName = "第四个";

        errors.push(`文件 ${filePath} 不符合仓库的规范！${titleName}标题不是 ${sec}! (当前为: "${sections[idx] || '未找到'}")`);
      }
    });

    // 检查烹饪难度
    const mainTitleIndex = titles.length > 0 ? lines.indexOf(titles[0]) : -1;
    const firstSecondTitleIndex = sections.length > 0 ? lines.indexOf(sections[0]) : -1;

    if (mainTitleIndex >= 0 && firstSecondTitleIndex >= 0 && mainTitleIndex < firstSecondTitleIndex) {
      const contentBetweenTitles = lines.slice(mainTitleIndex + 1, firstSecondTitleIndex);
      let hasDifficultyLine = false;
      const difficultyPatternGeneral = /^预估烹饪难度：(★*)$/;
      const difficultyPatternStrict = /^预估烹饪难度：★{1,5}$/;

      for (const line of contentBetweenTitles) {
        if (difficultyPatternGeneral.test(line)) {
          hasDifficultyLine = true;
          if (!difficultyPatternStrict.test(line)) {
            const starMatch = line.match(/★/g);
            const starCount = starMatch ? starMatch.length : 0;
            errors.push(`文件 ${filePath} 不符合仓库的规范！烹饪难度的星星数量必须在1-5颗之间！(当前为 ${starCount} 颗)`);
          }
          break;
        }
      }
      if (!hasDifficultyLine) {
        errors.push(`文件 ${filePath} 不符合仓库的规范！在大标题和第一个二级标题之间必须包含"预估烹饪难度：★★"格式的难度评级，星星数量必须在1-5颗之间！`);
      }
    } else if (mainTitleIndex === -1 || firstSecondTitleIndex === -1) {
        errors.push(`文件 ${filePath} 结构错误，无法定位烹饪难度区域。`);
    }
  },

  
  async (filePath, lines, errors) => {
    const count = keyword => lines.filter(l => l.includes(keyword)).length;

    if (count('勺') > count('勺子') + count('炒勺') + count('漏勺') + count('吧勺')) {
      errors.push(`文件 ${filePath} 不符合仓库的规范！勺 不是一个精准的单位！`);
    }
    if (count(' 杯') > count('杯子')) {
      errors.push(`文件 ${filePath} 不符合仓库的规范！杯 不是一个精准的单位！`);
    }
    ['适量', '少许'].forEach(w => {
      if (count(w) > 0) {
        errors.push(`文件 ${filePath} 不符合仓库的规范！${w} 不是一个精准的描述！请给出克 g 或毫升 ml。`);
      }
    });
    if (count('min') > 0) {
      errors.push(`文件 ${filePath} 不符合仓库的规范！min 这个词汇有多重含义。建议改成中文"分钟"。`);
    }
    if (count('左右') > 0) {
      errors.push(`文件 ${filePath} 不符合仓库的规范！左右 不是一个能够明确定量的标准! 如果是在描述一个模糊物体的特征，请使用 '大约'。例如：鸡（大约1kg）`);
    }
    ['你', '我'].forEach(pronoun => {
      if (count(pronoun) > 0) {
        errors.push(`文件 ${filePath} 不符合仓库的规范！请不要出现人称代词。`);
      }
    });
  },

  
  async (filePath, lines, errors) => {
    const hasPortion = lines.some(l => l.includes('份数'));
    const hasTotal = lines.some(l => l.includes('总量'));
    const hasTemplateLine = lines.some(l => l.includes('每次制作前需要确定计划做几份。一份正好够'));

    if (hasPortion && (!hasTotal || !hasTemplateLine)) {
      errors.push(`文件 ${filePath} 不符合仓库的规范！它使用份数作为基础，这种情况下一般是一次制作，制作多份的情况。请标明：总量 并写明 '每次制作前需要确定计划做几份。一份正好够 几 个人食用。'。`);
    }
    if (lines.some(l => l.includes('每人') || l.includes('人数'))) {
      errors.push(`文件 ${filePath} 不符合仓库的规范！请基于每道菜\\每份为基准。不要基于人数。人数是一个可能会导致在应用中发生问题的单位。如果需要面向大量的人食用，请标明一个人需要几份。`);
    }
  },

  
  async (filePath, lines, errors) => {
    const footer = '如果您遵循本指南的制作流程而发现有问题或可以改进的流程，请提出 Issue 或 Pull request 。';
    if (!lines.includes(footer)) {
      errors.push(`文件 ${filePath} 不符合仓库的规范！ 它没有包含必需的附加内容！，需要在最后一行添加模板中的【${footer}】`);
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
    const stats = await getFileStats(p);
    if (!stats) { // 如果获取状态失败，跳过后续检查
        errors.push(`无法获取文件状态: ${p}，跳过此文件的检查。`);
        continue;
    }

    if (stats.size > MAX_FILE_SIZE) {
      errors.push(`文件 ${p} 超过了1MB大小限制 (${(stats.size/1048576).toFixed(2)}MB)! 请压缩图片或分割文件。`);
    }

    // 检查扩展名
    if (stats.isFile()) {
      const ext = path.extname(p);
      if (!ext) {
        errors.push(`文件 ${p} 不符合仓库的规范！文件必须有扩展名！`);
      }
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
    errors.forEach(e => console.error(e + "\n"));
    const message = `Found ${errors.length} errors! Please fix!`;
    throw new Error(message);
  } else {
    console.log("所有检查已通过！没有发现错误。");
  }
}


main().catch(err => {
  console.error("\n" + err.message);
  process.exit(1);
});
