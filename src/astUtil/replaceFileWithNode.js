/*
 * @Author: Ning Li 471099989@qq.com
 * @Date: 2022-11-05 15:01:02
 * @LastEditors: Ning Li 471099989@qq.com
 * @LastEditTime: 2024-03-13 15:48:34
 * @FilePath: /JqueryAPIMigration/src/astUtil/replaceFileWithNode.js
 * @Description: 基于Node API的文件内容替换
 */
var fs = require('fs');
var path = require('path');
var filePath = path.resolve(__dirname + '/demoZtree');
// readdir方法读取文件名
// readFile方法读取文件内容
// writeFile方法改写文件内容
console.log('-------------');
console.log(filePath);
function run(filePath) {

	fs.readdir(filePath, 'utf8', function (err, data) {

		data.forEach(function (item, index) {
			console.log('item is', item)

			// if (fs.statSync(filePath + '/' + item).isFile()) {
			//         		replaceApi(path, file);
			//     		} else {
			//         		run(path + '/' + file);            
			//    			 }
			if (item === 'fuzzysearch.js') {
				fs.readFile(__dirname + '/js/' + item, 'utf8', function (err, files) {
					console.log('files is ', files)
					var result = files.replace(/zTreeId/g, '替换后的内容');
					console.log('-------------result-------------')
					console.log(result);
					console.log('have replace err is ---', err)
					fs.writeFile(__dirname + '/js/' + item, result, 'utf8', function (err) {
						if (err) return console.log('have save err is ---', err);
					})
				})

			}
			return
			fs.readFile('./js/' + item, 'utf8', function (err, files) {
				console.log('files is ', files)
				var result = files.replace(/zTreeId/g, '替换后的内容');
				console.log(err)
				fs.writeFile('/js/' + item, result, 'utf8', function (err) {
					if (err) return console.log(err);
				})
			})
		})
	})
}
//遍历目录找到所有文件
function findPath(filePath) {
	var path = filePath
	const files = fs.readdirSync(path);
	files.forEach(file => {
	  const newPath = path + '/' + file;
	  if (fs.statSync(newPath).isFile()) {
		// 找到了文件，则进行处理
		// 只对html类型和js类型文件进行处理
		if(newPath.indexOf('.html') !== -1 || newPath.indexOf('.js') !== -1){
			console.log(newPath.indexOf('.html'))
			console.log('file is ',newPath);
			replaceApi(newPath);
		}
		
	  } else {
		findPath(newPath);
	  }
	})
  }
function replaceApi(newPath) {
	console.log('开始查找文件：', newPath);
	fs.readFile(newPath, 'utf8', function (err, files) {
		console.log('files is ', files)
		var result = files.replace(/zTreeId/g, '替换后的内容');
		console.log('-------------result-------------')
		console.log(result);
		if(err){
			console.log('have replace err is ---', err)
		}
		fs.writeFile(__dirname + '/js/' + item, result, 'utf8', function (err) {
			if (err) return console.log('have save err is ---', err);
		})
	})
}
// run(filePath)
findPath(filePath)
