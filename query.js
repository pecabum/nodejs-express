var mongo = require("mongodb");
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;

function getUser(id,callback) {

	var db = new mongo.Db("nodejs-introduction",new mongo.Server(host,port,{}));
	db.open(function(error){

		db.collection("user",function(error,collection){

			collection.find({"id":id},function(error,cursor) {

				cursor.toArray(function(error,users){
					var json;
					if(users.length == 0) {
						json = {
							HTTP_CODE : 404,
							message : "No user found"
						};
					} else {
						json = {
							HTTP_CODE : 200,
							user: users[0]
						};
					}
					callback(json);
				});

			});

		});

	});
}


module.exports.getUser = getUser;
























