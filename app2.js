var mongoose = require('mongoose');
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