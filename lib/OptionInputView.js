module.exports = require('view').extend({

  events: {

    /**
     * Let the presenter know the value has changed
     * @event
     */
    'blur .js-option':  'onBlur',
    'click .js-option': 'onClick'

  },

  /**
   * Get all the option elements
   */
  elements: {
    '.js-option' : 'all:options'
  },

  /**
   * Gets the value
   * @returns {string}
   */
  getValue: function() {
    var property = this.el.nodeName === 'SELECT' ? 'selected' : 'checked';
    for(var i=0; i<this.options.length; i++){
      if(this.options[i][property]){
        return this.options[i].value;
      }
    }
    return '';
  },

  /**
   * Sets the value
   * @param   {string} value
   * @returns {Input}
   */
  setValue: function(value) {
    var property = this.el.nodeName === 'SELECT' ? 'selected' : 'checked';
    for(var i = 0; i< this.options.length; i++){
      if(this.options[i].value === value) {
        this.options[i][property] = true;
      }
    }
    return this;
  },

  /**
   * Handle the blur event - only fire if we don't have a click event firing immediately after 
   *  to prevent firing the validate event twice in such quick succession
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
  }

});
