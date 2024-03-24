/*
 * @Author: Ning Li 471099989@qq.com
 * @Date: 2023-02-05 09:35:26
 * @LastEditors: Ning Li 471099989@qq.com
 * @LastEditTime: 2024-03-13 14:33:25
 * @FilePath: /ast-share/src/traverse/traverseNodeNameTest.js
 * @Description: 【test】将节点名称都换为hello
 */
const esprima = require('esprima')
const estraverse = require('estraverse')
const escodegen = require('escodegen')
// const code = `const fn = () => {}`
const code = `function getUser() {}` // 测试代码，可自行更改，或者使用fs库进行文件读取

const ast = esprima.parseScript(code)
console.log("getUser -> ast", ast)

estraverse.traverse(ast, {
  // 只会遍历 type 属性
  enter(node) {
    console.log("enter -> node.type", node.type)
    if(node.type === 'Identifier'){
      node.name = 'hello'
    }
  },
  leave(node) {
    console.log("leave -> node.type", node.type)
  }
})

const result = escodegen.generate(ast)
console.log("", result) // 输出结果
