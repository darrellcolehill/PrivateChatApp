var mysql = require('mysql');
//=================== TODO update following block of code with correct DB. ===================
//Creates connection to the MySql database (NOTE: will need to change when switching to development phase)
const db = mysql.createConnection({
	//connectinoLimit: 50,
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'private_chat_app'
});

//Connects
db.connect((err) => {
	if(err)
	{
		throw err;
	}
	console.log("MySql connected");
})

const verifyLogin = (req, res, next) =>	{
	const token = req.cookie.whatsAppClone;
	if(!token)
	{
		return res.sendStatus(403);
	}
	try{
		console.log("cookie exist")
		const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		req.username = data.username;
		//console.log(req.username);
		return next();
	} catch{
		return res.sendStatus(403);
	}
}


module.exports = {db, verifyLogin};