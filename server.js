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
const baseURL = "http://206.189.64.55:80/";

app.get('/', function (req, res) {
  con.query("SELECT * FROM tracking ORDER BY id DESC", function (err, result) {
	console.log(result);
	res.render('pages/index',{
		siteTitle: siteTitle,
		pageTitle: "Event List",
		items : result
		});
	});

});

app.get('/event/add', function (req, res) {
  con.query("SELECT * FROM tracking ORDER BY id DESC", function (err, result) {
        console.log(result);
        res.render('pages/add-event.ejs',{
                siteTitle: siteTitle,
                pageTitle: "Add new event",
                items : ''
                });
        });

});

app.post('/event/add', function(req,res){
	var query = "INSERT INTO `tracking` (starttime, comments, rating) VALUES (";
	    query +=  " NOW(),";
//          query +=  " '"+dateFormat(req.body.starttime,"yyyy-mm-dd'T'HH:MM:ss")+"',";
	    query +=  " '"+req.body.comments+"',";
	    query +=  " '"+req.body.rating+"') ";

	con.query(query, function (err, result) {
	     res.redirect(baseURL);
	});
});


/* Routing for Edit. This is a GET method to data and prepopulate form*/
app.get('/event/edit/:id', function(req,res){
	con.query("SELECT * FROM tracking WHERE id= '"+ req.params.id + "'",
	function (err,result) {
		res.render('pages/edit-event',{
		siteTitle : siteTitle,
		pageTitle : "Edit event : " + result[0].comments,
		item: result
		});
	});
});

app.post('/event/edit/:id', function(req,res){
        var query = "UPDATE `tracking` SET";
            query += " `comments` =  '"+req.body.comments+"',";
            query += " `rating` = ' "+req.body.rating+"'";
	    query += " WHERE `tracking`.`id` =  "+req.body.id+"";

        con.query(query, function (err, result) {
	  if (result.affectedRows)
	   {
             res.redirect(baseURL);
	   }
        });
});



app.get('/event/endtime/:id', function(req,res){

	var query ="UPDATE tracking SET finishtime=NOW(), duration=TIMEDIFF(finishtime,starttime) WHERE id ='"+ req.params.id + "'";

        con.query(query, function (err, result) {
          if (result.affectedRows)
           {
             res.redirect(baseURL);
           }
         });
});


app.get('/event/astarttime', function(req,res){
	var query="INSERT INTO tracking (starttime) VALUES (NOW())"; 
       con.query(query, function (err, result) {
             res.redirect(baseURL);
         });
});

app.get('/event/aendtime', function(req,res){
	var query ="UPDATE tracking SET finishtime=NOW(), duration=TIMEDIFF(finishtime,starttime) WHERE id =LAST_INSERT_ID()";
      
       con.query(query, function (err, result) {
             res.redirect(baseURL);
         });
});
app.get('/event/delete/:id', function(req,res){

	var query ="DELETE FROM tracking WHERE id ='"+ req.params.id + "'";

	con.query(query, function (err, result) {
          if (result.affectedRows)
           {
             res.redirect(baseURL);
           }
	 });
});

var server = app.listen(80, function(){
	console.log("Server started port 80");
});
