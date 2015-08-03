var mongoose =  require('mongoose');
var Schema = mongoose.Schema;

var UserScheme = new Schema( {
	username: {type: String}
});

module.exports = mongoose.model('User', UserScheme);