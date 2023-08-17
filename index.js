const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});



function removeHtmlComments(path) {
    if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
        fs.readdir(path, (err, files) => {
            files.forEach(file => {
                removeHtmlComments(path + '/' + file)
            });
        });
    } else {
        fs.lstat(path, (err, stats) => {
            if (stats && stats.isFile()) {
                if (path.endsWith('.html')) {
                    const rawData = fs.readFileSync(path).toString();
                    if (rawData.includes('<!--')) {
                        var fileData = rawData.split("\n");
                        const removeComment = (chunkData, _i = 0) => {
                            for (let startIndex = _i; startIndex < chunkData.length; startIndex++) {
                                if (chunkData[startIndex].includes('<!--')) {
                                    for (let endIndex = startIndex; endIndex < chunkData.length; endIndex++) {
                                        if (chunkData[endIndex].includes('-->')) {
                                            if (startIndex !== endIndex) {
                                                chunkData.splice(startIndex, endIndex - startIndex + 1);
                                            }
                                            return removeComment(chunkData, endIndex + 1);
                                        }
                                    }
                                }
                            }
                        }
                        removeComment(fileData);
                        fs.writeFile(path, fileData.join('\n'), function (err) {
                            if (err) return console.log(err);
                        });
                    }
                }
            }
        })
    }
}
readline.question(`Enter your project path : `, folderPath => {
    console.clear();
    removeHtmlComments(folderPath);
    readline.close();
});
