var express = require('express');
var router = express.Router();
var db = require('../db').db;
var jwt = require('jsonwebtoken');

const url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {

  var user1 = req.query.user1;
  var user2 = req.query.user2;
  var inbox = [user1, user2];

  // Check that the tokin exist AND check if user1 and user2 URL parameter exist
  var token = req.cookies.whatsAppClone;
  console.log(token);
  if(!token || !user1 || !user2)
  {
    console.log("token or URL parameters does not exist");
    res.redirect("/login"); // TODO: send error status here
  }
  else 
  {
    try{
      var data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      console.log(data.username);

       // makes sure that the user's token matches to the user1 or user2 username values before displaying the messages
       // Ensures that a user is not able to see another users messages
       if(data.username == user1 || data.username == user2)
       {
         db.query("SELECT COUNT(*) AS cnt FROM inbox WHERE user1 = ? AND user2 = ?", inbox, function(err, data)  {

          if(!err && data[0].cnt != 0)
          {
             // TODO: update query so that it only returns the last 10 messages OR just extract the last 10 items from the data object
            db.query("SELECT content, sender, messageNo FROM message WHERE user1 = ? AND user2 = ?", inbox,  function(err, data) {
              if(err)
              {
                console.log(err);
              }
              else
              {
                // TODO ADD CHECK WHERE USER TRIED TO CHANGE THE OTHER USERS DATA IN THE URL FIELD
                console.log(data);
                res.render('messages', { title: 'Private Chat App', messages: data});
              }
            });
          }
          else
          {
            console.log("SQL error or Requested inbox does not exist");
            res.redirect("/login"); // TODO: send error status here
          }


         })

       }
       else
       {
        console.log("token or URL parameters is incorrect");
        res.redirect("/login"); // TODO: send error status here
       }

    }
    catch{
      console.log("error accessing token data");
      res.redirect("/login"); // TODO send error status here
    }
  }


  /*
  // TODO: update query so that it only returns the last 10 messages OR just extract the last 10 items from the data object
  db.query("SELECT content, sender, messageNo FROM message WHERE user1 = ? AND user2 = ?", inbox,  function(err, data) {
    if(err)
    {
      console.log(err);
    }
    else
    {
      console.log(data);
      res.render('messages', { title: 'Private Chat App', messages: data});
    }
  });
  */

});




// Message is sent
router.post('/', function(req, res, next){

  
  var user1 = req.query.user1;
  var user2 = req.query.user2;
  var inbox = [user1, user2];

  // grabs the message from the body 
  var messageContent = req.body.message;

  // Procedure for inserting message and updaating inbox
  /*
    pre) ensure that cookie exist and that cookie data corresponds to requested inbox data
    1) Find the number of messages sent bewteen the two users
    2) Insert the new message into the message DB (with the inbox keys specified in the URL parameters) by performming the following actions
      a) set the user1 and user2 message attributes to the user1 and user2 variables specified in the URL
      b) set the messageNo = numMessages + 1 (with numMessages being retrieved from step 1)
      c) examine the users login cookie to determin who the sender is and make the other user the recipient
      d) set the content = message (message is located in the body of the request)
    3) Update the number of messges sent in the corresponding inbox (with the inbox keys specified in the URL parameters)
  */

  // Makes sure that the users tokin matches to the user1 or user2 username values before displaying the messages
  var token = req.cookies.whatsAppClone;
  if(!token || !user2 || !user2 || !messageContent)
  {
    console.log("token or message data does not exist");
    res.redirect("/login"); // TODO: send error status here
  }

  try{
    var data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log(data.username);
    
    if(data.username == user1 || data.username == user2) // User is trying to access an inbox they are a participent in
    {
      var curUser = data.username;
      db.query("SELECT numMessages FROM inbox WHERE user1 = ? AND user2 = ?",inbox,  function(err, data) {
        if(err)
        {
          console.log(err);
          res.redirect("/login"); // TODO: send error status here
        }
        else
        {
          numMessages = data[0].numMessages;

          var recipient, sender;
          if(curUser == user1) 
          {
            recipient = user2; 
            sender = user1;
          }
          else 
          {
            recipient = user1;
            sender = user2;
          }

          // insert message into message DB here
          db.query("INSERT INTO message (user1, user2, messageNo, sender, recipient, content) VALUES (?, ?, ?, ?, ?, ?)", 
          [user1, user2, numMessages + 1, sender, recipient, messageContent], function(err, data) { // TODO: update so it sends the actual sender and recipient. Not just "username" and "user1"
              if(err)
              {
                console.log(err);
                res.redirect("/login"); // TODO: send error status here
              }
              else
              {
                db.query("UPDATE inbox SET numMessages = ? WHERE user1 = ? AND user2 = ?", [numMessages+1, user1, user2], function(err, data)  {
                  if(err)
                  {
                    console.log(err);
                    res.redirect("/login"); // TODO: send error status here
                  }
                });
                // redirect to messages page with user1 and user2 URL parameters intact. 
                // Allow users to see reflected change in inbox data
                res.redirect("/messages?user1="+user1+"&user2=" + user2);
              }
          });
        }
      });
    }
    else // User is trying to view other user's inbox
    {
      console.log("token or URL parameters is incorrect");
      res.redirect("/login"); // TODO: send error status here
    }
  }
  catch{
    console.log("error accessing token data");
    res.redirect("/login"); // TODO send error status here
  }

  // Original code
  /*
  db.query("SELECT numMessages FROM inbox WHERE user1 = ? AND user2 = ?",inbox,  function(err, data) {
    if(err)
    {
      console.log(err);
    }
    else
    {
      numMessages = data[0].numMessages;
      //TODO: insert message into message DB here
      db.query("INSERT INTO message (user1, user2, messageNo, sender, recipient, content) VALUES (?, ?, ?, ?, ?, ?)", 
      [user1, user2, numMessages + 1, "username", "user1", messageContent], function(err, data) { // TODO: update so it sends the actual sender and recipient. Not just "username" and "user1"
          if(err)
          {
            console.log(err);
            // TODO: redirect with error
          }
          else
          {
            db.query("UPDATE inbox SET numMessages = ? WHERE user1 = ? AND user2 = ?", [numMessages+1, user1, user2], function(err, data)  {
              if(err)
              {
                console.log(err);
                // TODO: redirect with error
              }
              else
              {
                //console.log(numMessages + 1);
              }
            });
            // redirect to messages page with user1 and user2 URL parameters intact
            res.redirect("/messages?user1="+user1+"&user2=" + user2);
          }
      });
    }
  });
  */


});




module.exports = router;