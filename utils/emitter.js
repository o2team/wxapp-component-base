/**
 * Simple event emitter based on component/emitter
 *
 * @constructor
 * @param {Object} ctx - the context to call listeners with
 */
function Emitter(ctx) {
    this._ctx = ctx || this; 
}

var p = Emitter.prototype;

p.on = function(event, fn) {
    if (typeof fn !== "function") {
        console.error('fn must be a function')
        return;
    }

    this._cbs = this._cbs || {};
    if (this._cbs[event] && this._cbs[event].length > 0)
        console.warn('重复定义事件', event);
    (this._cbs[event] || (this._cbs[event] = [])).push(fn);
    return this;
};

p.once = function(event, fn) {
    if (typeof fn !== "function") {
        console.error('fn must be a function')
        return;
    }

    var self = this;
    this._cbs = this._cbs || {};

    function on() {
        self.off(event, on);
        fn.apply(this, arguments);
    }

    on.fn = fn;
    this.on(event, on);
    return this;
};

p.off = function(event, fn) {
    this._cbs = this._cbs || {};

    if (!arguments.length) {
        this._cbs = {};
        return this;
    }

    var callbacks = this._cbs[event];
    if (!callbacks) return this;

    if (arguments.length === 1) {
        delete this._cbs[event];
        return this;
    }

    var cb;
    for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
            callbacks.splice(i, 1);
            break;
        }
    }
    return this;
};

p.emit = function(event) {
    this._cbs = this._cbs || {};
    var args = [].slice.call(arguments);
    var callbacks = this._cbs[event];

    if (callbacks) {
        callbacks = callbacks.slice(0);
        args.shift();
        for (var i = 0, len = callbacks.length; i < len; i++) {
            try {
                callbacks[i].apply(this._ctx, args);
            } catch(err) {
                console.error(err);
            }
        }
    }

    return this;
}

module.exports = Emitter;