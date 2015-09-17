import Ember from 'ember';
import { build } from '../build';
import Descriptor from '../descriptor';
import { qualifySelector } from '../helpers';

function action(target, key, options, ...args){
  let selector = qualifySelector(options.scope || target.scope, options.selector);

  let response = options.userDefinedFunction(selector, options);

  return convertIf(response, $.isPlainObject, response => build(response))
    || convertIf(response, $.isFunction, response => response(...args))
    || response;

  if ($.isPlainObject(response)) {
    return build(response);
  } else if ($.isFunction(response)) {
    return response(...args);
  } else {
    return response;
  }
}

export function customHelper(userDefinedFunction) {
  return function(selector, options = {}) {
    options.selector = selector;
    options.userDefinedFunction = userDefinedFunction;

    return new Descriptor(action, options);
  }
};
