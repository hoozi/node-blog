 /**
 * @authors : hoozi
 * @webSite : https://github.com/hoozi
 * @email   : 287036406@qq.com
 * @date    : 2015-05-11 19:54:30
 * @version : 0.0.1
 */
var types = [],
	fs = require("fs"),
	articles = require("./articles.js"),
	types_db = __dirname+"/types.db";

try{
	var data = readFileSync(types_db);
	types = JSON.parse(data.toString()).types;
}catch(e){}

//新增
types.create = function(title) {
	var data = {
		id: "id_"+Date.now(),
		title: title
	}
	types.unshift(data);
}

//删除
types.del = function(id) {
	var index = this.getIndex(id);
	if(index>-1 && !articles.has(id)) {
		this.splice(index, 1);
	}
}

//得到索引值
types.getIndex = function(id) {
	var index = -1;

	this.forEach(function(type, index2) {
		if(type.id===id) {
			index = index2;
			return;
		}
	})
	return index;
}

//获得一个类别
types.get = function(id) {
	var index = this.getIndex(id);
	return index>-1?this[index]:null;
}

//修改类别
types.update = function(title, id) {
	var index = this.getIndex(id);
	(index>-1&& typeof title=="string") && (this[index].title = title)
}

setInterval(function(){
	fs.writeFileSync(types_db, JSON.stringify({types:types}))
},10*1000);

module.exports = types;