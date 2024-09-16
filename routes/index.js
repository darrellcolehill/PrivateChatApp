var express = require('express');
var router = express.Router();
var db = require('../db').db;



/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Private Chat App' });
  var username; // TODO: CHANGE TO GET FROM COOKIE
  var inboxes;
  var user1 = req.query.user1;
  var user2 = req.query.user2;
  var token = req.cookies.moosenger;

  if(!token)
  {
    console.log("token does not exist");
    res.redirect("/login"); // TODO: send error status here
  }
  else
  {
    //console.log(token);
    username = token;
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
                    //console.log(data);
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
  }

// TODO: add code to process POST request (sending mesages)

});


// TODO: check if inboxes exist already before querying it!
// Message is sent or inbox is added
router.post('/', function(req, res, next){

  var username;
  var user1 = req.query.user1;
  var user2 = req.query.user2;
  var inbox = [user1, user2];

  //console.log(req.body);

  // grabs the message from the body 
  var messageContent = req.body.message;
  var requestedUser = req.body.requestedUser;

  var token = req.cookies.moosenger;

  if(!token)
  {
    console.log("token does not exist");
    res.redirect("/login"); // TODO: send error status here
  }
  else
  {
    username = token;
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
    //var token = req.cookies.whatsAppClone;
    if(!username)
    {
      console.log("token");
      //console.log(username + " " + user1 +  " " + user2 + " " + messageContent);
      res.redirect("/login"); // TODO: send error status here
    }
    else if(!messageContent) // empty message OR users is trying to add an inbox
    {

      // Users is trying to add an inbox
      if(requestedUser)
      {
        //console.log(requestedUser);

        //finds which user should be user1 and user 2 for the inbox key
        var user1, user2;
        if(username > requestedUser)
        {
          user1 = username;
          user2 = requestedUser;
        }
        else
        {
          user1 = requestedUser;
          user2 = username;
        }

        // checks that the given inbox does not alread exist
        db.query("SELECT COUNT(*) AS cnt FROM inbox WHERE user1 = ? AND user2 = ?", [user1, user2], function(err, data) {
                
          if(err)
          {
            console.log(err);
            res.redirect("/?user1="+user1+"&user2=" + user2); //ADD ERROR MESSAGE HERE
          }
          else
          {
          
            if(data[0].cnt == 0)
            {
              // TODO: make sure that the requestedUser is found in the users table before creating inbox!!!
              
              // inbox does not exist, so insert
              // creates new inbox and adds it to the DB
              db.query("INSERT INTO inbox (user1, user2, numMessages) VALUES (?, ?, ?)", [user1, user2, 0], function(err, data) {
                if(err)
                {
                  console.log("error insert new inbox");
                  res.redirect("/?user1="+user1+"&user2=" + user2); //TODO ADD ERROR MESSAGE HERE
                }
                else
                {
                  
                  // Since we created the inbox, we must now also update the inconversation table
                  db.query("INSERT INTO inconversation (username, user1, user2) VALUES (?, ?, ?)", [username, user1, user2], function(err, data)
                  {
                    if(err)
                    {
                      console.log("Error updating inconversation table");
                      res.redirect("/?user1="+user1+"&user2=" + user2); //TODO ADD ERROR MESSAGE HERE
                    }
                  })
                  
                  var otherUser;
                  if(username == user1)
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
                      res.redirect("/?user1="+user1+"&user2=" + user2); //TODO ADD ERROR MESSAGE HERE
                    }
                    else
                    {
                      // TODO: change redirect to displays the newly created inbox
                      res.redirect("/?user1="+user1+"&user2=" + user2); //TODO ADD SUCCESS MESSAGE HERE
                    }
                  })
                }
              });

            }
            else
            {
              // inbox alread exist
              console.log("Inbox alread exist");
              res.redirect("/?user1="+user1+"&user2=" + user2); //TODO ADD ERROR MESSAGE HERE
            }
          }
        });

      }
      else
      {
        res.redirect("/?user1="+user1+"&user2=" + user2);
      }
      
    }
    else
    {
      try{
        //var data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        //console.log(data.username);
        
        if((user1 && user2) && (username == user1 || username == user2)) // User is trying to access an inbox they are a participent in
        {
          var curUser = username;
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
                    res.redirect("/?user1="+user1+"&user2=" + user2);
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
    }

  }

});

module.exports = router;
