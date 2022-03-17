const util = require("util");
const glob = util.promisify(require('glob'));
const fs = require("fs").promises;
const path = require('path');


async function main() {
    var errors = [];
    var directories = await glob(__dirname + '../../dishes/**/*.md');

    for (var filePath of directories) {
        var data = await fs.readFile(filePath, 'utf8');
        var filename = path.parse(filePath).base.replace(".md","");

        dataLines = data.split('\n').map(t => t.trim());
        titles = dataLines.filter(t => t.startsWith('#'));
        secondTitles = titles.filter(t => t.startsWith('## '));

        if (dataLines.filter(line => line.includes(' 勺')).length > 0) {
            errors.push(`File ${filePath} is invalid! 勺 is not an accurate unit!`);
        }
        // if (dataLines.filter(line => line.includes('适量')).length > 0) {
        //     errors.push(`File ${filePath} is invalid! 适量 is not an accurate unit!`);
        // }
        // if (dataLines.filter(line => line.includes('左右')).length > 0) {
        //     errors.push(`File ${filePath} is invalid! 左右 is not an accurate unit!`);
        // }
        if (titles[0].trim() != "# " + filename + "的做法") {
            errors.push(`File ${filePath} is invalid! It's title should be: ${"# " + filename + "的做法"}! It was ${titles[0].trim()}!`);
            continue;
        }
        if (secondTitles.length != 4) {
            errors.push(`File ${filePath} is invalid! It doesn't has 4 second titles!`);
            continue;
        }
        if (secondTitles[0].trim() != "## 必备原料和工具") {
            errors.push(`File ${filePath} is invalid! The first title is NOT 必备原料和工具! It was ${secondTitles[0]}!`);
        }
        if (secondTitles[1].trim() != "## 计算") {
            errors.push(`File ${filePath} is invalid! The second title is NOT 计算!`);
        }
        if (secondTitles[2].trim() != "## 操作") {
            errors.push(`File ${filePath} is invalid! The thrid title is NOT 操作!`);
        }
        if (secondTitles[3].trim() != "## 附加内容") {
            errors.push(`File ${filePath} is invalid! The fourth title is NOT 附加内容!`);
        }

        var mustHave = '如果您遵循本指南的制作流程而发现有问题或可以改进的流程，请提出 Issue 或 Pull request 。';
        var mustHaveIndex = dataLines.indexOf(mustHave);
        if (mustHaveIndex < 0) {
            errors.push(`File ${filePath} is invalid! It doesn't have necessary scentence.`);
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