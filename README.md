# minipress

Minimal routing and config for Express

Create 1 file `app.js`

  require('minipress')('router.json', 'config.json');

## routing

Create 1 file `router.json`
  
  [
    "config/init",
    "config/db",
    "config/logger",
    "config/views",
    "config/session",
    "config/body_parser",
    "config/static",
    "config/error_handler"
  ]
  
Create the associated config files, example: `config/logger`

  var morgan = require('morgan');

  module.exports = function(app, next) {

    if (app.get('env') === 'production')
      app.use(morgan('common'));
    else
      app.use(morgan('dev'));

    next();

  };
  
