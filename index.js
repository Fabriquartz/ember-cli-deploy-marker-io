/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
"use strict";

var fs = require('fs');
var path = require('path');
var template = require('lodash/template');

var BasePlugin = require("ember-cli-deploy-plugin");

module.exports = {
  name: "ember-cli-deploy-marker-io",

  createDeployPlugin: function (options) {
    var DeployPlugin = BasePlugin.extend({
      name: options.name,
      defaultConfig: {
        distDir: function(context) {
          return context.distDir;
        },
        integrateMarker: true,
      },
      requiredConfig: ["destinationId"],

      willUpload() {
        if(this.readConfig('integrateMarker')) {
          // render marker snippet with fulfilled config
          var htmlPath = path.join(__dirname, 'addon', 'marker.html');
          var html = fs.readFileSync(htmlPath, 'utf-8');
          var snippet = template(html)({
            markerDestinationId: this.readConfig('destinationId')
          });

          var indexPath = path.join(this.readConfig('distDir'), "index.html");
          var index = fs.readFileSync(indexPath, 'utf8');
          index = index.replace('<meta name="marker"/>', snippet);
          fs.writeFileSync(indexPath, index);
        }
      }
    });

    return new DeployPlugin();
  },

  contentFor: function(type) {
    if (type === 'head') {
      return '<meta name="marker"/>';
    }
  }
};
