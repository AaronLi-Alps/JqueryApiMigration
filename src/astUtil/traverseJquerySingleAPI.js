/*
 * @Author: Ning Li 471099989@qq.com
 * @Date: 2023-02-05 16:48:47
 * @LastEditors: Ning Li 471099989@qq.com
 * @LastEditTime: 2024-03-13 15:37:34
 * @FilePath: /JqueryAPIMigration/src/astUtil/traverseJquerySingleAPI.js
 * @Description: Jquery 单个API替换插件模版
 */
const fs = require('fs');
//js转AST代码
const parser = require('@babel/parser');
//遍历ASR节点
const traverse = require('@babel/traverse').default;
//用来判断节点类型产生新的节点
const t = require('@babel/types');
const { deprecate } = require('util');
//用来把AST转换成js代码
const generator = require('@babel/generator').default;
const jscode = fs.readFileSync("src/astUtil/halfvizDemo.js", {
    encoding: "utf-8"
});
let names1 = "bind";
let names2 = "on";
let ee = null;
let rr = null;
let tt = null;
const deceli = {
    CallExpression(path) {
        console.log(path.node.callee.type);
        if (path.node.callee.type == "Identifier") {
            console.log(path.node.callee.name);
            if (path.node.callee.name == names1 | path.node.callee.name == names2) {
                console.log(path.node.callee.name);
                path.node.callee.name = "sxplain"; // 替换的名称
            }
        }
    }
};


const visitor = {
    // FunctionExpression(path) {
    //     console.log('--------',ii);
    //     const node = path.node;
    //     console.log(node);
    //     ii++;
    //     if (path.node.body.body.length != 0) {
    //         console.log(path.node.body.body[0].type,path.node.body.body[0].declarations)
    //         if (path.node.body.body[0].type == "ExpressionStatement" || path.node.body.body[0].type == "FunctionDeclaration") {
    //             console.log('找到大类');
    //             // console.log(path.node.body.body[0].declarations[0].init.object.name);
    //             console.log(path.node.body.body[0]);
    //             // my set
    //             if(path.node.type === 'Identifier' && path.node.name === 'bind'){
    //                 node.name = 'on';
    //               }
    //             // if (path.node.body.body[0].declarations[0].init.object.name == "bVnHz") {
    //             //     names1 = path.node.body.body[0].declarations[0].id.name;
    //             //     names2 = path.node.body.body[0].declarations[2].id.name;
    //             //     console.log(path.node.body.body[0].declarations[0].id.name);
    //             //     console.log(path.node.body.body[0].declarations[2].id.name);
    //             //     path.traverse(deceli, names1, names2);
    //             //     ee = path.node.body.body[0];
    //             //     rr = path.node.body.body[1];
    //             //     tt = path.node.body.body[2];
    //             //     console.log(ee);
    //             //     path.traverse(deceli1, ee, rr, tt);
    //             // }
    //         }
    //     }
    // },
    // 只会遍历 type 属性
    //     enter(node) {
    //     console.log("enter -> node.type", node.type)
    //     if(node.type === 'Identifier' ){
    //         console.log(node);
    //         console.log(node.name);
    //         return;
    //         if(node.name === 'bind'){
    //             console.log('修改节点');
    //             console.log(node.name);
    //             node.name = 'on';
    //         }

    //     }
    //   },
    Identifier(path,state){
        console.log("into Identifier");
        if(path.node.name === 'bind'){
            // 判断该bind是否为Jquery的$调用
            if(path.inList){
                // 有同级节点
                let prevNode = path.getPrevSibling();
                if(prevNode.container.object.callee === '$'){
                    console.log(path.key,path,path.inList);
                    console.log('已找到废弃函数：', 'bind');
                    path.node.name = 'on';
                }
            }else{
                // 无同级节点
                let prevNode = path.getPrevSibling();
                if(prevNode.container.object.callee && prevNode.container.object.callee.name === '$'){
                    console.log(path.key,path,path.inList);
                    console.log('已找到废弃函数：', 'bind');
                    path.node.name = 'on';
                    // 返回调用的路径最近函数的信息（名称）
                    let parentFunc = path.getFunctionParent();
                    getPrimaryMethodInfo(parentFunc);
                }
            }           
            

        }
        // if(path.parentPath && path.listKey === 'arguments'){
        //     console.log("增加参数");
        //     path.container.push(t.numericLiteral(222));
        //     return;
        // }
        // // 获取当前 函数的 父级。查找最接近的父函数或程序：
        // const parentFunc = path.getFunctionParent();
        // console.log(parentFunc);
        // if(parentFunc){
        //     // 当前父节点 是 square函数 并且当前的节点的listKey 是params（此处是为了排除square的函数命名节点）
        //     // 在重命名后再执行
        //     const newName = "newNameByBabelLN";
        //     if(
        //         parentFunc.type === "FunctionDeclaration" &&
        //         parentFunc.node.id.name === newName &&
        //         path.listKey === "params"
        //     ){
        //         console.log("新增函数参数left");
        //         path.container.push(t.identifier("left"));

        //     }
        //     // 当前父节点 是 square函数 并且当前的节点的key是id （此处为了确认square的函数命名特点）
        //     // 然后对此函数进行重命名 从 square改为newName
        //     if(
        //         parentFunc.node.id.name === "square" &&
        //         path.key === "id"
        //     ){
        //         console.log("对square 函数进行重命名：", newName);
        //         path.node.name = newName;
        //     }
        // }
    },
    // ExpressionStatement(path, opts) {
    //     let node  = path.node;
    //     if (node) {
    //         console.log(node.type);
    //         // console.log(node.context);
    //         console.log(path);
    //         // traverse(path, visitorSub);
    //     }

    // }

}
function getPrimaryMethodInfo(parentFunc){
    // console.log(parentFunc.node.id.name);
    console.log(parentFunc.node.id);
    console.log(parentFunc.container[0]);
}
const visitorSub = {
    enter(path) {
        let node = path.node;
        console.log("enterSub -> node.type", node.type)
        if (node.type === 'Identifier') {
            console.log(node);
            console.log(node.name);
            return;
            if (node.name === 'bind') {
                console.log('修改节点');
                console.log(node.name);
                node.name = 'on';
            }

        }
    }

}



// 遍历所有项目中的文件

let ast = parser.parse(jscode);
// console.log(ast);
traverse(ast, visitor);

let code = generator(ast).code;
console.log("写入文件");
fs.writeFile('./testfter.js', code, (err) => { });
