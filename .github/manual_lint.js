// fetch all .md files.
// Check it's content.
// Console.LogError for errors.


const glob = require("glob");
const fs = require("fs");
var path = require('path');


var getDirectories = function (src, callback) {
    glob(src + '../../dishes/**/*.md', callback);
  };

getDirectories(__dirname, function (err, res) {
    res.forEach(filePath => {
        // console.log("Linting file: " + filePath + " ...");

        fs.readFile(filePath, 'utf8' , (err, data) => {
            data = data.replace('\r\n', '\n');
            data = data.replace('\r', '\n');

            dataLines = data.split('\n');
            var filename = path.parse(filePath).base.replace(".md","");

            titles = dataLines.filter(t => t.startsWith('#'));
            secondTitles = titles
                .filter(t => t.startsWith('## '));

            if (titles[0].trim() != "# " + filename + "的做法") {
                console.error(`File ${filePath} is invalid! It's title should be: ${"# " + filename + "的做法"}! It was ${titles[0].trim()}!`);
                return;
            }
            if (secondTitles.length != 4) {
                console.error(`File ${filePath} is invalid! It doesn't has 4 second titles!`);
                return;
            }
            if (secondTitles[0].trim() != "## 必备原料和工具") {
                console.error(`File ${filePath} is invalid! The first title is NOT 必备原料和工具! It was ${secondTitles[0]}!`);
                return;
            }
            if (secondTitles[1].trim() != "## 计算") {
                console.error(`File ${filePath} is invalid! The second title is NOT 计算!`);
                return;
            }
            if (secondTitles[2].trim() != "## 操作") {
                console.error(`File ${filePath} is invalid! The thrid title is NOT 操作!`);
                return;
            }
            if (secondTitles[3].trim() != "## 附加内容") {
                console.error(`File ${filePath} is invalid! The fourth title is NOT 附加内容!`);
                return;
            }
        });
    });
});