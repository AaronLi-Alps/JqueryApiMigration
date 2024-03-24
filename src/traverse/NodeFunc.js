/*
 * @Author: Ning Li 471099989@qq.com
 * @Date: 2024-03-13 15:51:13
 * @LastEditors: Ning Li 471099989@qq.com
 * @LastEditTime: 2024-03-14 10:05:03
 * @FilePath: /JqueryAPIMigration/src/traverse/NodeFunc.js
 * @Description: 获取路径
 * 
 * Copyright (c) 2024 by AlpsDuDuDu, All Rights Reserved. 
 */
var path = require('path');
const projectRootPath = path.join(__dirname,'../../');
console.log(projectRootPath);

exports.projectRootPath = projectRootPath;
exports.localPath = path;