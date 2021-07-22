---
title: Lerna
tag: 工具
date: 2021-01-10
categories: 
- 脚手架
---
[Lerna](https://github.com/lerna/lerna) 是一个优化基于git+npm的多package项目管理工具

优势
* 大幅度减少重复操作
* 提升操作单标椎化


## 原生脚手架的痛点
* 重复操作，多个package
  * 本地link
  * 依赖安装
  * 单元测试
  * 代码提交
  * 代码发布
* 版本一致性
  * 版本一致性
  * 发布后相互依赖版本升级

package越多，管理复杂度就越高

## Lerna的使用
```bash
npm install lerna -g
# 初始化lerna
lerna init
# 创建一个包
lerna create core
# 安装依赖
lerna add xxx
# 删除依赖
lerna clean
# 给指定package安装依赖
lerna add vue packages/core
# 重新安装依赖
lerna bootstrap
# 本地项目相互依赖
lerna link
# 执行npm script
lerna run
# 发布
lerna publish
```

## lerna源码
首先从github上下载源码 https://github.com/lerna/lerna

然后安装依赖
```bash
npm install
```
如果无法安装成功可以修改.npmrc文件，修改镜像地址为淘宝镜像  https://registry.npm.taobao.org/
```
# just in case a private registry is configured in ~/.npmrc
registry = https://registry.npm.taobao.org/
```
通过查看package.json文件可以看出入口文件为`core/lerna/cli.js`
```json
{
  ...
  "bin": {
    "lerna": "core/lerna/cli.js"
  },
  ...
}
```
在`core/lerna/cli.js`中引入了`core/lerna/cli.js`
```js
#!/usr/bin/env node

"use strict";

/* eslint-disable import/no-dynamic-require, global-require */
const importLocal = require("import-local");

if (importLocal(__filename)) {
  require("npmlog").info("cli", "using local version of lerna");
} else {
  require(".")(process.argv.slice(2));
}
```
我们可以看到很多模块导入时通过```@lerna/xxx```导入的
```js
const cli = require("@lerna/cli");
```
它导入的并不是外面npm安装的模块，我们可以查看当前目录下的package.json文件,在这里配置了模块的路径为本地路径，当模块发布时,我们也不必担心，lerna会自动处理模块的导入
```js
{
  ...
 "dependencies": {
    "@lerna/add": "file:../../commands/add",
    "@lerna/bootstrap": "file:../../commands/bootstrap",
    "@lerna/changed": "file:../../commands/changed",
    "@lerna/clean": "file:../../commands/clean",
    ...
 } 
}
```

### yargs
lerna中使用了[yargs](https://github.com/yargs/yargs)这个模块，所以首先要了解yargs如何使用

#### 实现一个yargs最简单的脚手架
``` js
#! /usr/bin/env node
const yargs = require('yargs')

// 同事还会将掺入的参数解析成对象
yargs(process.argv.slice(2)).argv
// 后者可以写成 
// yargs().parse(process.argv.slice(2))
```
然后输入
```bash
cli --help
```
就会出现
```
选项：
  --help     显示帮助信息                                                 [布尔]
  --version  显示版本号                                                   [布尔]
```

#### yargs常用的方法
对应方法的文档可以查看 https://github.com/yargs/yargs/blob/master/docs/api.md
```js
const argv = process.argv.slice(2)
const cli = yargs()
const constext = {
    cliVersion: pkg.version
}

cli.usage('cli-test [command] <options>')
    .alias('v', 'version') //别名
    .alias('h', 'help')
    // 定义用户输出的最小长度和最大长度  
    // https://github.com/yargs/yargs/blob/master/docs/api.md#demandCommand
    .demandCommand(1, 'A command is required')
    .wrap(cli.terminalWidth())
    // 控制台最后输出的内容
        .epilogue(dedent` das
      aa
    asd`)
    // 命令
    .command('init [name]', 'Do it in a project', yargs => {
        yargs
            .option('name', {
                type: 'string',
                describe: 'Name of a project'
            })

    }, argv => {
        console.log(argv)
    })
    .recommendCommands()
    .fail((err) => {
        console.log(err)
    })
    .command({
        command: 'list',
        aliases: ['ls', 'la', 'll'],
        builder: yargs => {
            console.log(yargs)
            return {}
        },
        handler: argv => {
            console.log(argv)
        }
    })
    .options({
        debug: {
            type: 'boolean',
            describe: 'Boostrap debug mode',
            alias: 'd'
        }
    })
        // 选项  如vue create a -r=https://registry.npm.taobao.org/
    .option('registry', {
        type: 'string',
        describe: 'Define global registry',
        alias: 'r'
    })
    //命令在控制台的分类
    .group(['debug'], 'Dev Options')
    .strict()
    // constext会和argv进行合并
    .parse(argv, constext)

```

#### lerna的初始化过程
lerna的入口文件`core/lerna/cli.js`
```js
#!/usr/bin/env node

"use strict";

/* eslint-disable import/no-dynamic-require, global-require */
const importLocal = require("import-local");

if (importLocal(__filename)) {
  require("npmlog").info("cli", "using local version of lerna");
} else {
  // 引入的当前目录下的index.js
  require(".")(process.argv.slice(2));
}
```
`core/lerna/index.js`，该文件中主要是注册了一些命令
```js
"use strict";

const cli = require("@lerna/cli");

const addCmd = require("@lerna/add/command");
const bootstrapCmd = require("@lerna/bootstrap/command");
const changedCmd = require("@lerna/changed/command");
const cleanCmd = require("@lerna/clean/command");
const createCmd = require("@lerna/create/command");
const diffCmd = require("@lerna/diff/command");
const execCmd = require("@lerna/exec/command");
const importCmd = require("@lerna/import/command");
const infoCmd = require("@lerna/info/command");
const initCmd = require("@lerna/init/command");
const linkCmd = require("@lerna/link/command");
const listCmd = require("@lerna/list/command");
const publishCmd = require("@lerna/publish/command");
const runCmd = require("@lerna/run/command");
const versionCmd = require("@lerna/version/command");

const pkg = require("./package.json");

module.exports = main;

function main(argv) {
  const context = {
    lernaVersion: pkg.version,
  };

  return cli()
    .command(addCmd)
    .command(bootstrapCmd)
    .command(changedCmd)
    .command(cleanCmd)
    .command(createCmd)
    .command(diffCmd)
    .command(execCmd)
    .command(importCmd)
    .command(infoCmd)
    .command(initCmd)
    .command(linkCmd)
    .command(listCmd)
    .command(publishCmd)
    .command(runCmd)
    .command(versionCmd)
    .parse(argv, context);
}
```
`core/cli/index.js`
```js
"use strict";

const dedent = require("dedent");
const log = require("npmlog");
const yargs = require("yargs/yargs");
const globalOptions = require("@lerna/global-options");

module.exports = lernaCLI;

/**
 * A factory that returns a yargs() instance configured with everything except commands.
 * Chain .parse() from this method to invoke.
 *
 * @param {Array = []} argv
 * @param {String = process.cwd()} cwd
 */
function lernaCLI(argv, cwd) {
  const cli = yargs(argv, cwd);

  return globalOptions(cli)
    .usage("Usage: $0 <command> [options]")
    .demandCommand(1, "A command is required. Pass --help to see all available commands and options.")
    .recommendCommands()
    .strict()
    .fail((msg, err) => {
      // certain yargs validations throw strings :P
      const actual = err || new Error(msg);

      // ValidationErrors are already logged, as are package errors
      if (actual.name !== "ValidationError" && !actual.pkg) {
        // the recommendCommands() message is too terse
        if (/Did you mean/.test(actual.message)) {
          log.error("lerna", `Unknown command "${cli.parsed.argv._[0]}"`);
        }

        log.error("lerna", actual.message);
      }

      // exit non-zero so the CLI can be usefully chained
      cli.exit(actual.code > 0 ? actual.code : 1, actual);
    })
    .alias("h", "help")
    .alias("v", "version")
    .wrap(cli.terminalWidth()).epilogue(dedent`
      When a command fails, all logs are written to lerna-debug.log in the current working directory.

      For more information, find our manual at https://github.com/lerna/lerna
    `);
}

```
`core/global-options/index.js`
```js
"use strict";

const os = require("os");

module.exports = globalOptions;

function globalOptions(yargs) {
  // the global options applicable to _every_ command
  const opts = {
    loglevel: {
      defaultDescription: "info",
      describe: "What level of logs to report.",
      type: "string",
    },
    concurrency: {
      defaultDescription: os.cpus().length,
      describe: "How many processes to use when lerna parallelizes tasks.",
      type: "number",
      requiresArg: true,
    },
    "reject-cycles": {
      describe: "Fail if a cycle is detected among dependencies.",
      type: "boolean",
    },
    "no-progress": {
      describe: "Disable progress bars. (Always off in CI)",
      type: "boolean",
    },
    progress: {
      // proxy for --no-progress
      hidden: true,
      type: "boolean",
    },
    "no-sort": {
      describe: "Do not sort packages topologically (dependencies before dependents).",
      type: "boolean",
    },
    sort: {
      // proxy for --no-sort
      hidden: true,
      type: "boolean",
    },
    "max-buffer": {
      describe: "Set max-buffer (in bytes) for subcommand execution",
      type: "number",
      requiresArg: true,
    },
  };

  // group options under "Global Options:" 
  // 全局options归类为  Global Options:
  const globalKeys = Object.keys(opts).concat(["help", "version"]);

  return yargs
    .options(opts)
    .group(globalKeys, "Global Options:")
    .option("ci", {
      hidden: true,
      type: "boolean",
    });
}
```
#### lerna的command
list命令

```js
"use strict";

const filterable = require("@lerna/filter-options");
const listable = require("@lerna/listable");

/**
 * @see https://github.com/yargs/yargs/blob/master/docs/advanced.md#providing-a-command-module
 */
exports.command = "list";

exports.aliases = ["ls", "la", "ll"];

exports.describe = "List local packages";

exports.builder = yargs => {
  listable.options(yargs);

  return filterable(yargs);
};

exports.handler = function handler(argv) {
  return require(".")(argv);
};

```

#### import-local
在lerna的入口文件中，导入了`import-local`模块

在lerna开始执行时会先判断本地是否安装lerna，如果已经安装了，就导入本地安装的，否则就导入全局安装的lerna文件
```js
#!/usr/bin/env node

"use strict";

/* eslint-disable import/no-dynamic-require, global-require */
const importLocal = require("import-local");

if (importLocal(__filename)) {
  require("npmlog").info("cli", "using local version of lerna");
} else {
  require(".")(process.argv.slice(2));
}
```
`import-local`中的源码
```js
'use strict';
const path = require('path');
const resolveCwd = require('resolve-cwd');
const pkgDir = require('pkg-dir');

module.exports = filename => {
	const globalDir = pkgDir.sync(path.dirname(filename));
	const relativePath = path.relative(globalDir, filename);
	const pkg = require(path.join(globalDir, 'package.json'));
	const localFile = resolveCwd.silent(path.join(pkg.name, relativePath));

	// Use `path.relative()` to detect local package installation,
	// because __filename's case is inconsistent on Windows
	// Can use `===` when targeting Node.js 8
	// See https://github.com/nodejs/node/issues/6624
	return localFile && path.relative(localFile, filename) !== '' ? require(localFile) : null;
};
```
