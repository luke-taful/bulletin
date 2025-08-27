const Express = require("express");
var blueprint = require("./blueprints/default.json");
var users = require("./users.json");
const fs = require("fs");

const app = Express();
app.use(Express.json());
const port = 5000;

app.get('/blueprint', (req, res) => {
  res.send(blueprint);
});

app.post('/blueprint', (req, res) => {
  blueprint = (req.body.blueprint);
  const newBP = JSON.stringify(blueprint);
  fs.writeFile("blueprint.json", newBP, (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
  });
  res.send();
});

app.post('/login', (req, res) =>{
  console.log(req.body);
  res.send()
});

app.post('/register', (req, res) =>{
  const newUser = (req.body.userData);

  //Check if username exists already
  for(i=0; i<users.length; i++){
    if (users[i].username == newUser.username){
      return res.json({ success: false, message: "User already exists" });
    }
  }

  //Otherwise add user data to the store
  users.push(newUser);
  const usersStr = JSON.stringify(users);
  fs.writeFile("users.json", usersStr, (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
  });
  res.json({ success: true, message: "User registered successfully"});
});

//run api
app.listen(port, () => {console.log('Listening on port ' + port);});