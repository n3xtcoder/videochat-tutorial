import Vue from 'vue';

Vue.config.productionTip = false;

const localStorage = (function () { // eslint-disable-line func-names
  let store = {};
  return {
    getItem: key => store[key] || null,
    setItem(key, value) { store[key] = value.toString(); },
    clear() { store = {}; },
    removeItem(key) { delete store[key]; },
  };
}());

Object.defineProperty(window, 'localStorage', {
  value: localStorage,
});
