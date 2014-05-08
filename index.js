{
  let path = require('path');
  let fs   = require('fs');

  function coju_static(coju) {
    // The path to static resources
    this.staticDir = 'public';

    // Headers for this request
    this.headers   = {
      "css" : {
        "content-type"  : "text/css",
        "cache-control" : 'public',
        "expires"       : (new Date()).toString()
      },
      "js"  : {
        "content-type"  : "text/javascript",
        "cache-control" : 'public',
        "expires"       : (new Date()).toString()
      },
      "img" : {
        "content-type"  : "img/%type",
        "cache-control" : 'public',
        "expires"       : (new Date()).toString()
      }
    };

    // Patterns for matching requests
    let patterns = {
      "img"  : /.(jpg|gif|png|bmp|jpeg)$/i,
      "css"  : /.(css)$/i,
      "js"   : /.(js)$/i,
      "html" : /.(html|htm)/i
    };

    // Listen for requests
    coju.on('request', function coju_static_server(req, res) {
      let url = req.url;
      for (let i in patterns) {
        let matches = url.match(patterns[i]);
        if (matches) {
          for (let h in this.headers[matches[1]]) {
            res.setHeader(h, this.headers[matches[1]][h]);
          }

          // Send the file
          res.end(fs.readFileSync('public' + url));
        }
      }
    }.bind(this));
  }

  let csp = coju_static.prototype;

  csp.setStaticDir = function static_setStaticDir(path) {
    this.staticDir = path;
    return this;
  };

  csp.setCSSHeaders = function static_CSSHeaders(headers) {
    headers.forEach(function(header) {
      this.headers.css[header.name] = header.value;
    });
    return this;
  };

  csp.setJSHeaders = function static_JSHeaders(headers) {
    headers.forEach(function(header) {
      this.headers.js[header.name] = header.value;
    });
    return this;
  };

  csp.setImgHeaders = function static_ImgHeaders(headers) {
    headers.forEach(function(header) {
      this.headers.img[header.name] = header.value;
    });
    return this;
  };

  module.exports = function(coju) {
    return new coju_static(coju);
  };
}