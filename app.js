var express 	= require('express'),
	fortune 	= require('./lib/fortune.js'),
	eloquent	= require('./query.js'), 
	formidable 	= require('formidable');


var app = express();

// set up handlebars view engine
var handlebars = require('express3-handlebars').create({ defaultLayout:'main' });

//Set handlebar library
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

var tours = [
	{ id: 0, name: 'Hood River', price: 99.99 },
	{ id: 1, name: 'Oregon Coast', price: 149.95 },
];

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

app.get('/users/:id',function(req,res){

	eloquent.getUser(req.params.id,function(user){
		res.json(user);
	});

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
    res.render('home');
});


// Upload form page
app.get('/contest/vacation-photo',function(req,res){
	var now = new Date();
	res.render('vacation-photo',{
		 year: now.getFullYear(),month: now.getMonth	()
	 });
});

// Upload function
app.post('/contest/vacation-photo/:year/:month', function(req, res){
 	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		if(err) return res.redirect(303, '/error');
		console.log('received fields:');
		console.log(fields);
		console.log('received files:');
		console.log(files);
		res.redirect(303, '/thank-you');
	 });
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
	res.json({
		HTTP_CODE: 404,
		message : 'Not found'
	});
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