
var mysql = require('mysql');
var config = require('./config.js');
var express = require('express');
// создаем приложение
var app = express();
// подключаем поддержку шаблонизаторов
var templating = require('consolidate').handlebars;
var bodyParser = require('body-parser');
var request = require('request');

var http    = require("http");
var Cookies = require('cookies');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');





app.use(cookieParser());
app.use(cookieSession({
	keys: ['i'],

}));



app.engine('hbs', templating);
// по умолчанию используем .hbs шаблоны%
app.set('view engine', 'hbs');
// указываем директорию для загрузки шаблонов
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded());



var connection = mysql.createPool(config);


connection.getConnection(function (err) {
  if (err)
    throw err;
  console.log('Port: '+config['port']);
});

app.get('/',function(req, res){
	if(req.session.remember)
	{
// выводим данные на основе шаблона
	todoList.list(function (err, tasks) {
				
				if (err)
	    			throw err;
			 	res.render('hello', {
					tasks: tasks
			 	});
			});
	}else{res.redirect('/login');}
});

app.post('/add', function(req, res){
// выводим данные на основе шаблона
// console.log('add');
		todoList.add(req.body.text, function (err) {
			// console.log('todo');
			if (err)
    			throw err;
    		// console.log('not error');
		 	res.redirect('/');
		});
});


app.get('/delete/:id', function(req, res){
// выводим данные на основе шаблона
// console.log('add');
		todoList.delete(req.params.id, function (err) {
			// console.log('todo');
			if (err)
    			throw err;
    		// console.log('not error');
		 	res.redirect('/');
		});
});


//Закоментировать
app.get('/login', function(req, res){
if(!req.session.remember)
	{
			 var cookies = new Cookies( req, res );
			 cookies.set( "unsigned", "foo");
			unsigned = cookies.get( "unsigned" );
			// var asd = req.session.views || 0;
			// req.session.views = ++asd;
			// console.log(asd);
			//console.log(unsigned);
		 	res.render('login');
	}
	else{res.redirect('/');}
	
	
});

app.post('/login', function(req, res){
	console.log(req.body.remember);
			if(req.body.login == 'login')
				if(req.body.password == 'login')
					if(req.body.remember)
			 			{
			 				req.session.remember = true;
			 				res.redirect('/');
			 			}

			
		 	res.redirect('/login');
	
	
});

//Редактирование задачи
app.get('/edit/:id', function(req, res){
// выводим данные на основе шаблона
// console.log('add');
		 todoList.findTask(req.params.id, function (err, task) {
		// 	// console.log('todo');
		 	if (err)
     			throw err;
    		// console.log('not error');
		 	res.render('edit', {
		 		task: task

		 	});
		// });
	});
});
//Обновление задачи
app.post('/edit/:id', function(req, res){
// выводим данные на основе шаблона
// console.log('add');
		 todoList.change(req.params.id,  req.body, function (err, task, callback) {
		// 	console.log('todo');
		 	if (err)
     			throw err;
    		//console.log(task);
		 	res.redirect('/');
		// });
	});
});

//Отметка о выполненой задачи
app.get('/completed/:id', function(req, res){
// выводим данные на основе шаблона
// console.log('add');
		 todoList.complete(req.params.id, function (err, callback) {
	
		 	if (err)
     			throw err;
		 	res.redirect('/');
	
	});
});




function mustBeAuthentificated (req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/login'); // переход на страницу логина
}


var todoList = {
  // Получение всех задач
  list: function (callback) {
     // console.log('todo add');
    connection.getConnection(function (err, connection) {
	  if (err)
	    throw err;
		  connection.query('SELECT * FROM todos;', callback);
      connection.release();
	});
	
  },

  findTask: function function_name(id, callback) {
  	connection.getConnection(function (err, connection) {
	  if (err)
	    throw err;
		  connection.query('SELECT * FROM todos WHERE id="'+id+'";', callback);
      connection.release();
	});
  },

  // Добавить задачу
  add: function (text, callback) {
    // console.log('todo add');
    connection.getConnection(function (err, connection) {
	  if (err)
	    throw err;
		  connection.query('INSERT INTO todos (text) VALUES ("'+text+'")', callback);
      connection.release();
	});
	
  },

  // Изменить описание задачи
  change: function (id, newData, callback) {
       connection.getConnection(function (err, connection) {
		if (err)
		  throw err;
	 	connection.query('UPDATE todos SET text=("'+newData.text+'"), completed=("'+newData.completed+'") WHERE id="'+id+'"', callback);
      	connection.release();
  	});
  },

  // Отметить задачу как сделанную
  complete: function (id, callback) {
    connection.getConnection(function (err, connection) {
		if (err)
		  throw err;
	 	connection.query('UPDATE todos SET completed="true" WHERE id="'+id+'"', callback);
      	connection.release();
  	});
  },

  // Удаление задачи
  delete: function (id, callback) {
    connection.getConnection(function (err, connection) {
	  if (err)
	    throw err
		  connection.query('DELETE FROM todos WHERE id="'+id+'"', callback);
		  //console.log('delete');
      connection.release();
  	});
  },
}

todoList.list();
app.listen(8080, function(){
	console.log("Server start 8080");

});
