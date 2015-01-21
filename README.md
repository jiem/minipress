# minipress

Minimal routing and config for Express

Create 1 file `app.js`

```javascript
  require('minipress')('router.json', 'config.json');
```

## routing

Create 1 file `router.json`

```json
{
  
  "GET /user/:name": [
    "middlewares/check_logged_in",
    "controllers/user.get"
  ],

  "POST /user": "controllers/user.create",

  "GET /login": "controllers/login.render",

  "POST /login": "controllers/login.auth",

  "GET /logout": "controllers/logout"
  
}
```

Create the associated controller/middleware files, examples: 

File `middlewares/check_logged_in.js`
```javascript
module.exports = function(req, res, next) {

  if (req.session.isLogged)
    next();
  else
    res.send('Please <a href="/login">login</a>');

};
```

File `controllers/user.js`
```javascript
var User = require('../models/user');

exports.get = function(req, res) {
  
  User.get(req.params.name, function(err, user) {
    if (err || !user) {
      res.send('Could not find user: ' + req.params.name);
    } else {
      res.json(user);  
    }
  });
  
};

exports.create = function(req, res) {

  User.create({
    name: req.body.name,
    password: req.body.password
  }, function(err) {
    if (err)
      res.send('Invalid user');
    else
      res.send('User created');
  });

};
```

## config

Create 1 file `config.json`

```json  
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
```
  
Create the associated config files, example: `config/logger`

```javascript
var morgan = require('morgan');

module.exports = function(app, next) {

  if (app.get('env') === 'production')
    app.use(morgan('common'));
  else
    app.use(morgan('dev'));

  next();

};
```  