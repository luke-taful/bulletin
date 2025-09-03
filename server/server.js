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
  const newUserReq = (req.body.userData);
  const filePath = path.join(__dirname, "users", `${newUserReq.username}.json`);

  //Check if user exists already
  if (fs.existsSync(filePath)){return res.json({ success: false, message: "User already exists"})};

  //Attempt to create new user file
  const newUserDefault = {
    "user": {
      "username":newUserReq.username,
      "password":newUserReq.password
    },
    "blueprint": [
      {"id":0,"type":"text","text":"No existing board found","color":"green","font":"impact","textSize":"xxx-large","xpos":350,"ypos":510}, 
      {"id":1,"type":"text","text":"Click the edit button to get started!","color":"green","font":"impact","textSize":"xxx-large","xpos":350,"ypos":450}
    ]
  };
  const nsString = JSON.stringify(newUserDefault, null, 2);

  fs.writeFile(filePath, nsString, (err) => {
    if(err){return res.json({ success: false, message: "Error creating user"})}
    else {return res.json({ success: true, message: `User registered successfully`})}
  });
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