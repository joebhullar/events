var express = require('express');
var http = require('http');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

var dateFormat = require('dateformat');
var now = new Date(); 

app.set('view engine', 'ejs');

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "12345Six!",
	database: "GTRACKER"
});

const siteTitle = "Simple Application";
const baseURL = "http://localhost:80/"

app.get('/', function (req, res) {
  con.query("SELECT * FROM track ORDER BY id DESC", function (err, result) {
	console.log(result);
	res.render('pages/index',{
		siteTitle: siteTitle,
		pageTitle: "Event List",
		items : result
		});
	});

});


var server = app.listen(80, function(){
	console.log("Server started port 80");
});
