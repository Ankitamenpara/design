var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var url = 'mongodb://localhost:27017/users';
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('client-sessions');

mongo.connect(url, function(err, db){
	if(err) throw err
		db.createCollection('users', function(err,collection){

		})
})
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home',{success: req.session.success, errors: req.session.errors });
  req.session.errors = null;
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
	mongo.connect(url, function(err, db){
		if(err) throw err
			
			db.collection('users').find({first_name : req.body.id , password : req.body.password}).toArray(function(err, result){
				
				if(result.length !== 0) {
					req.session.result = result;
					
  					res.redirect('/dashboard');
  				}else{
  					res.redirect('/login');
  				}
			});
	});
});

router.post('/register', function(req, res, next) {
	
	req.session.success = true;
		
	var item = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: req.body.password,
	};
	mongo.connect(url, function(err, db){
		if(err) throw err

			db.collection('users').insertOne(item, function(err, result){
		
				res.redirect('/dashboard');
			
				db.close();

			})
		
	});
  
});

router.get('/register', function(req, res, next) {
  res.render('register');
});


router.get('/dashboard', function(req, res, next) {
	
	if(req.session && req.session.result){
	
		mongo.connect(url, function(err, db){
		if(err) throw err
		db.collection('users').find({first_name : req.session.result[0].first_name}).toArray(function(err, result){
				
			if(!result){
				req.session.reset();
				
				res.render('login');

			}else{
				res.locals.result = result;
				res.render('dashboard');
			}


		});
})
	}else{
		res.render('login');
	}

});
 
router.get('/logout', function(req, res, next) {
	
  	req.session.destroy();
  	res.redirect('/');
});

router.post('/logout', function(req, res, next) {
	req.session.destroy();
  	res.redirect('/');
 });
module.exports = router;
