module.exports = function(app) {

require('./controllers/users.controller')(app)
require('./controllers/post.controller')(app)
}