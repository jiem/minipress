var express = require('express');
var path = require('path');

//==============================================================================
module.exports = function (routerFile, configFile) {
  
  var app = express();
  
  config(app, configFile, function() {
    route(app, routerFile);
    app.listen(app.get('port'));    
  });
  
};

//==============================================================================
function route(app, routerFile) {

  var routes = require(path.resolve(routerFile));
  var reg = /(\S+)\s+(\S+)/;
  var r, method, url, actions, action;

  for (r in routes) {
    if (reg.test(r)) {
      method = RegExp.$1;
      url = RegExp.$2;
      actions = loadActions(routes[r]);
      action = actions.pop();
      app[method.toLowerCase()](url, actions, action); 
    }
  }

}

//==============================================================================
function loadActions(paths) {

  var actions = [];

  if (typeof paths === 'string')
    paths = [paths];

  paths.forEach(function(p) {
    
    var ext = path.extname(p);
    var action, file;

    if (ext === '.html') {
      action = (createRenderer(p));
    } else if (ext === '') {
      action = require(path.resolve(p + '.js'));
    } else {
      file = path.resolve(path.dirname(p) + '/' + path.basename(p, ext));
      action = require(file)[ext.substr(1)];
    }

    if (typeof action !== 'function') {
      console.log('Invalid route:', p);
      process.exit(1);
    }

    actions.push(action);
    
  });

  return actions;

}

//==============================================================================
function createRenderer(view) {
  return function(req, res) {
    res.render(view, req.params);
  };
}

//==============================================================================
function config(app, configFile, callback) {

  var configs = require(path.resolve(configFile));

  (function () {
    
    var file, configurer; 
    
    if (configs.length) {
      file = path.resolve(configs.shift());
      configurer = require(file);
      if (typeof configurer !== 'function') {
        console.log('Invalid config:', file);
        process.exit(1);
      }
      configurer(app, arguments.callee);
    } else {
      callback();
    }

  })();
  
}

