var FilterChain     = require('filter-chain');
var ValidatorChain  = require('validator');

module.exports = {

  ControlPresenter: require('./lib/ControlPresenter'),
  ControlView:      require('./lib/ControlView'),
  TextInputView:    require('./lib/TextInputView'),
  OptionInputView:  require('./lib/OptionInputView'),

  /**
   * Create a new control
   * @param   {Object} options
   * @returns {exports.ControlPresenter}
   */
  create: function(options) {

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

    if (options.type === 'option') {

      //create an option input
      inputView = new this.OptionInputView({
        el: inputEl
      });

    } else {

      //create a text input
      inputView = new this.TextInputView({
        el: inputEl
      });

    }

    // === create the validator ===

    var validators      = options.validators || [];
    var validatorChain  = new ValidatorChain();
    for (var i=0; i<validators.length; ++i) {
      validatorChain.rule.apply(validatorChain, Array.isArray(validators[i]) ? validators[i] : [validators[i]]);
    }

    // === create the control ===

    return new this.ControlPresenter({
      name:           options.name,
      model:          options.model,
      modelProperty:  options.modelProperty,
      event:          options.event || ['blur'],
      inputView:      inputView,
      controlView:    new this.ControlView({
        el: options.el
      }),
      filterChain:    new FilterChain(options.filters || []),
      validatorChain: validatorChain,
      delay:          options.delay
    });
  }

};