// Generated by CoffeeScript 1.6.1
(function() {
  var ContextData, events, logger,
    _this = this,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  events = require('events');

  logger = require('winston');

  ContextData = (function(_super) {

    __extends(ContextData, _super);

    function ContextData(name, participants, items, notifier) {
      var _this = this;
      this.name = name;
      this.participants = participants != null ? participants : [];
      this.items = items != null ? items : {};
      this.notifier = notifier;
      this.SetItemValues = function(participantCoupon, itemNames, itemValues, contextCoupon) {
        return ContextData.prototype.SetItemValues.apply(_this, arguments);
      };
      this.GetItemValues = function(participantCoupon, itemNames, contextCoupon, onlyChanges) {
        return ContextData.prototype.GetItemValues.apply(_this, arguments);
      };
      this.GetItemNames = function(contextCoupon) {
        return ContextData.prototype.GetItemNames.apply(_this, arguments);
      };
      this._ = require('underscore');
      this.sessions = {};
    }

    ContextData.prototype.InvokeAndMapArguments = function(method, args) {
      var _ref;
      switch (method) {
        case "GetItemNames":
          return this.GetItemNames(args.contextCoupon);
        case "GetItemValues":
          return this.GetItemValues(args.participantCoupon, args.itemNames.split("|"), args.contextCoupon, ((_ref = args.onlyChanges) != null ? _ref.toLowerCase() : void 0) === 'true');
        case "SetItemValues":
          return this.SetItemValues(args.participantCoupon, args.itemNames.split("|"), args.itemValues.split("|"), args.contextCoupon);
        default:
          throw {
            msg: "No such method '" + method + "' on Context"
          };
      }
    };

    ContextData.prototype.GetItemNames = function(contextCoupon) {
      var items, _ref;
      items = ((_ref = this.sessions[contextCoupon]) != null ? _ref.items : void 0) || this.items;
      return this._.keys(items);
    };

    ContextData.prototype.GetItemValues = function(participantCoupon, itemNames, contextCoupon, onlyChanges) {
      var items, _ref;
      if (onlyChanges) {
        throw {
          msg: "'onlyChanges' argument to GetItemValues with value true not currently supported",
          status: 501
        };
      }
      items = ((_ref = this.sessions[contextCoupon]) != null ? _ref.items : void 0) || this.items;
      return this._.map(itemNames, function(name) {
        return items[name];
      });
    };

    ContextData.prototype.SetItemValues = function(participantCoupon, itemNames, itemValues, contextCoupon) {
      var i, items, participant, _fn, _i, _j, _len, _ref, _ref1, _ref2,
        _this = this;
      items = ((_ref = this.sessions[contextCoupon]) != null ? _ref.items : void 0) || this.items;
      if (!((itemNames != null) && (itemValues != null) && (participantCoupon != null))) {
        throw {
          msg: "Required arguments for 'SetItemValues' are 'itemNames','itemValues' and 'participantCoupon'"
        };
      }
      if (!this._.any(this.participants, function(p) {
        return p.coupon === participantCoupon;
      })) {
        throw {
          msg: "No such participant '" + participantCoupon + "'"
        };
      }
      _fn = function(i) {
        logger.info("updating " + itemNames[i] + " with " + itemValues[i]);
        return items[itemNames[i]] = itemValues[i];
      };
      for (i = _i = 0, _ref1 = itemNames.length - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
        _fn(i);
      }
      this.emit("updated", this, itemNames, itemValues, participantCoupon);
      if (contextCoupon == null) {
        if (typeof this.notifier === "function") {
          this.notifier({
            target: {
              "interface": "ContextParticipant",
              method: "ContextChangesAccepted"
            },
            args: {
              contextCoupon: ""
            }
          });
        }
        _ref2 = this.participants;
        for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
          participant = _ref2[_j];
          if (participant.coupon !== participantCoupon) {
            participant.ContextChangesAccepted("");
          }
        }
      }
      return items;
    };

    return ContextData;

  })(events.EventEmitter);

  exports.ContextData = ContextData;

}).call(this);
