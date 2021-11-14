var express = require('express');
var router = express.Router();
var db = require('../db').db;

/* GET home page. */
router.get('/', function(req, res, next) {


  var createInboxTable = "CREATE TABLE inbox (user1 VARCHAR(20), user2 VARCHAR(20), numMessages INT, PRIMARY KEY(user1, user2))";
  var createInConversationTable = "CREATE TABLE inconversation (username VARCHAR(20), user1 VARCHAR(20), user2 VARCHAR(20), PRIMARY KEY(username, user1, user2))";
  var createMessageTable = "CREATE TABLE message (user1 VARCHAR(20), user2 VARCHAR(20), messageNo INT, recipient VARCHAR(20), sender VARCHAR(20), content TEXT, PRIMARY KEY(user1, user2, messageNo))";
  var createUserTable = "CREATE TABLE users (username VARCHAR(20), password VARCHAR(60), email VARCHAR(20), dob DATE, PRIMARY KEY(username))";
  
  
  db.query(createInboxTable, function (err, result) {
    if (err) throw err;
    console.log("Inbox table created");
  });

  db.query(createInConversationTable, function (err, result) {
    if (err) throw err;
    console.log("inconversation table created");
  });

  db.query(createMessageTable, function (err, result) {
    if (err) throw err;
    console.log("message table created");
  });

  db.query(createUserTable, function (err, result) {
    if (err) throw err;
    console.log("users table created");
  });

  res.send("Done creating tables");

});

module.exports = router;