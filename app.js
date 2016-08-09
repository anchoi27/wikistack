var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var swig = require('swig');
var fs = require('fs');
var models = require('./models');
var wikiRouter = require('./routes/wiki');
var path = require('path');


// point res.render to the proper directory
//app.set('views', path.join(__dirname, '/views/'));
app.set('views', __dirname + '/views');
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files
// have it use swig to do so
app.engine('html', swig.renderFile);
// turn of swig's caching
swig.setDefaults({cache: false});


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/wiki', wikiRouter);


models.Page.sync({force: true})
.then(function () {
    return models.User.sync({force: true});
})
.then(function () {
    app.listen(3001, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(console.error);


