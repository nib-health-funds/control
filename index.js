var FilterChain     = require('filter-chain');
var ValidatorChain  = require('validator');

module.exports = {

  ControlPresenter: require('./lib/ControlPresenter'),
  ControlView:      require('./lib/ControlView'),
  TextInputView:    require('./lib/TextInputView'),
  OptionInputView:  require('./lib/OptionInputView'),

  /**
   * Create a new control
   * @param   {Object}      options             The options
   * @param   {HTMLElement} options.el          The control element
   * @param   {Object}      [options.model]     The control model
   */
  create: function(options) {

    // === create the input view ===

    var
      inputView,
      inputEl = options.el.querySelector('.js-input')
    ;

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

      name:         options.name,

      events:       options.events,

      inputView:    inputView,

      controlView:  new this.ControlView({
        el: options.el
      }),

      filterer:     new FilterChain(options.filters || []),

      validator:    validatorChain

    });
  }

};