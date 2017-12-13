import Vue from 'vue';

Vue.config.productionTip = false;

// TODO: Can I use ES6?
// TODO: Linter should run on this.

var localStorage = (function() {
    var store = {};

    return {
        getItem: function(key) {
            return store[key] || null;
        },
        setItem: function(key, value) {
            store[key] = value.toString();
        },
        clear: function() {
            store = {};
        },
        removeItem: function(key) {
          delete store[key];
        }
    };

})();

Object.defineProperty(window, 'localStorage', {
     value: localStorage
});
