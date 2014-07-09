var events = require('input-event');

module.exports = require('view').extend({

  events: {

    /**
     * Let the presenter know the value has changed
     * @event
     */
    'blur': 'emit:blur'

  },

  /**
   * Initialise the view
   */
  init: function() {
    var self = this;

    //Emit the change event
    if (this.el.type === 'text' || this.el.type === 'password') {
      events.bind(this.el, function() {
        self.emit('change');
      });
    }

  },

  /**
   * Gets the value
   * @returns {string}
   */
  getValue: function() {
    return this.el.value;
  },

  /**
   * Sets the value
   * @param   {string} value
   * @returns {Input}
   */
  setValue: function(value) {
    this.el.value = value;
    return this;
  },

  /**
   * Get whether the view is enabled
   * @returns {boolean}
   */
  isDisabled: function() {
    return this.el.disabled;
  },

  /**
   * Set whether the view is disabled
   * @param   {bool} disabled
   * @returns {exports}
   */
  setDisabled: function(disabled) {
    this.el.disabled = disabled;
    return this;
  },

  /**
   * Focus the input
   * @returns {exports}
   */
  focus: function() {
    this.el.focus();
    return this;
  }

});