const Express = require("express");
var blueprint = require("./blueprint.json");
var users = require("./users.json");
const fs = require("fs");
const { exit } = require("process");

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
  var exists = false;

  //Check if username exists already
  for(i=0; i<users.length; i++){
    console.log(users[i].username, newUser.username);
    if (users[i].username == newUser.username){
      exists = true;
      break;
    }
  }
  if(exists == false){
    //Add user data to the store
    users.push(newUser);
    const usersStr = JSON.stringify(users);
    fs.writeFile("users.json", usersStr, (error) => {
      if (error) {
        console.error(error);
        throw error;
      }
    });
  }
  res.send();
});

app.listen(port, () => {

    console.log('Listening on port ' + port);

});