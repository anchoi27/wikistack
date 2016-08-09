var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page; 
var User = models.User; 
var Promise = require('bluebird');


router.get('/', function(req, res, next) {
  //res.send('got to GET /wiki/');
  var pageTitle = "Wiki Pages"
  Page.findAll({
  }).then(function(foundPages) {
  	res.render('index', {pages: foundPages, pageTitle: pageTitle})
  })
});


router.get('/users', function(req, res, next) {
  //res.send('got to GET /wiki/');
  var pageTitle = "Users Page"
  User.findAll({
  }).then(function(foundUsers) {
  	res.render('index', {usernames: foundUsers, pageTitle: pageTitle})
  })
});

//old userID page
// router.get('/users/:id', function(req, res, next) {
//   //res.send('got to GET /wiki/');
//   var userId = req.params.id;
//   var pageTitle = "Users Page"
//   Page.findAll({
//   	where: {authorId: userId}
//   }).then(function(pages) {
//   	res.render('index', {users: pages, pageTitle: pageTitle})
//   })
// });

router.get('/add', function(req, res, next) {
  //res.send('got to GET /wiki/add');
  res.render('addpage');
  //res.redirect('/');
});


router.get('/users/:userId', function(req, res, next) {

  var userPromise = User.findById(req.params.userId);
  var pagesPromise = Page.findAll({
    where: {
      authorId: req.params.userId
    }
  });

  Promise.all([
    userPromise, 
    pagesPromise
  ])
  .then(function(values) {
    var user = values[0];
    var pages = values[1];
    res.render('index', { user: user, pages: pages });
  })
  .catch(next);

});


router.post('/', function(req, res, next) {
  var title = req.body.title;
  var content = req.body.content;
  var name = req.body.name;
  var email = req.body.email;
  console.log(req.body);
  //res.send('got to POST /wiki/');
  
  User.findOrCreate({
  	where: {
   		name: req.body.name,
   		email: req.body.email
  		}
	})
	.then(function (values) {

  	var user = values[0];

  	var page = Page.build({
    	title: req.body.title,
    	content: req.body.content
  	});

  	return page.save().then(function (page) {
    	return page.setAuthor(user);
  	});
	})
	.then(function (page) {
  		res.redirect(page.route);
	})
	.catch(next);

  	// page.save().then(function(savedPage){
  	// 	res.redirect(savedPage.route); // virtual route
  	// }).catch(next);

  //res.redirect('/');
  //promise.all(user.save and page.save)
});


// router.delete('/:urlTitle/delete', function(req, res, next) {
//   Page.destroy({
//   	where: {urlTitle: req.params.urlTitle}
//   })
// });

router.get('/:urlTitle', function (req, res, next) {
  // Page.find({
  // 	where: {urlTitle: req.params.urlTitle}
  // })
  // .then(function(foundPage){
  // 	//res.json(foundPage);
  // 	//console.log(foundPage.dataValues);
  // 	//console.log(req.body)
  // 	res.render('wikipage', {content: foundPage.content, title: foundPage.title, name: foundPage.authorName});
  // 	//return foundPage;
  // })
  // .catch(next);

  // // User.find({
  // // 	where: {name: req.params.name}
  // // })
  // // .then(function(foundUser){
  // // 	//res.json(foundPage);
  // // 	console.log(foundUser.dataValues);
  // // 	res.render('wikipage', {name: foundUser.name, email: foundUser.email});
  // // 	//return foundPage;
  // // })
  // // .catch(next);

 	Page.findOne({
    	where: {
        	urlTitle: req.params.urlTitle
    	},
    	include: [
        	{model: User, as: 'author'}
    	]
	})
	.then(function (page) {
	    // page instance will have a .author property
	    // as a filled in user object ({ name, email })
	    if (page === null) {
	        res.status(404).send();
	    } else {
	        res.render('wikipage', {
	            name: page.author.name,
	            title: page.title,
	            content: page.content,
	        });
	    }
	})
	.catch(next);
});



module.exports = router;
