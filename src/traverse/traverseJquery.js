/*
 * @Author: Ning Li 471099989@qq.com
 * @Date: 2023-02-05 16:48:47
 * @LastEditors: Ning Li 471099989@qq.com
 * @LastEditTime: 2024-03-14 10:03:45
 * @FilePath: /JqueryAPIMigration/src/traverse/traverseJquery.js
 * @Description: 基于babel的利用ast语法解析的Jquery中的方法替换插件
 */
const NodeFunc = require('./NodeFunc.js');
const projectRootPath = NodeFunc.projectRootPath;
return;
const fs = require('fs');
//js转AST代码
const parser = require('@babel/parser');
//遍历AST节点
const traverse = require('@babel/traverse').default;
//用来判断节点类型产生新的节点
const t = require('@babel/types');
const { deprecate } = require('util');
//用来把AST转换成js代码
const generator = require('@babel/generator').default;

// set
let names1 = "bind";
let names2 = "on";
let ee = null;
let rr = null;
let tt = null;
const deceli1 = {
    "VariableDeclaration|ExpressionStatement"(path) {
        if (path.node == ee | path.node == rr | path.node == tt) {
            path.remove();
        };
    }
};
var ii = 1;
// 构造visitor
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
        // console.log("into Identifier");
        // 如果确认是过期API
        let DepMethodMethod = transDepMethod(path.node.name);
        // if(path.node.name === 'bind'){
        if(path.node.name === DepMethodMethod){   
            // 判断该bind是否为Jquery的$调用
            if(path.inList){
                // 有同级节点
                let prevNode = path.getPrevSibling();
                if(prevNode.container.object.callee === '$'){
                    console.log(path.key,path,path.inList);
                    console.log('---------已找到废弃函数：-------', path.node.name);
                    // 替换废弃函数
                    let newMethod = getNewMethod
                    path.node.name = '替换的函数';
                }
            }else{
                // 无同级节点
                let prevNode = path.getPrevSibling();
                if(prevNode.container.type!=='ObjectProperty' && prevNode.container.object.callee && prevNode.container.object.callee.name === '$'){
                    console.log(path.key,path,path.inList);
                    console.log('---------已找到废弃函数：-------', path.node.name);
                    // 替换废弃函数
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
//  查找Jquery对象$
const visitorJquery = {
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
/**
 * @description: 通过废弃函数名称返回从废弃信息中的替换方法名称
 * @param {*} deprecatedMethod
 * @return {*}
 */
function transDepMethod(deprecatedMethod){
    var path = deprecateJsonPath;
	const deprecateInfo = fs.readFileSync(path, {
        encoding: "utf-8"
    });
    const deprecateMethodJSON=JSON.parse(deprecateInfo);
    // console.log(deprecateMethodJSON);
    for(let i =0;i < deprecateMethodJSON.data.length;i++){
        let item = deprecateMethodJSON.data[i];
        // 截取函数名称
        let itemFunName = item.funName; // ex: ".bind()"
        if(deprecatedMethod === itemFunName){
            // 找到 返回替换函数名称
            let replaceFun = itemFunName;
            console.log('匹配到废弃函数'+ itemFunName);
            return replaceFun;
        }
    }
    // console.log('未匹配到废弃函数');
    return '-1';

}
/**
 * @description: 打印节点的函数名称
 * @param {*} parentFunc
 * @return {*}
 */
function getPrimaryMethodInfo(parentFunc){
    console.log(parentFunc.node.id.name);
    console.log(parentFunc.container[0]); 
}
/**
 * @description: 🌟遍历项目中所有的js文件，读取其内容🌟
 * @param {*} filePath
 * @return {*}
 */
function findPath(filePath) {
    //deal is a Path or file
    if(filePath.indexOf('.js')){
        readFile(filePath);
        return;
    }
	var path = filePath;
	const files = fs.readdirSync(path);
	files.forEach(file => {
	  const newPath = path + '/' + file;
	  if (fs.statSync(newPath).isFile()) {
		// 找到了文件，则进行处理
		// 只对js类型文件进行处理
        // todo:对于html类型，进行普遍性处理
		if((newPath.indexOf('.js') !== -1 && newPath.indexOf('.json') == -1 ) || newPath.indexOf('.html') !== -1){
			console.log(newPath.indexOf('.html'))
			console.log('file is ',newPath);
			// read file           
            let jscode = fs.readFileSync(newPath, {
                encoding: "utf-8"
            });
            // do ast
            let ast = parser.parse(jscode);
            // ---------按visitor进行转换------------
            // -------------✨✨✨-------------
            traverse(ast, visitor);
            let code = generator(ast).code;
            console.log("写入文件",file);
            fs.writeFile(newPath, code, (err) => { });
		}
		
	  } else {
		findPath(newPath);
	  }
	})
  }
/**
 * @description: 🌟返回项目中的所有使用的JQuery废弃函数🌟
 * @param {*} filePath
 * @return {*}
 */
function getAllDepMethod(filePath) {
    //deal is a Path or file
    if(filePath.indexOf('.js') !== -1){
        readFile(filePath);
        return;
    }
	var path = filePath;
	const files = fs.readdirSync(path);
	files.forEach(file => {
	  const newPath = path + '/' + file;
	  if (fs.statSync(newPath).isFile()) {
		// 找到了文件，则进行处理
		// 只对js类型文件进行处理
        // todo:对于html类型，进行普遍性处理
		if((newPath.indexOf('.js') !== -1 && newPath.indexOf('.json') == -1 ) || newPath.indexOf('.html') !== -1){
			console.log(newPath.indexOf('.html'))
			console.log('file is ',newPath);
			// read file           
            let jscode = fs.readFileSync(newPath, {
                encoding: "utf-8"
            });
            // do ast
            let ast = parser.parse(jscode);
            // ---------按visitor进行转换------------
            // -------------✨✨✨-------------
            traverse(ast, visitor);
          
		}
		
	  } else {
		findPath(newPath);
	  }
	})
  }
/**
 * @description: 对单个文件的ast处理
 * @param {*} filePath
 * @return {*}
 */
function readFile(filePath){
    const jscode = fs.readFileSync(filePath, {
        encoding: "utf-8"
    });
    let ast = parser.parse(jscode);
    // ---------按visitor进行转换------------
    // -------------✨✨✨-------------
    traverse(ast, visitor);
    let code = generator(ast).code;
    console.log("写入文件");
    fs.writeFile('./testfter.js', code, (err) => { });
}
  


//##########----------   Main   --------------############
//##########----------          --------------############
var path = require('path');
// var filePath = path.resolve(__dirname + '/demoZtree');
// JQueryAutocompletePlugin.json jqurryUI.json
// jquery-steps.json jquery-steps  jquery-steps.json tesjquery.json datatable.json
var deprecateJsonPath = path.resolve('/Users/alps/Desktop/Study/JavaScript/ast-share/src/apidata/datatable.json');  // 废弃函数信息函数对照json路径

// /Users/alps/Desktop/PROJECT/VUE/jqueryUI/demos /Users/alps/Desktop/Study/JavaScript/JqueryProject/jQueryAutocompletePlugin/jquery.autocomplete.js
// /Users/alps/Desktop/Study/JavaScript/JqueryProject/tus-jquery-client/js/jquery.tus.js /Users/alps/Desktop/Study/JavaScript/JqueryProject/jquery-steps/src
// /Users/alps/Desktop/Study/JavaScript/JqueryProject/DataTables/media/js
var filePath = path.resolve('/Users/alps/Desktop/Study/JavaScript/JqueryProject/DataTables/media/js');  // 输入项目路径
// TEST插件测试用例：匹配废弃函数
    // transDepMethod('test');
    // return;
// findPath(filePath); // 执行遍历文件进行AST转换，并保存文件
getAllDepMethod(filePath); // 遍历项目，获取所有使用的废弃函数
return;




// TEST插件测试用例：AST代码转换
function test(){
    const jscode = fs.readFileSync("src/traverse/fuzzysearchDemo.js", {
        encoding: "utf-8"
    });
    let ast = parser.parse(jscode);
    // console.log(ast);
    traverse(ast, visitor);
    
    let code = generator(ast).code;
    console.log("写入文件");
    fs.writeFile('./testfter.js', code, (err) => { });
    
}
