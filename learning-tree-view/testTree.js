const vscode = require('vscode');

const fs = require('fs');
const path = require('path');

function extractContent(input) {
    // 使用正则表达式匹配【】中的内容和之后的内容
    const match = input.match(/(【[^】]*】)(.*)/);
    // 如果匹配成功，返回匹配的组
    if (match) {
        return [match[2].trim(), match[1].trim()]; // 使用 trim() 去除可能的前后空格
    } else {
        return null; // 如果没有匹配成功，返回 null
    }
}

function getFilesInDirectorySync(directoryPath) {
    try {
        const files = fs.readdirSync(directoryPath);
        const fileNames = files.filter(file => {
            const fullPath = path.join(directoryPath, file);
            const fileAttr = extractContent(fullPath);
            let bTodo = false;
            if (null != fileAttr) {
                bTodo = '【DONE】' != fileAttr[1];
            }
            return fs.statSync(fullPath).isFile() && bTodo;
        });
        return fileNames;
    } catch (err) {
        console.error('Unable to scan directory:', err);
        return [];
    }
}

class TestNodeTasksProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        // const root = ['hello', 'world']
        if (element) {
        }
        else
        {
            const fileNames = getFilesInDirectorySync(path.join(this.workspaceRoot, "tasks"))
            return fileNames.map(value => {
                let taskAttr = extractContent(value);
                if ('【DONE】' != taskAttr[1]){
                    return new TestData(taskAttr[0], value, taskAttr[1], vscode.TreeItemCollapsibleState.None)
                }
                else
                {
                    return null
                }
            })
        }
    }
}

class TestData extends vscode.TreeItem {
    constructor(label, fullName, state, collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.tooltip = fullName;
        this.description = state;
    }
}

module.exports = {
    TestNodeTasksProvider,
    TestData
};