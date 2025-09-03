const Express = require("express");
const fs = require("fs");
const path = require("path");

const app = Express();
app.use(Express.json());
const port = 5000;

// app.get('/blueprint', (req, res) => {
//   res.send(blueprint);
// });

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

//Adding new user
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

//Existing user data request
app.post('/login', (req, res) =>{
  const userReq = (req.body.userData);
  const filePath = path.join(__dirname, "users", `${userReq.username}.json`);
  // If user doesnt exist
  if (!fs.existsSync(filePath)) {return res.json({ success: false, message: "User Not Found", user: null, blueprint: null})};
  // Read user data
  try {
    const userResponse = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        console.log(userResponse);
    //Check password
    if(userResponse.user.password != userReq.password){return res.json({ success: false, message: "Incorrect Password", user: null, blueprint: null})};
    //Return if data found
    return res.json({ success: true, message: "User Data Found", user: userResponse.user, blueprint: userResponse.blueprint});
  }
  //Else Return Error
  catch(error){
    console.log(error);
    return res.json({ success: false, message: "Error fetching user data", user: null, blueprint: null})}
});

//run api
app.listen(port, () => {console.log('Listening on port ' + port);});