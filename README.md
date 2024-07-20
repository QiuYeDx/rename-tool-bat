# Rename Files by Modification Time Script

## 概述

此脚本会遍历 `./src/` 目录下的每个文件夹，并将每个文件夹下的所有文件按照修改时间从早到晚的顺序依次排序并重命名为 `文件夹名称-序号` 的形式。

## 功能

- 自动遍历 `./src/` 目录下的所有文件夹。
- 按照文件的修改时间对每个文件夹中的文件进行排序。
- 依次将文件重命名为 `文件夹名称-序号.扩展名` 的形式。

## 使用方法

1. 确保您的项目目录结构如下：

    ```md
    your-project/
    ├── renameFolders.js
    └── src/
        ├── folder1/
        │   ├── file1.txt
        │   └── file2.txt
        └── folder2/
            ├── file3.txt
            └── file4.txt
    ```

2. 将以下代码保存为 `renameFolders.js` 文件：

    ```javascript
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
    ```

3. 在终端中运行以下命令以执行脚本：

    ```bash
    node renameFolders.js
    ```

4. 脚本会自动遍历 `./src/` 目录下的每个文件夹，并将文件夹中的文件按照修改时间排序并重命名为 `文件夹名称-序号.扩展名` 的形式。

## 注意事项

- 确保 `./src/` 目录下只有文件夹。脚本会遍历所有子目录并重命名其中的文件。
- 重命名后的文件不可逆，请确保您有备份或在测试环境中运行脚本。

## 示例

假设您的 `./src/` 目录结构如下：

```md
src/
├── folder1/
│   ├── file1.txt
│   └── file2.txt
└── folder2/
    ├── file3.txt
    └── file4.txt
```

运行脚本后，文件夹中的文件将被重命名为：

```md
src/
├── folder1/
│   ├── folder1-0.txt
│   └── folder1-1.txt
└── folder2/
    ├── folder2-0.txt
    └── folder2-1.txt
```

## 许可证

此项目使用 MIT 许可证。有关更多信息，请参阅 LICENSE 文件。
