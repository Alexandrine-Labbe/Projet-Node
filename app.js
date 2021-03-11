const express = require('express');
const PORT = process.env.PORT || 5000
const routerArticles = require('./routes/articles')
const routerAuthentification = require('./routes/authentication')
const cors = require('cors')

const app = express();

app.use(cors())


app.use('/articles/', routerArticles)
app.use('/authentification/', routerAuthentification)


app.listen(PORT, function () {
    console.log('App listening on port ' + PORT);
});
