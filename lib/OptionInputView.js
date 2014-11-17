
/**
 * An input view for checkbox and radio groups allowing a single value to be selected
 * @type {OptionInputView}
 */
module.exports = require('view').extend({

  events: {

    /**
     * Let the presenter know the value has changed
     * @event
     */
    'blur .js-option-input':  'onBlur',
    'click .js-option-input': 'onClick',
    'click .js-option-label': 'onClickLabel'

  },

  /**
   * Get all the option elements
   */
  elements: {
    '.js-option-input': 'all:inputs',
    '.js-option-label': 'all:labels'
  },

  /**
   * Initialise the view
   */
  init: function() {
    var self = this;
    this.disabled = false;

    // === handle IE8 which doesn't trigger change until blur !! Remove click hackery when IE8 dies - AGR table in join may break but this behaviour should have its own view !! ===

    this.checked = [];

    /**
     * Handle change events
     */
    function change(event) {
      var index = Array.prototype.indexOf.call(self.inputs, event.target);

      //emit the change event if the value has changed since last time
      if (self.checked[index] !== self.inputs[index].checked) {
        self.emit('change');
      }

      //update the value cache
      for(var i=0; i<self.inputs.length; ++i){
        self.checked[i] = self.inputs[i].checked;
      }

    }

    //init the value cache and register listeners
    for(var i=0; i<this.inputs.length; ++i){
      this.checked[i] = this.inputs[i].checked;
      this.inputs[i].addEventListener('click', change);
      this.inputs[i].addEventListener('change', change);
    }

    //add the selected class to the selected input
    this.select(this.getValue());
    this.on('change', function() {
      this.select(this.getValue());
    });

  },

  /**
   * Gets the value
   * @returns {String}
   */
  getValue: function() {
    for(var i=0; i<this.inputs.length; ++i){
      if(this.inputs[i].checked){
        return this.inputs[i].value;
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
    value = String(value);
    for(var i = 0; i< this.inputs.length; ++i){
      if(this.inputs[i].value === value) {
        this.inputs[i].checked = true;
      } else {
        this.inputs[i].checked = false;
      }
    }
    this.select(value);
    return this;
  },

  /**
   * Get whether the view is enabled
   * @signature `observe.isDisabled()`
   * @returns {Boolean}
   *
   * Get whether an option is enabled
   * @signature `observe.isDisabled(value)`
   * @param   {String} value
   * @returns {Boolean}
   */
  isDisabled: function() {

    if(arguments.length === 1){

      //get whether the option is disabled

      var value = String(arguments[0]);

      for(var i = 0; i< this.inputs.length; ++i){
        if (this.inputs[i].value === value) {
          return this.inputs[i].disabled
        }
      }
      throw new Error('Option "'+value+"' not found.");

    } else {

      //get whether all the inputs are disabled
      for(var i = 0; i< this.inputs.length; ++i){
        if (!this.inputs[i].disabled) {
          return false;
        }
      }
      return true;
    }

    return false;
  },

  /**
   * Set whether the view is disabled
   * @signature `View.setDisabled(disabled)`
   * @param   {Boolean} disabled
   * @returns {exports}
   *
   * Set whether an option is disabled
   * @signature `View.setDisabled(value, disabled)`
   * @param   {String}  value
   * @param   {Boolean} disabled
   * @returns {exports}
   */
  setDisabled: function(disabled) {
    if(arguments.length === 2){

      //set whether the option is disabled

      var value = String(arguments[0]);
      disabled = arguments[1];

      for (var i = 0; i < this.inputs.length; ++i) {
        if (this.inputs[i].value === value) {
          this.inputs[i].disabled = disabled;
          if (this.labels[i]) {
            if (disabled) {
              this.labels[i].classList.add('is-disabled');
            } else {
              this.labels[i].classList.remove('is-disabled');
            }
          }
          return this;
        }
      }
      throw new Error('Option "'+value+"' not found.");

    } else {

      this.disabled = disabled;

      //set whether all the inputs are disabled
      for (var i = 0; i < this.inputs.length; ++i) {
        this.inputs[i].disabled = disabled;
      }

    }

    return this;
  },

  /**
   * Focus the input (either the selected option or otherwise the first option)
   * @returns {exports}
   */
  focus: function() {
    if (this.inputs.length > 0) {
      for(var i = 0; i< this.inputs.length; ++i){
        if(this.inputs[i].checked) {
          this.inputs[i].focus();
          return this;
        }
      }
      this.inputs[0].focus();
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
  onClick: function(event) {
    this.clicked      = true;
    this.clickBubbled = true;
    this.emit('click', event);
  },

  /**
   * Handle the click label event
   */
  onClickLabel: function(event) {

    //don't update the value... again
    if (this.clickBubbled) {
      this.clickBubbled = false;
      return;
    }

    var label = event.delegateTarget;
    var input = label.querySelector('.js-option-input');

    if (!input.disabled && label.tagName !== 'LABEL') {

      //select or toggle the element
      if (input.type === 'checkbox') {
        input.checked = !input.checked; //toggle a checkbox
      } else {
        input.checked = true;
      }

      this.clicked = true;
      this.emit('click', event);
      this.emit('change', event);
    }
  },

  /**
   * Add the is-selected class to the selected option and remove it from the other inputs
   * @param   {String} value
   * @returns {exports}
   */
  select: function(value) {
    value = String(value);
    for(var i = 0; i< this.inputs.length; ++i){
      if(this.inputs[i].value === value) {
        this.labels[i].classList.add('is-selected');
      } else {
        this.labels[i].classList.remove('is-selected');
      }
    }
    return this;
  }

});
