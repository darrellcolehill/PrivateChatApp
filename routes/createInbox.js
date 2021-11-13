var express = require('express');
var router = express.Router();
var db = require('../db').db;
var jwt = require('jsonwebtoken');



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
      res.render('createInbox', { title: 'Private Chat App' });
    }
    catch{
      console.log("error accessing token data");
      res.redirect("/login"); // TODO send error status here
    }
  }
});



router.post('/', function(req, res, next){

  var body = req.body;
  var username = body.username;
  console.log("Recipient = " + username);


  db.query("SELECT COUNT(*) AS cnt FROM users WHERE username = ?" , [username], function(err, data)	{ 
      if(err)
      {
          console.log(err);
          res.render('createInbox', { title: 'Private Chat App' }); //ADD ERROR MESSAGE HERE
      }
      else
      {
          if(data[0].cnt > 0)
          {
            console.log("recipient found");
            // TODO: create inbox here
            var token = req.cookies.whatsAppClone;
            console.log(token);
            if(!token)
            {
              console.log("token does not exist");
              res.redirect("/login"); // TODO: send error status here
            }

            // Gets the user's username stored in token
            var data;
            try{
              data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
              console.log(data.username);
              var curUsername = data.username;
              
              //finds which user should be user1 and user 2 for the inbox key
              var user1, user2;
              if(data.username > username)
              {
                user1 = data.username;
                user2 = username;
              }
              else
              {
                user1 = username;
                user2 = data.username;
              }

              // checks that the given inbox does not alread exist
              db.query("SELECT COUNT(*) AS cnt FROM inbox WHERE user1 = ? AND user2 = ?", [user1, user2], function(err, data) {
                
                if(err)
                {
                  console.log(err);
                  res.render('createInbox', { title: 'Private Chat App' }); //ADD ERROR MESSAGE HERE
                }
                else
                {
                
                  if(data[0].cnt == 0)
                  {
                    // inbox does not exist, so insert
                    // creates new inbox and adds it to the DB
                    db.query("INSERT INTO inbox (user1, user2, numMessages) VALUES (?, ?, ?)", [user1, user2, 0], function(err, data) {
                      if(err)
                      {
                        console.log("error insert new inbox");
                        res.render('createInbox', { title: 'Private Chat App' }); //ADD ERROR MESSAGE HERE
                      }
                      else
                      {
                        
                        // Since we created the inbox, we must now also update the inconversation table
                        db.query("INSERT INTO inconversation (username, user1, user2) VALUES (?, ?, ?)", [curUsername, user1, user2], function(err, data)
                        {
                          if(err)
                          {
                            console.log("Error updating inconversation table");
                            res.render('createInbox', { title: 'Private Chat App' }); //ADD ERROR MESSAGE HERE
                          }
                        })
                        
                        var otherUser;
                        if(curUsername == user1)
                        {
                          otherUser = user2;
                        }
                        else
                        {
                          otherUser = user1;
                        }
                        db.query("INSERT INTO inconversation (username, user1, user2) VALUES (?, ?, ?)", [otherUser, user1, user2], function(err, data)
                        {
                          if(err)
                          {
                            console.log("Error updating inconversation table");
                            res.render('createInbox', { title: 'Private Chat App' }); //ADD ERROR MESSAGE HERE
                          }
                          else
                          {
                            res.redirect("/inboxDisplay");
                          }
                        })
                      }
                    });

                  }
                  else
                  {
                    // inbox alread exist
                    console.log("Inbox alread exist");
                    res.render('createInbox', { title: 'Private Chat App' }); //ADD ERROR MESSAGE HERE
                  }
                }
              });

            }
            catch{
              console.log("error accessing token data");
              res.redirect("/login"); // TODO send error status here
            }
          }
          else
          {
            console.log("recipient NOT found");
            res.render('createInbox', { title: 'Private Chat App' }); // TODO: add error message here
          }
      }
  });

});
   
module.exports = router;
