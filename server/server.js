const Express = require("express");
// import Cors from "cors";
const app = Express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {

    console.log('Listening on port ${port}')

})