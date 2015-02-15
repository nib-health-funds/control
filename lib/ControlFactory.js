var FilterChain     = require('filter-chain');
var ValidatorChain  = require('validator-chain');

/**
 * A control factor
 * @constructor
 * @param   {Object} options
 */
function ControlFactory(options) {
  this._plugins = [];
}

ControlFactory.ControlPresenter               = require('./ControlPresenter');
ControlFactory.ControlView                    = require('./ControlView');
ControlFactory.InputView                      = require('./InputView');
ControlFactory.OptionInputView                = require('./OptionInputView');
ControlFactory.MultiOptionInputView           = require('./MultiOptionInputView');

ControlFactory.prototype.ControlPresenter     = ControlFactory.ControlPresenter;
ControlFactory.prototype.ControlView          = ControlFactory.ControlView;
ControlFactory.prototype.InputView            = ControlFactory.InputView;
ControlFactory.prototype.OptionInputView      = ControlFactory.OptionInputView;
ControlFactory.prototype.MultiOptionInputView = ControlFactory.MultiOptionInputView;

/**
 * Add a plugin which is `.use()`d on each control that is created
 * @param   {function(control)) plugin
 * @returns {ControlFactory}
 */
ControlFactory.prototype.plugin = function(plugin) {
    this._plugins.push(plugin);
    return this;
};

/**
 * Create an input view with the specified options
 *  - can take an existing input view OR
 *  - an input element and type
 * @param   {Object}    options
 * @param   {string}    [options.el]          The control element
 * @param   {string}    [options.type]        The input type
 * @param   {InputView} [options.inputView]   The input view
 */
ControlFactory.prototype.createInputView = function(options) {
  var inputView;

  if (options.inputView) {
    inputView = options.inputView;
  } else {

    var
      inputEl = options.el.querySelector('.js-input')
    ;

    if (inputEl === null) { //TODO: maybe only display the msg if the element is null but not undefined (i.e. intentionally left blank)
      //throw new Error('Input element not found within the control element of the control named "'+options.name+'".');
    }

    switch (options.type) {

      case 'option':
        inputView = new this.OptionInputView({
          el: inputEl
        });
        break;

      case 'multi-option':
        inputView = new this.MultiOptionInputView({
          el: inputEl
        });
        break;

      default:
        inputView = new this.InputView({
          el: inputEl
        });

    }

  }

  return inputView;
};

/**
 * Create a control
 * @param   {Object} options
 * @returns {ControlPresenter}
 */
ControlFactory.prototype.create = function(options) {
  var
    name  = options.name,
    event = typeof(options.event) === 'undefined' ? ['blur'] : options.event, //default to the blur event if node is specified
    delay = options.delay
  ;

  // === create the views ===

  var inputView   = this.createInputView(options);

  var controlView = new this.ControlView({
    el: options.el
  });

  // === create the filter and validator ===

  var filters         = options.filters || [];
  var filterChain     = new FilterChain(filters);

  var validators      = options.validators || [];
  var validatorChain  = new ValidatorChain();

  //set whether the control value must be validated when the value is empty
  if (options.optional) {
    validatorChain.optional(options.optional);
  }

  //add the validators
  for (var i=0; i<validators.length; ++i) {
    validatorChain.add.apply(validatorChain, Array.isArray(validators[i]) ? validators[i] : [validators[i]]);
  }

  // === create the control ===

  var control = new this.ControlPresenter({
    name:           name,
    event:          event,
    inputView:      inputView,
    controlView:    controlView,
    filterChain:    filterChain,
    validatorChain: validatorChain,
    delay:          delay
  });

  // === apply the "default/global" plugins ===

  for (var i=0; i<this._plugins.length; ++i) {
    control.use(this._plugins[i]);
  }

  return control;
};

module.exports = ControlFactory;