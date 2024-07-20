const fs = require('fs');
const path = require('path');

// 定义目标目录
const targetDir = path.join(__dirname, './src');

// 读取目录中的所有文件夹
fs.readdir(targetDir, (err, folders) => {
  if (err) {
    return console.error('无法读取目录:', err);
  }

  folders.forEach(folder => {
    const folderPath = path.join(targetDir, folder);

    // 检查是否是文件夹
    fs.stat(folderPath, (err, stats) => {
      if (err) {
        return console.error('无法获取文件夹状态:', err);
      }

      if (stats.isDirectory()) {
        processFolder(folderPath, folder);
      }
    });
  });
});

function processFolder(folderPath, folderName) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return console.error('无法读取文件夹:', err);
    }

    const fileData = [];

    // 获取每个文件的状态信息
    files.forEach(file => {
      const filePath = path.join(folderPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          return console.error('无法获取文件状态:', err);
        }

        fileData.push({
          file,
          filePath,
          mtime: stats.mtime
        });

        // 在所有文件信息获取完毕后进行处理
        if (fileData.length === files.length) {
          renameFiles(fileData, folderPath, folderName);
        }
      });
    });
  });
}

function renameFiles(fileData, folderPath, folderName) {
  // 按修改时间排序
  fileData.sort((a, b) => a.mtime - b.mtime);

  let counter = 0;

  fileData.forEach(data => {
    // 获取文件扩展名
    const fileExt = path.extname(data.file);
    const newFileName = `${folderName}-${counter}${fileExt}`;

    const newFilePath = path.join(folderPath, newFileName);

    // 重命名文件
    fs.rename(data.filePath, newFilePath, err => {
      if (err) {
        return console.error('无法重命名文件:', err);
      }

      console.log(`文件重命名成功: ${data.file} -> ${newFileName}`);
    });

    counter++;
  });
}
