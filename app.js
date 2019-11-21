let express = require('express');
let app = express();

app.use('/', express.static('public', {index: "index.html"}))

let server = app.listen(8080, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});