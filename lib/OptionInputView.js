/**
 * An input view for checkbox and radio inputs
 * @type {OptionInputView}
 */
module.exports = require('view').extend({

  events: {

    /**
     * Let the presenter know the value has changed
     * @event
     */
    'blur .js-option':  'onBlur',
    'click .js-option': 'onClick',
    'click .js-option-label': 'onClickLabel'

  },

  /**
   * Get all the option elements
   */
  elements: {
    '.js-option' : 'all:options'
  },

  /**
   * Initialise the view
   */
  init: function() {
    var self = this;

    // === handle IE8 which doesn't trigger change until blur ===

    this.values = [];

    /**
     * Handle change events
     */
    function change(event) {
      var index = Array.prototype.indexOf.call(self.options, event.target);

      //emit the change event if the value has changed since last time
      if (self.values[index] !== self.options[index].checked) {
        self.emit('change');
      }

      //update the value cache
      for(var i=0; i<self.options.length; ++i){
        self.values[i] = self.options[i].checked;
      }

    }

    //init the value cache and register listeners
    for(var i=0; i<this.options.length; ++i){
      this.values[i] = this.options[i].checked;
      this.options[i].addEventListener('click', change);
      this.options[i].addEventListener('change', change);
    }

  },

  /**
   * Gets the value
   * @returns {String}
   */
  getValue: function() {
    for(var i=0; i<this.options.length; ++i){
      if(this.options[i].checked){
        return this.options[i].value;
      }
    }
    return '';
  },

  /**
   * Sets the value
   * @param   {String} value
   * @returns {exports}
   */
  setValue: function(value) {
    for(var i = 0; i< this.options.length; ++i){
      if(this.options[i].value === value) {
        this.options[i].checked = true;
      }
    }
    return this;
  },

  /**
   * Focus the input (either the selected option or otherwise the first option)
   * @returns {exports}
   */
  focus: function() {
    if (this.options.length > 0) {
      for(var i = 0; i< this.options.length; ++i){
        if(this.options[i].checked) {
          this.options[i].focus();
          return this;
        }
      }
      this.options[0].focus();
    }
    return this;
  },

  /**
   * Handle the blur event - only fire if we don't have a click event firing immediately after
   *  to prevent firing the validate event twice in such quick succession when a radio/checkbox *label* is clicked
   */
  onBlur: function() {
    var self        = this;
    self.clicked    = false;
    setTimeout(function() {
      if (!self.clicked) {
        self.emit('blur');
      }
    }, 200);
  },

  /**
   * Handle the click event
   */
  onClick: function() {
    this.clicked = true;
    this.emit('click');
  },

  /**
   * Handle the click label event
   */
  onClickLabel: function(event) {
    this.clicked = true;
    this.emit('click');
    var inputElem = event.delegateTarget.querySelector('.js-option');
    inputElem.click();
  }
});
