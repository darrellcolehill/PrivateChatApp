var express = require('express');
var router = express.Router();

//var path = require('path');
//var app = require('../app');
var bcrypt = require('bcryptjs'); //NOTE: may delete later if I decide to use another method of encryption 
require('dotenv').config();
var db = require('../db').db;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Private Chat App', error: 'none'});
});


// TODO: find out if I need to make this funciton async
router.post('/', function(req, res, next){	//original non sync header
  
  var body = req.body;
  var username = body.username;
  var email = body.email;
  var password = body.password;
  var dob = body.dob;

  console.log(username + " " + email + " " + password + " " + dob); //DELETE AFTER TESTING

	//block of code that makes sure that the user has entered a valid password
	var valid = false;
	if(password.length >= 8) //checks for valid length
	{
		
		if(password.toUpperCase() != password && password.toLowerCase() != password) //varifies that the user has at least one lower case character and one upper case character
		{
			if(password.includes("1") || password.includes("2") || password.includes("3") || password.includes("4") || password.includes("5") || password.includes("6") || password.includes("7") || password.includes("8") || password.includes("9"))
				valid = true;
		}
		
	}

	//block of code that makes sure that the user has entered a valid email. 
	if(email.includes("@") && email.includes(".") && email.charAt(0) != "@" && email.charAt(0) != "." && email.charAt(email.length - 1) != "@" && email.charAt(email.length - 1) != ".")
	{
		valid = true;
	}

	console.log("password validation = ", valid); //TODO: DELETE AFTER TESTING

	if(valid == false)
	{
		res.render('signup', { title: 'Private Chat App', error: 'Invalid password or email.' }); //TODO: insert error message here indicating to the user that the password is invalid
		return;
	}

	//Block of code that hashes the password (with salt) and stores it in the data
		var salt = bcrypt.genSaltSync(10);
		var hashedPassword = bcrypt.hashSync(password, salt);

		console.log("hash" + hashedPassword);
		console.log("salt " + salt);

	var values = [ //NOTE: may need to delete this if I do not use it
	  [username, hashedPassword, email, dob],
	];

	//checks to see if the user has already been inserted to the database, if not, then it inserts the new user to the databse, else, it prompts the user saying "users already exist"
	db.query("SELECT COUNT(*) AS cnt FROM users WHERE username = ? " , username , function(err , data){
	   if(err){
	       console.log(err);
	   }   
	   else{
	       if(data[0].cnt > 0){  
	             // Already exist 
	             console.log("User already exist"); //DELETE AFTER TESTING
				 
	             res.render('signup', { title: 'Private Chat App', error: 'Username already exist' });//TODO: add link to login
				 return;
	             
	       }else{
	           db.query("INSERT INTO users (username, password, email, dob) VALUES ?" ,[values] , function(err , insert){
	               if(err){
	                   // return error
	                   console.log("error while user entered into database"); //delete after testing
					   res.render('signup', { title: 'Private Chat App', error: 'Error inesrting data' }); //TODO: notify the user that there was an error here
					   return;
	               }else{
	                   // return success , user will insert 
	                   console.log("User entered into databse");
	                   res.redirect('login'); //redirects the user to the login page so they can get their cookie to mark locations
					   return;
					}
	           })                  
	       }
	   }
	})

})

module.exports = router;