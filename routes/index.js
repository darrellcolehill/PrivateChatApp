var express = require('express');
var router = express.Router();
var db = require('../db').db;

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Private Chat App' });
  var username = "username"; // TODO: CHANGE TO GET FROM COOKIE
  var inboxes;
  var user1 = req.query.user1;
  var user2 = req.query.user2;
  var messages;


  db.query("SELECT * FROM inconversation WHERE username = ?", username, function(err, data)	{
    if(err)
    {
      console.log(err);
    }
    else
    {
      inboxes = data;

      // Checks is the user1 and user2 variables are defined in the URL,
      // if so, get the messages between user1 and user2
      if(user1 && user2)
      {
        var inbox = [user1, user2];

        //var data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // makes sure that the user's token matches to the user1 or user2 username values before displaying the messages
        // Ensures that a user is not able to see another users messages
        if(username == user1 || username == user2)
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
                  // Store current user as an index ot the inbox array
                  console.log(data);
                  res.render('index', { title: 'Private Chat App', messages: data, inboxes, curInbox: inbox, curUser: username});
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
      else
      {
        //console.log("MISSING USERSESERSERSERES");
        res.render('index', { title: 'Private Chat App', inboxes, messages: null});
      }
    }
  });


// TODO: add code to process POST request (sending mesages)

});


router.post('/', function(req, res, next) {
  //console.log("post made");
  //res.render('index', { title: 'Private Chat App', inboxes, messages: null});

  var username = "username"; // TODO: CHANGE TO GET FROM COOKIE
  var inboxes;
  var user1 = req.query.user1;
  var user2 = req.query.user2;
  var messages;

  if(user1 && user2)
  {
    // TODO: send message to specified inbox and then reidrect to the same page so the messages page is updated. 
  }
  else
  {
    // missing inbox data in url variables
  }
});

module.exports = router;
