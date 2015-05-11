 /**
 * @authors : hoozi
 * @webSite : https://github.com/hoozi
 * @email   : 287036406@qq.com
 * @date    : 2015-05-11 19:55:19
 * @version : 0.0.1
 */

var articles = [],
	fs = require("fs"),
	articles_db = __dirname+"/articles.db";

try{
	var data = readFileSync(articles_db);
	articles = JSON.parse(data.toString()).articles;
}catch(e){}

//新增
articles.create = function(data) {
	var data = {
		createTime:Date.now(),
        updateTime:Date.now(),
        id:"id_"+Date.now(),
        typeId:data.type,
        img:data.img?data.img.toString("base64") : "",
        title:data.title,
        content:data.content
	}
	articles.unshift(data);
}

//删除
articles.del = function(id) {
	var index = this.getIndex(id);
	index>-1&&this.splice(index,1);
}

//得到索引值
articles.getIndex = function(id) {
	var index = -1;

	this.forEach(function(art, index2) {
		if(art.id===id) {
			index = index2;
			return;
		}
	})
	return index;
}

//通过type id获得文章
articles.findByType = function(type) {
	var rs = [];
	this.forEach(function(art, index) {
		if(art.typeId==type) {
			rs.push(art);
		}
	})
	return rs;
}

//判断当前type下，是否有文章
articles.has = function(type) {
	var b = false;
	this.forEach(function(art, index) {
		if(art.typeId==type) {
			b = true;
			return;
		}
	})
	return b
}

//通过id获得文章
articles.get = function(id) {
	var index = this.getIndex(id);
	return index>-1?this[index]:null;
}

//修改文章
articles.update = function(data, id) {
	var index = this.getIndex(id);
	if(index>-1) {
		var article = this[index];
		article.typeId = data.type;
		article.img = data.img?data.img.toString("base64") : "";
		article.title = data.title;
		article.content = data.content;
		article.updateTime = Date.now();
	}
}

setInterval(function(){
	fs.writeFileSync(articles_db, JSON.stringify({articles:articles}))
},10*1000);

module.exports = articles;