var express 	= require('express'),
	fortune 	= require('./lib/fortune.js'),
	eloquent	= require('./query.js'), 
	formidable 	= require('formidable'),
	mongoose 	= require('mongoose'),
	Vacation 	= require('./models/vacation.js');
	credentials = JSON.parse(require('fs').readFileSync('./lib/credentials.js'));

var app = express();

// set up handlebars view engine
var handlebars = require('express3-handlebars').create({ defaultLayout:'main' });

//Set handlebar library
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

// var tours = [
// 	{ id: 0, name: 'Hood River', price: 99.99 },
// 	{ id: 1, name: 'Oregon Coast', price: 149.95 },
// ];

// /******************* PUT REQUEST *******************/

// app.put('/api/tour/:id', function(req, res){

// 	var p = tours.some(function(p){ return p.id == req.params.id });

// 	if( p ) {

// 		if( req.query.name ) p.name = req.query.name;
// 		if( req.query.price ) p.price = req.query.price;
// 		res.json({success: true});

// 	} else {
// 		res.json({error: 'No such tour exists.'});
// 	}
// });

// app.get('/users/:id',function(req,res){

// 	eloquent.getUser(req.params.id,function(user){
// 		res.json(user);
// 	});

// });


// /************************************** DEFAULT UPLOAD REQUEST **************************************/

// // Upload form page
// app.get('/vacation-photo',function(req,res){
// 	var now = new Date();
// 	res.render('vacation-photo',{
// 		 year: now.getFullYear(),month: now.getMonth	()
// 	 });
// });

// // Upload function
// app.post('/contest/vacation-photo/:year/:month', function(req, res){
//  	var form = new formidable.IncomingForm();
// 	form.parse(req, function(err, fields, files){
// 		if(err) return res.redirect(303, '/error');
// 		console.log('received fields:');
// 		console.log(fields);
// 		console.log('received files:');
// 		console.log(files);
// 		res.redirect(303, '/thank-you');
// 	 });
// });

// app.get('/about', function(req, res){
// 	res.render('about', { fortune: fortune.getFortune() });
// });


 /************************************** Handlebars **************************************/

// app.get('/handlebars', function(req, res){
// 	res.render('functionality', 
// 	{

// 		currency: {

// 			name: 'United States dollars',
// 			abbrev: 'USD'

// 		},

// 		tours: [

// 			{ name: 'Hood River', price: '$99.95' },
// 			{ name: 'Oregon Coast', price: '$159.95' }

// 		],

// 		specialsUrl: '/january-specials',
// 		currencies: [ 'USD', 'GBP', 'BTC' ]

// 	});
// });

var opts = {
	server: {
		socketOptions: { keepAlive: 1 }
	}
};

switch(app.get('env')){
	case 'development':
	mongoose.connect(credentials.mongo.development.connectionString, opts);
	console.log('connected1');
	break;
	case 'production':
	mongoose.connect(credentials.mongo.production.connectionString, opts);
	console.log('connected2');
	break;
	default:
	throw new Error('Unknown execution environment: ' + app.get('env'));
}


// Get vacations from the database
app.get('/vacations', function(req, res){
	Vacation.find({ available: true }, function(err, vacations){
		var context = {
			vacations: vacations.map(function(vacation){
 				vacation.price = vacation.getDisplayPrice();
 				return vacation;
 			})
		};
		res.render('vacations', context);
		// res.json(context);
		console.log(context);
	});

});


var VacationInSeasonListener = require('./models/vacationInSeasonListener.js');
app.get('/notify-me-when-in-season', function(req, res){
	res.render('notify-me-when-in-season', { sku: req.query.sku });
});
app.post('/notify-me-when-in-season', function(req, res){
	VacationInSeasonListener.update(
		{ email: req.body.email },
		{ $push: { skus: req.body.sku } },
		{ upsert: true },
		function(err){
			if(err) {
				console.error(err.stack);
				req.session.flash = {
					type: 'danger',
					intro: 'Ooops!',
					message: 'There was an error processing your request.',
				};
				return res.redirect(303, '/vacations');
			}
			req.session.flash = {
				type: 'success',
				intro: 'Thank you!',
				message: 'You will be notified when this vacation is in season.',
			};
			return res.redirect(303, '/vacations');
		}
		);
});

// Vacation.find(function(err, vacations){
// 	if(vacations.length) return;
// 	new Vacation({
// 		name: 'Hood River Day Trip',
// 		slug: 'hood-river-day-trip',
// 		category: 'Day Trip',
// 		sku: 'HR199',
// 		description: 'Spend a day sailing on the Columbia and ' +
// 		'enjoying craft beers in Hood River!',
// 		priceInCents: 9995,
// 		tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
// 		inSeason: true,
// 		maximumGuests: 16,
// 		available: true,
// 		packagesSold: 0,
// 	}).save();
// 	new Vacation({
// 		name: 'Oregon Coast Getaway',
// 		slug: 'oregon-coast-getaway',
// 		category: 'Weekend Getaway',
// 		sku: 'OC39',
// 		description: 'Enjoy the ocean air and quaint coastal towns!',
// 		priceInCents: 269995,
// 		tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
// 		inSeason: false,
// 		maximumGuests: 8,
// 		available: true,
// 		packagesSold: 0,
// 	}).save();
// 	new Vacation({
// 		name: 'Rock Climbing in Bend',
// 		slug: 'rock-climbing-in-bend',
// 		category: 'Adventure',
// 		sku: 'B99',
// 		description: 'Experience the thrill of climbing in the high desert.',
// 		priceInCents: 289995,
// 		tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'],
// 		inSeason: true,
// 		requiresWaiver: true,
// 		maximumGuests: 4,
// 		available: false,
// 		packagesSold: 0,
// 		notes: 'The tour guide is currently recovering from a skiing accident.',
// 	}).save();
// });

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


// Listen
app.listen(app.get('port'), function(){

	console.log( 'Express started on http://localhost:' +
		app.get('port') + '; press Ctrl-C to terminate.' );

});