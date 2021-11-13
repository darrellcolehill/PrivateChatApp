var express = require('express');
var router = express.Router();
var db = require('../db').db;
var jwt = require('jsonwebtoken');

//var adminUser = "username"; // TODO: DELETE AFTER TESIING will be token later

/* GET home page. */
router.get('/', function(req, res, next) {

  var token = req.cookies.whatsAppClone;
  console.log(token);
  if(!token)
  {
    console.log("token does not exist");
    res.redirect("/login"); // TODO: send error status here
  }
  else
  {
    try{
      var data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      console.log(data.username);
      db.query("SELECT * FROM inconversation WHERE username = ?", data.username, function(err, data)	{
        if(err)
        {
          console.log(err);
        }
        else
        {
          res.render('inboxDisplay', { title: 'Private Chat App', inboxes: data});
        }
      });
      
    }
    catch{
      console.log("error accessing token data");
      res.redirect("/login"); // TODO send error status here
    }
  }

});


module.exports = router;