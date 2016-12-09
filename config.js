exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production'
                           ? 'mongodb://<dbuser>:<dbpassword>@ds129028.mlab.com:29028/mongoose-shopping-list'
                           : 'mongodb://localhost/shopping-list-dev')
exports.PORT = process.env.PORT || 8080
