var emitter = require('emitter');

/**
 * A control presenter
 *
 * @constructor
 *
 * @param   {Object}            options                     The options
 * @param   {String}            options.name                The name of the control used for retrieving the control from a collection. e.g. `first-name`.
 *
 * @param   {Object}            options.event               The events emitted by the input view which should trigger validation.
 * @param   {Object}            options.inputView           A view that abstracts the input element. It emits events and provides a getter and setter for the input value.
 * @param   {Object}            options.controlView         A view that abstracts the control state.
 *
 * @param   {Object}            options.filterChain         A chain of filters.
 * @param   {Object}            options.validatorChain      A chain of validators.
 *
 * @param   {Number}            [options.delay]   Delay for X seconds after the change event before performing validation - useful when validate is called in quick succession
 */
function ControlPresenter(options) {
  var self = this;

  /**
   * Whether the control input value is valid
   * @type {Boolean}
   */
  this.valid = false;

  /**
   * Whether the control is currently being validated - used to block validation starting again
   * @type {Boolean}
   */
  this.validating = false;

  /**
   * The delay timeout
   * @type {*}
   */
  this.delayTimeout   = null;

  //cache options
  this.name           = options.name;
  this.events         = options.event && typeof(options.event.length) !== 'undefined' ? options.event : [options.event];
  this.inputView      = options.inputView;
  this.controlView    = options.controlView;
  this.filterChain    = options.filterChain;
  this.validatorChain = options.validatorChain;
  this.delay          = options.delay;

  // === bind events ===

  //listen for events which must trigger `validate`
  for (var i=0; i<this.events.length; ++i) {
    this.inputView.on(this.events[i], this.onTrigger.bind(this));
  }

  //listen for events to proxy
  this.inputView.on('change', function() {
    self.emit('change'); //FIXME - only proxy the event when something is listening for it
  });
  this.inputView.on('click', function(e) {
    self.emit('click', e); //FIXME - only proxy the event when something is listening for it
  });
}
emitter(ControlPresenter.prototype);

/**
 * Get the control name
 * @returns {String}
 */
ControlPresenter.prototype.getName = function() {
  return this.name;
};

/**
 * Get the control value
 * @returns {String}
 */
ControlPresenter.prototype.getValue = function() {
  return this.inputView.getValue();
};

/**
 * Set the control value
 * @param   {String} value
 * @returns {ControlPresenter}
 */
ControlPresenter.prototype.setValue = function(value) {
  this.inputView.setValue(value);
  return this;
};

/**
 * Check whether the control has previously passed validation
 * @returns {Boolean}
 */
ControlPresenter.prototype.isValid = function() {
  return this.valid;
};

/**
 * Focus the control input
 * @returns {ControlPresenter}
 */
ControlPresenter.prototype.focus = function() {
  this.inputView.focus();
  return this;
};

/**
 * Clear the value and validation state
 * @returns {ControlPresenter}
 */
ControlPresenter.prototype.clear = function() {
  this.valid = false;
  this.inputView.setValue('');
  this.controlView.setValid(null);
  return this;
};

/**
 * Validate the control and update the state
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
  self.filterChain.filter(theValue, function(theFilteredValue) {

    //validate the value
    self.validatorChain.validate(theFilteredValue, function (err, valid, context) {

      //set the state
      self.valid = valid;
      self.controlView.setValid(valid);

      if (valid) {

        //clear any `error` messages
        if (self.controlView.getMessageType() === 'error') {
          self.controlView
            .once('message:hidden', function() {
              self.controlView.clearMessage();
            })
            .hideMessage()
          ;
        }

      } else {

        //set the state as `invalid` and add an `error` message
        var message = typeof context === 'function' ? context(theValue) : (context ? context : '');
        self.controlView
          .setMessage('error', message)
          .showMessage()
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
 * Apply a plugin
 * @param   {Function} plugin
 * @returns {ControlPresenter}
 */
ControlPresenter.prototype.use = function(plugin) {
  plugin(this);
  return this;
};

/**
 * Handle events which trigger validation
 * @private
 */
ControlPresenter.prototype.onTrigger = function() {

  if (this.validating === true) {
    return;
  }

  if (this.delay && this.delay !== 0) {
    window.clearTimeout(this.delayTimeout); //clear any previously queued validate events
    this.delayTimeout = window.setTimeout(this.validate.bind(this), this.delay);
  } else {
    this.validate();
  }

};

module.exports = ControlPresenter;