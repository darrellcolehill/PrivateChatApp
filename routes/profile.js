var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {

  var token = req.cookies.whatsAppClone;

  //console.log(token);
  if(!token)
  {
    res.redirect("/login"); // TODO: send error status here
  }

  try{
    var data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log(data.username);
    // TODO: get user information and and pass as a parameter for rendering
    res.render('profile', { title: 'Private Chat App', username: data.username });
  }
  catch{
    res.redirect("/login"); // TODO send error status here
  }
	
});

module.exports = router;
