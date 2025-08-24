const Express = require("express");
const blueprint = require("./blueprint.json");
// import Cors from "cors";
const app = Express();
app.use(Express.json());
const port = 5000;

app.get('/', (req, res) => {
  res.send(blueprint);
});

app.post('/', (req, res) => {
  console.log(req.body);

  res.send();
});

app.listen(port, () => {

    console.log('Listening on port ' + port);

});