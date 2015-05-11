 /**
 * @authors : hoozi
 * @webSite : https://github.com/hoozi
 * @email   : 287036406@qq.com
 * @date    : 2015-05-11 19:56:17
 * @version : 0.0.1
 */
var simply = require("./simply"),
	app = new simply.App(),
	statics = simply.statics,
	query = simply.query,
	post = simply.post,
	session = simply.session,
	view = simply.view,
	redirect = simply.redirect,
	download = simply.download,
	types = require("./libs/types.js"),
	articles = require("./libs/articles.js")
	login = {user_name:"admin",password:"admin"};

app.use(statics(__dirname+"/public"));
app.use(query);
app.use(post);
app.use(session);
app.use(view(__dirname+"/views"));
app.use(redirect);
app.use(download);
function getLoginStatus(req) {
	return req.session.loginStatus;
}
	
app.get("/", function(req, res){
	res.view("index.html",{
		logined:getLoginStatus(req),
		articles:articles,
		types:types
	})
})

app.get("/login", function(req, res){
	res.view("login.html",{logined:getLoginStatus(req),user_name:"admin"})
})

app.get("/type_manage", function(req, res){
	if(getLoginStatus(req)) {
		res.view("type_manage.html",{types:types})
	} else {
		res.redirect("/");
	}
});
app.get("/create", function(req, res){
	res.view("create.html",{types:types})
})
app.get("/article/:id", function(req, res){
	var id = req.params.id;
	var art = articles.get(id);

	res.view("view.html",{article:art})
})
app.get("/img/:id", function(req, res){
	var id = req.params.id;
	var art = articles.get(id);
	res.download("img",new Buffer(art.img, "base64"))
})
app.post("/create", function(req, res){
	req.body.img = req.files.img;
	articles.create(req.body);
	res.redirect("/")
})
app.get("/del/:id", function(req, res){
	var id = req.params.id;
	if(id) {
		articles.del(id);
		res.redirect("/")
	}
})
app.get("/edit/:id", function(req, res){
	var id = req.params.id;
	var art = articles.get(id);
	if(art) {
		res.view("edit.html",{article:art,types:types})
	} else {
		res.redirect("/")
	}
})
app.post("/update/:id", function(req, res) {
	var id = req.params.id;
	req.body.img = req.files.file
	articles.update(req.body,id);
	res.redirect("/");
})
app.post("/login", function(req, res){
	var user_name = req.body.user_name;
	var password = req.body.password;
	if(user_name===login.user_name&&password===login.password) {
		req.session.loginStatus=true;
		res.redirect("/")
	} else {
		res.view("login.html",{msg:"用户名或密码不正确"});
	}
})
app.post("/type/create", function(req, res) {
	var title = req.body.title;
	if(title) {
		types.create(title);
		res.redirect("/type_manage");
	}
})
app.post("/type/del/:id", function(req, res) {
	var id = req.params.id;
	if(id) {
		types.del(id);
		res.redirect("/type_manage");
	}
	
})
app.post("/type/update/:id", function(req, res) {
	var title = req.body.title;
	var id = req.params.id;
	if(id&&title) {
		types.update(title,id);
		res.redirect("/type_manage");
	}
})
app.listen(3000)