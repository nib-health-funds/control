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

ControlFactory.prototype.ControlPresenter     = require('./ControlPresenter');
ControlFactory.prototype.ControlView          = require('./ControlView');
ControlFactory.prototype.InputView            = require('./InputView');
ControlFactory.prototype.OptionInputView      = require('./OptionInputView');
ControlFactory.prototype.MultiOptionInputView = require('./MultiOptionInputView');

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
 * Create a control
 * @param   {Object} options
 * @returns {ControlPresenter}
 */
ControlFactory.prototype.create = function(options) {

  if (typeof options.events !== 'undefined' && !Array.isArray(options.events)) {
    options.events = [options.events];
  }

  // === create the input view ===

  var
    inputView,
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

  // === create the validator ===

  var validators      = options.validators || [];
  var validatorChain  = new ValidatorChain();
  if (options.optional) {
    validatorChain.optional(options.optional);
  }
  for (var i=0; i<validators.length; ++i) {
    validatorChain.add.apply(validatorChain, Array.isArray(validators[i]) ? validators[i] : [validators[i]]);
  }

  // === create the control ===

  var control = new this.ControlPresenter({
    name:           options.name,
    event:          typeof(options.event) === 'undefined' ? ['blur'] : options.event,
    inputView:      inputView,
    controlView:    new this.ControlView({
      el: options.el
    }),
    filterChain:    new FilterChain(options.filters || []),
    validatorChain: validatorChain,
    delay:          options.delay
  });

  // === apply the "default/global" plugins ===

  for (var i=0; i<this._plugins.length; ++i) {
    control.use(this._plugins[i]);
  }

  return control;
};

module.exports = ControlFactory;