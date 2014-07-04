var emitter = require('emitter');

/**
 * Presenter
 * @constructor
 * @param   {Object}            options                     The options
 * @param   {String}            options.name                The control name e.g. `first-name`. Used for fetching the control from a collection
 *
 * @param   {Object}            options.event               The validation event(s)
 * @param   {Object}            options.inputView           An input view which abstracts the input element. It proxies the input events and provides access to the input value.
 * @param   {Object}            options.controlView         A control view which abstracts the UI.
 *
 * @param   {Object}            options.filterer
 * @param   {Object}            options.validator
 *
 * @param   {Object}            options.model
 * @param   {String|Function}   options.modelProperty
 *
 * @param   {Number}            [options.delay]   Delay for X seconds after the change event before performing validation - useful when validate is called in quick succession
 */
function ControlPresenter(options) {

  /**
   * Whether the control input value is valid
   * @type {boolean}
   */
  this.valid = false;

  /**
   * Whether the control is currently being validated - used to block validation starting again
   * @type {boolean}
   */
  this.validating = false;

  /**
   * The delay timeout
   * @type {*}
   */
  this.delayTimeout   = null;

  //cache options
  this.name           = options.name;
  this.model          = options.model;
  this.modelProperty  = options.modelProperty;
  this.inputView      = options.inputView;
  this.controlView    = options.controlView;
  this.filterer       = options.filterer;
  this.validator      = options.validator;

  this.delay          = options.delay;

  // === bind events ===

  options.events = options.events || ['blur'];

  if (Array.isArray(options.events)) {
    this.events = options.events;
  } else {
    this.events = [options.events];
  }

  this.bindEvents();

}
emitter(ControlPresenter.prototype);

/**
 * Bind to validation events
 * @private
 * @returns {ControlPresenter}
 */
ControlPresenter.prototype.bindEvents = function() {
  for (var i=0; i<this.events.length; ++i) {
    this.inputView.on(this.events[i], this.onTrigger.bind(this));
  }
  return this;
};

/**
 * Gets the control name
 * @returns {string}
 */
ControlPresenter.prototype.getName = function() {
  return this.name;
};

/**
 * Checks whether the control has previously passed validation
 * @returns {boolean}
 */
ControlPresenter.prototype.isValid = function() {
  return this.valid;
};

/**
 * Validates the control and updates the state
 * @returns   {ControlPresenter}
 */
ControlPresenter.prototype.validate = function() {
  var self = this;

  //don't validate if we're already validating
  if (self.validating === true) {
    return this;
  }
  self.validating = true;

  //get the value
  var theValue = this.inputView.getValue();

  //filter the value
  self.filterer.filter(theValue, function(theFilteredValue) {

    //validate the value
    self.validator.validate(theFilteredValue, function (err, valid, context) {
      self.valid = valid;
      if (valid) {

        //provide feedback to the user
        self.controlView
          .setState('valid')
          .setMessage('') //note: it is important to reset this after changing the state so the height doesn't get changed before the transition
        ;

        //update the model value
        if (typeof self.modelProperty === 'function') {
          self.modelProperty(theFilteredValue, self.model);
        } else if (typeof self.modelProperty === 'string') {
          self.model.set(self.modelProperty, theFilteredValue);
        }

      } else {

        //provide feedback to the user
        var message = typeof context === 'function' ? context(theValue) : (context ? context : '');
        self.controlView
          .setMessage(message)//note: it is important to set this before changing the state so the height gets changed before the transition
          .setState('invalid')
        ;

      }

      //we've finished validating
      self.validating = false;

      self.emit('validate', valid, theFilteredValue, self);

    });
  });

  return this;
};

/**
 * Handles events which trigger validation
 */
ControlPresenter.prototype.onTrigger = function() {

  if (this.validating === true) {
    return;
  }

  if (this.delay && this.delay !== 0) {
    window.clearTimeout(this.delayTimeout); //clear any previously queued validate events
    this.delayTimeout = window.setTimeout(this.validate.bind(self), this.delay);
  } else {
    this.validate();
  }

};

module.exports = ControlPresenter;