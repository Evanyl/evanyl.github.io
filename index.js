let express = require('express');
let app = express();

app.use(express.static('./'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});