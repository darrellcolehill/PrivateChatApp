# PrivateChatApp
A chat application (similar to WhatsApp) that allows private communication between individuals


## Steps to run program
1) Download above files
2) Open a terminal in the server folder
3) Download specified dependencies with: npm install DEPENDENCY_NAME
4) Generate values for the .env variables by using the following command twice. Copy the output from one command to the ACCESS_TOKEN_SECRET, and the other ouptut to REFRESH_TOKEN_SECRET 
            node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
5) Ensure that your information in the db.js file is correct, and that you have created a private_chat_app database in the corresponding SQL server
6) run node app



### Node.js Packages
<details>
  <summary></summary>
<ul>
<li> <a href="https://www.npmjs.com/package/mysql">msql</a> </li>
<li> <a href="https://www.npmjs.com/package/body-parser">body-parser </a> </li>
<li> <a href="https://www.npmjs.com/package/bcryptjs">becryptjs </a> </li>
<li> <a href="https://www.npmjs.com/package/jsonwebtoken">jsonwebtoken</a> </li>
</ul>
</details>
