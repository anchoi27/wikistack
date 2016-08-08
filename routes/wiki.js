var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page; 
var User = models.User; 


router.get('/', function(req, res, next) {
  //res.send('got to GET /wiki/');
  res.redirect('/');
  next();
});

router.post('/', function(req, res, next) {
  var title = req.body.title;
  var content = req.body.content;
  var name = req.body.name;
  var email = req.body.email;
  console.log(req.body);
  //res.send('got to POST /wiki/');
  var page = Page.build({
  	title: title,
  	content: content
  });
  var user = User.build({
  	name: name,
  	email: email
  })

  page.save().then(function(savedPage){
  	res.redirect(savedPage.route); // route virtual FTW
  }).catch(next);

  user.save();
  res.redirect('/');
  next();
});

router.get('/add', function(req, res, next) {
  //res.send('got to GET /wiki/add');
  res.render('addpage');
});

router.get('/:urlTitle', function (req, res, next) {
  Page.find({
  	where: {urlTitle: req.params.urlTitle}
  }).then(function(foundPage){
  	//res.json(foundPage);
  	//console.log(foundPage.content);
  	res.render('wikipage', {content: foundPage.content});
  })
  .catch(next);
  //res.send('hit dynamic route at ' + req.params.urlTitle);
});



module.exports = router;
