// Generated by CoffeeScript 1.6.1
(function() {
  var ContextParticipant, ContextParticipantProxy, Q, formatter, http, url,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  http = require('http');

  url = require('url');

  Q = require('q');

  formatter = require('./Utilities.js').formatter;

  ContextParticipant = (function() {

    function ContextParticipant(coupon, applicationName) {
      this.coupon = coupon;
      this.applicationName = applicationName;
    }

    ContextParticipant.prototype.ContextChangesPending = function(contextCoupon) {
      this.log("ContextChangesPending (accept'ed)");
      return {
        decision: "accept",
        reason: ""
      };
    };

    ContextParticipant.prototype.ContextChangesAccepted = function(contextCoupon) {
      return this.log("ContextChangesAccepted(" + contextCoupon + ")");
    };

    ContextParticipant.prototype.ContextChangesCanceled = function(contextCoupon) {
      return this.log("ContextChangesCanceled(" + contextCoupon + ")");
    };

    ContextParticipant.prototype.CommonContextTerminated = function() {
      return this.log("CommonContextTerminated");
    };

    ContextParticipant.prototype.Ping = function() {
      this.log("Ping. Pong.");
      return "Pong";
    };

    ContextParticipant.prototype.log = function(msg) {
      return console.log("" + this.applicationName + " (" + this.coupon + ") -> " + msg);
    };

    return ContextParticipant;

  })();

  ContextParticipantProxy = (function(_super) {

    __extends(ContextParticipantProxy, _super);

    function ContextParticipantProxy(coupon, applicationName, url) {
      this.coupon = coupon;
      this.applicationName = applicationName;
      this.url = url;
    }

    ContextParticipantProxy.prototype.ContextChangesPending = function(contextCoupon) {
      var deferred,
        _this = this;
      this.log("ContextChangesPending(" + contextCoupon + ") -- proxying to " + this.url);
      deferred = Q.defer();
      http.get("" + this.url + "/ContextParticipant/ContextChangesPending?contextCoupon=" + contextCoupon, function(res) {
        var chunks;
        chunks = "";
        res.on("data", function(chunk) {
          return chunks += chunk;
        });
        return res.on("end", function() {
          var response;
          response = formatter.parseObject(chunks);
          _this.log("received response '" + chunks + "' parsed into '" + response + "'");
          return deferred.resolve(response);
        });
      }).on("error", function(e) {
        _this.log("received error " + e);
        return deferred.resolve({
          decision: "error",
          reason: "Could not contact '" + _this.applicationName + "' at '" + _this.url + "'."
        });
      });
      return deferred.promise;
    };

    return ContextParticipantProxy;

  })(ContextParticipant);

  exports.ContextParticipant = ContextParticipant;

  exports.ContextParticipantProxy = ContextParticipantProxy;

}).call(this);