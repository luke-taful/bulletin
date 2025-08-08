const Express = require("express");
const blueprint = require("./blueprint.json");
// import Cors from "cors";
const app = Express();
const port = 5000;

app.get('/', (req, res) => {
  res.send(blueprint);
})

app.listen(port, () => {

    console.log('Listening on port ' + port);

})