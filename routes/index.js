var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var url = 'mongodb://localhost:27017/users';
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('client-sessions');
var bcrypt = require('bcryptjs');

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
			
			db.collection('users').find({first_name : req.body.id}).toArray(function(err, result){
				
				if(!result.length) {
					
  					res.redirect('/login');
  				}else{
  					if(bcrypt.compareSync(req.body.password,result[0].password)){
  					req.session.result = result;	
  					res.redirect('/dashboard');
  				}else{
  					res.redirect('/login');
  				}}
			});
	});
});


router.post('/register', function(req, res, next) {
	//req.check('email', 'Invalid email address').isEmail();
	//req.check('password','password is invalid').equals(req.body.confirm_password);
	
	//var errors = req.getValidationResult();
	
	if(req.body.password===req.body.confirm_password){
	req.session.success = true;
	var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));	
	var item = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: hash,
	};
	
	mongo.connect(url, function(err, db){
		if(err) throw err

			db.collection('users').insertOne(item, function(err, result){
		
				res.redirect('/login');
			
				db.close();

			})
		
	});
  }else{
  	res.render('register',{error:"incorrect password"})
  	  }
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
				
			
				db.collection('data').find({},{textarea:-1,user:1}).toArray(function(err, results){
				console.log(results);
				res.render('dashboard',{data : results});
		
				db.close();

				})
				
			}


		});
})
	}else{
		res.render('login');
	}

});


router.post('/dashboard', function(req, res, next) {
	
		
				var user = req.session;
				
				var items = {
					user : req.session.result[0].first_name,
					textarea: req.body.textarea
				};
				
				mongo.connect(url, function(err, db){
						if(err) throw err
				
						db.collection('data').insertOne(items, function(err, result){
						})	
	
				res.redirect('/dashboard');
				
				db.close();
			})
})
	
	


router.get('/logout', function(req, res, next) {
	
  	req.session.destroy();
  	res.redirect('/');
});



router.post('/logout', function(req, res, next) {
	if(req.session && req.session.result){
		req.session.destroy();
  		res.redirect('/');
  }else{
  	res.redirect('/');
  }
 });
module.exports = router;
