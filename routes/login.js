var express = require('express');
var router = express.Router();


//var app = require('../app');
var bcrypt = require('bcryptjs'); //NOTE: may delete later if I decide to use another method of encryption 
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
require('dotenv').config();
var db = require('../db').db;


/* GET home page. */
router.get('/', function(req, res, next) {
	//res.redirect("/signup");
  res.render('login', { title: 'Private Chat App', error: 'none' });
});



// TODO: find out if I need to make these funciton async
router.post('/', function(req, res, next){
  	console.log("user attempting to login");
	

	//NOTE: check to see if a user cookie was already creates (and had not expired), if a cookie already exist, then delete that cookie
	var body = req.body;
	var username = body.username;
	var password = body.password;
	var sql; //NOTE: may delete this variable if I do not use it in the future

	console.log(username + " " + password); //DELETE AFTER TESTING

	var values = [ //NOTE: may delete this if I do not use it in this function
	  [password, username],
	];

	// Values that will be stored in cookie for further request
	var user = {username: username};


	//queries the database and checks if there is a user in the users table that has the same email and password. If not, then it redirects the user to the login page
	db.query("SELECT COUNT(*) AS cnt FROM users WHERE username = ?" , [username], function(err, data)	{ 
		if(err)
		{
			console.log(err);
      		// TODO: add redirect to login with error message
		}
		else
		{
			if(data[0].cnt == 1)
			{
				//NOTE: add code that actually logs in the user
				db.query("SELECT password FROM users WHERE username = ?", [username], function(err, data){
					
					if(bcrypt.compareSync(password, data[0].password) === true)
					{
						// ======================JWT LOGIC======================
						
						//const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

						// Set cookie expiration date
					    let options = {
					        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
					        httpOnly: true, // The cookie only accessible by the web server
					    }

						//sends the token to the user's brower
					    res.cookie('moosenger', username, options) // NOTE: options is optional
						
						console.log(req.cookies);
						// ========================================================================

              			console.log("User logged in");
						res.redirect("/");
						
					}
					else
					{
						console.log("incorrect password");
						res.render('login', { title: 'Private Chat App', error: 'Incorrect password'});
					}
				})
			}
			else 
			{
				// User not found, send back to login page
				console.log("user does not exist...");
				res.render('login', { title: 'Private Chat App', error: 'Could not find user' });
			}
		}
	});

});

module.exports = router;