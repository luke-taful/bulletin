const Express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const  cors = require("cors");

const app = Express();
app.use(Express.json());

app.use(cors({
  origin: "http://localhost:3000"  // React dev server
}));
app.use("/uploads", Express.static(path.join(__dirname, "uploads")));
const port = 5000;

//Blueprint update
app.post('/blueprint', (req, res) => {
  const blueprint = (req.body.blueprint);
  const user = (req.headers.username);
  const lastid = (req.headers.lastid);
  const filePath = path.join(__dirname, "users", `${user}.json`);
  if (!fs.existsSync(filePath)){return res.json({ success: false, message: "There was an error retrieving user info"})};

  //Read existing user file
  try {
    const currentData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    currentData.boardinfo.blueprint = blueprint;
    currentData.boardinfo.lastid = Number(lastid);
    //Write modified object data to user file
    const newBP = JSON.stringify(currentData, null, 2);
    fs.writeFile(filePath, newBP, (err) => {
      if(err){return res.json({ success: false, message: "There was an error saving your board"})}
      else {return res.json({ success: true, message: `Board update successful`})}
    });

  }catch(error){return res.json({ success: false, message: "There was an error retrieving user info"})};
});

//Recieving image data when they are added to a user board
app.post('/images',
  bodyParser.raw({ type: ["image/jpeg", "image/png"], limit: "5mb" }),
  (req, res) => {
    const imgName = req.headers.imgname;
    console.log(imgName);
    const filePath = path.join(__dirname, "uploads", imgName); 
    try{
      console.log(req.body);
      fs.writeFile(filePath, req.body, (error) => {
        if (error) {
          return res.json({ success: false, message: "There was an error saving image"})
        }
      });
      return res.json({ success: true, message: `Image upload successful`});
    }catch(error){return res.json({ success: false, message: "There was an error saving image"})}
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
    "boardinfo": {
      "lastid": 1,
      "blueprint": [
        {"id":0,"type":"text","text":"No existing board found","color":"green","font":"impact","textSize":"xxx-large","xpos":350,"ypos":510}, 
        {"id":1,"type":"text","text":"Click the edit button to get started!","color":"green","font":"impact","textSize":"xxx-large","xpos":350,"ypos":450}
      ]
    }
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
  if (!fs.existsSync(filePath)) {return res.json({ success: false, message: "User Not Found", user: null, boardinfo: null})};
  // Read user data
  try {
    const userResponse = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    //Check password
    if(userResponse.user.password != userReq.password){return res.json({ success: false, message: "Incorrect Password", user: null, boardinfo: null})};
    //Return if data found
    return res.json({ success: true, message: "User Data Found", user: userResponse.user, boardinfo: userResponse.boardinfo});
  }
  //Else Return Error
  catch(error){
    console.log(error);
    return res.json({ success: false, message: "Error fetching user data", user: null, boardinfo: null})}
});


//run server
app.listen(port, () => {console.log('Listening on port ' + port);});