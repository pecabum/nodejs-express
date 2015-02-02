var express = require('express');
var fortune = require('./lib/fortune.js');
var app = express();
// set up handlebars view engine

var handlebars = require('express3-handlebars').create({ defaultLayout:'main' });

//Set handlebar library
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

// /****************TESTING****************/
// /*
//     When we have ?test=1 in query string unit testing will be enabled
// */ 
// // app.use(function(req, res, next){
// //  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
// //  next();
// // });

// // Testing about
// app.get('/about', function(req, res) {
//    res.render('about', {
//        fortune: fortune.getFortune(),
//        pageTestScript: '/qa/tests-about.js'
//    });

// });

// /****************TESTING****************/ 

var tours = [
{ id: 0, name: 'Hood River', price: 99.99 },
{ id: 1, name: 'Oregon Coast', price: 149.95 },
];

// app.get('/api/tours', function(req, res){

// 	 var toursXml = '<?xml version="1.0"?><tours>' +
// 	 products.map(function(p){

// 		 return '<tour price="' + p.price +
// 		 '" id="' + p.id + '">' + p.name + '</tour>';
// 	 }).join('') + '</tours>';

// 	 var toursText = tours.map(function(p){
// 	 	return p.id + ': ' + p.name + ' (' + p.price + ')';
// 	 }).join('\n');

// 	 res.format({

// 		'application/json': function(){
// 		 	res.json(tours);
// 		 },

// 		 'application/xml': function(){

// 			 res.type('application/xml');
// 			 res.send(toursXml);

// 		 },

// 		 'text/xml': function(){

// 			 res.type('text/xml');
// 			 res.send(toursXml);

// 		 },

// 		 'text/plain': function(){

// 			 res.type('text/plain');
// 			 res.send(toursXml);

// 		 }

// 	 });

// });

/******************* PUT REQUEST *******************/

app.put('/api/tour/:id', function(req, res){

	var p = tours.some(function(p){ return p.id == req.params.id });

	if( p ) {

		if( req.query.name ) p.name = req.query.name;

		if( req.query.price ) p.price = req.query.price;

		res.json({success: true});

	} else {

		res.json({error: 'No such tour exists.'});

	}

});

/******************* DELETE REQUEST *******************/

app.delete('/api/tour/:id', function(req, res){

	var i;

	for( var i=tours.length-1; i>=0; i-- )

		if( tours[i].id == req.params.id ) break;

	if( i>=0 ) {

		tours.splice(i, 1);

		res.json({success: true});

	} else {

		res.json({error: 'No such tour exists.'});

	}

});

/******************* DEFAULT REQUEST *******************/


app.get('/', function(req, res){
	document.write('<h1>Please Don\'t Do This</h1>');

	document.write('<p><span class="code">document.write</span> is naughty,\n');

	document.write('and should be avoided at all costs.</p>');

	document.write('<p>Today\'s date is ' + new Date() + '.</p>');
	// res.json(tours);
    //res.render('home');
});

app.get('/about', function(req, res){
	res.render('about', { fortune: fortune.getFortune() });
});

app.get('/handlebars', function(req, res){
	res.render('functionality', 
	{

		currency: {

			name: 'United States dollars',
			abbrev: 'USD'

		},

		tours: [

			{ name: 'Hood River', price: '$99.95' },
			{ name: 'Oregon Coast', price: '$159.95' }

		],

		specialsUrl: '/january-specials',
		currencies: [ 'USD', 'GBP', 'BTC' ]

	});
});


// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)

app.use(function(err, req, res, next){

	console.error(err.stack);
	res.status(500);
	res.render('500');

});


app.listen(app.get('port'), function(){

	console.log( 'Express started on http://localhost:' +
		app.get('port') + '; press Ctrl-C to terminate.' );

});