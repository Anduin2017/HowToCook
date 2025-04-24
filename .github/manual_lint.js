const util = require("util");
const glob = util.promisify(require('glob'));
const fs = require("fs").promises;
const path = require('path');

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

async function checkFileSize(filePath) {
    try {
        const stats = await fs.stat(filePath);
        return stats.size;
    } catch (error) {
        console.error(`Error checking file size for ${filePath}: ${error.message}`);
        return 0;
    }
}

async function main() {
    var errors = [];
    var directories = await glob(__dirname + '../../dishes/**/*.md');

    // Check all files in dishes directory for size
    var allFiles = await glob(__dirname + '../../dishes/**/*');

    // Check each file size
    for (var filePath of allFiles) {
        const fileSize = await checkFileSize(filePath);
        if (fileSize > MAX_FILE_SIZE) {
            errors.push(`文件 ${filePath} 超过了1MB大小限制 (${(fileSize/1048576).toFixed(2)}MB)! 请压缩图片或分割文件。`);
        }
    }

    // Check for files without extensions
    for (var filePath of allFiles) {
        const stats = await fs.stat(filePath);
        // Only check files (not directories)
        if (stats.isFile()) {
            const extension = path.extname(filePath);
            if (extension === '') {
                errors.push(`文件 ${filePath} 不符合仓库的规范！文件必须有扩展名！`);
            }
        }
    }

    for (var filePath of directories) {
        var data = await fs.readFile(filePath, 'utf8');
        var filename = path.parse(filePath).base.replace(".md","");

        if (filename.includes(' ')) {
            errors.push(`文件 ${filePath} 不符合仓库的规范！文件名不能包含空格！`);
        }
        
        dataLines = data.split('\n').map(t => t.trim());
        titles = dataLines.filter(t => t.startsWith('#'));
        secondTitles = titles.filter(t => t.startsWith('## '));

        if (dataLines.filter(line => line.includes('勺')).length > 
            dataLines.filter(line => line.includes('勺子')).length +
            dataLines.filter(line => line.includes('炒勺')).length +
            dataLines.filter(line => line.includes('漏勺')).length +
            dataLines.filter(line => line.includes('吧勺')).length) {
            errors.push(`文件 ${filePath} 不符合仓库的规范！勺 不是一个精准的单位！`);
        }
        if (dataLines.filter(line => line.includes(' 杯')).length > 
            dataLines.filter(line => line.includes('杯子')).length) {
            errors.push(`文件 ${filePath} 不符合仓库的规范！杯 不是一个精准的单位！`);
        }
        if (dataLines.filter(line => line.includes('适量')).length > 0) {
            errors.push(`文件 ${filePath} 不符合仓库的规范！适量 不是一个精准的描述！请给出克 g 或毫升 ml。`);
        }
        if (dataLines.filter(line => line.includes('每人')).length + dataLines.filter(line => line.includes('人数')).length > 0) {
            errors.push(`文件 ${filePath} 不符合仓库的规范！请基于每道菜\\每份为基准。不要基于人数。人数是一个可能会导致在应用中发生问题的单位。如果需要面向大量的人食用，请标明一个人需要几份。`);
        }
        if (
            dataLines.filter(line => line.includes('份数')).length > 0 && 
                (
                    dataLines.filter(line => line.includes('总量')).length == 0 ||
                    dataLines.filter(line => line.includes('每次制作前需要确定计划做几份。一份正好够')).length == 0
                )
            ) {
            errors.push(`文件 ${filePath} 不符合仓库的规范！它使用份数作为基础，这种情况下一般是一次制作，制作多份的情况。请标明：总量 并写明 '每次制作前需要确定计划做几份。一份正好够 几 个人食用。'。`);
        }
        if (dataLines.filter(line => line.includes('min')).length > 0) {
            errors.push(`文件 ${filePath} 不符合仓库的规范！min 这个词汇有多重含义。建议改成中文"分钟"。`);
        }
        if (dataLines.filter(line => line.includes('左右')).length > 0) {
            errors.push(`文件 ${filePath} 不符合仓库的规范！左右 不是一个能够明确定量的标准! 如果是在描述一个模糊物体的特征，请使用 '大约'。例如：鸡（大约1kg）`);
        }
        if (dataLines.filter(line => line.includes('少许')).length > 0) {
            errors.push(`文件 ${filePath} 不符合仓库的规范！少许 不是一个精准的描述！请给出克 g 或毫升 ml。`);
        }
        if (dataLines.filter(line => line.includes('你')).length + dataLines.filter(line => line.includes('我')).length > 0) {
            errors.push(`文件 ${filePath} 不符合仓库的规范！请不要出现人称代词。`);
        }
        if (titles[0].trim() != "# " + filename + "的做法") {
            errors.push(`文件 ${filePath} 不符合仓库的规范！它的大标题应该是: ${"# " + filename + "的做法"}! 而它现在是 ${titles[0].trim()}!`);
            continue;
        }

        // 检查烹饪难度
        const mainTitleIndex = dataLines.indexOf(titles[0].trim());
        const firstSecondTitleIndex = dataLines.indexOf(secondTitles[0].trim());
        
        if (mainTitleIndex >= 0 && firstSecondTitleIndex >= 0) {
            // 检查大标题和第一个二级标题之间是否有预估烹饪难度
            let hasDifficulty = false;
            const difficultyPattern = /^预估烹饪难度：★{1,5}$/;
            
            for (let i = mainTitleIndex + 1; i < firstSecondTitleIndex; i++) {
                if (difficultyPattern.test(dataLines[i])) {
                    hasDifficulty = true;
                    // 检查星星数量是否在1-5之间
                    const starCount = (dataLines[i].match(/★/g) || []).length;
                    if (starCount < 1 || starCount > 5) {
                        errors.push(`文件 ${filePath} 不符合仓库的规范！烹饪难度的星星数量必须在1-5颗之间！`);
                    }
                    break;
                }
            }
            
            if (!hasDifficulty) {
                errors.push(`文件 ${filePath} 不符合仓库的规范！在大标题和第一个二级标题之间必须包含"预估烹饪难度：★★"格式的难度评级，星星数量必须在1-5颗之间！`);
            }
        }
        
                
        if (secondTitles.length != 4) {
            errors.push(`文件 ${filePath} 不符合仓库的规范！它并不是四个标题的格式。请从示例菜模板中创建菜谱！请不要破坏模板的格式！`);
            continue;
        }
        if (secondTitles[0].trim() != "## 必备原料和工具") {
            errors.push(`文件 ${filePath} 不符合仓库的规范！第一个标题不是 必备原料和工具!`);
        }
        if (secondTitles[1].trim() != "## 计算") {
            errors.push(`文件 ${filePath} 不符合仓库的规范！第二个标题不是 计算!`);
        }
        if (secondTitles[2].trim() != "## 操作") {
            errors.push(`文件 ${filePath} 不符合仓库的规范！第三个标题不是 操作`);
        }
        if (secondTitles[3].trim() != "## 附加内容") {
            errors.push(`文件 ${filePath} 不符合仓库的规范！第四个标题不是 附加内容`);
        }

        var mustHave = '如果您遵循本指南的制作流程而发现有问题或可以改进的流程，请提出 Issue 或 Pull request 。';
        var mustHaveIndex = dataLines.indexOf(mustHave);
        if (mustHaveIndex < 0) {
            errors.push(`文件 ${filePath} 不符合仓库的规范！ 它没有包含必需的附加内容！，需要在最后一行添加模板中的【如果您遵循本指南的制作流程而发现有……】`);
        }
    }
    
    if (errors.length > 0) {
        for (var error of errors) {
            console.error(error + "\n");
        }

        var message = `Found ${errors.length} errors! Please fix!`;
        throw new Error(message);
    }
}

main();