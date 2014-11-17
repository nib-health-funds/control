
/**
 * An input view for multiple selection
 * @type {MultiSelectInputView}
 */
module.exports = require('view').extend({

  /**
   * Hookup all the option elements
   */
  events: {
    'blur .js-option-input':  'emit:blur',
    'click .js-option-input': 'onClick'
  },

  /**
   * Get all the option elements
   */
  elements: {
    '.js-option-input': 'all:inputs',
    '.js-option-label': 'all:labels'
  },

  /**
   * Get the selected values
   * @returns {Array<String>}
   */
  getValue: function() {
    var values = [];
    for (var i=0; i<this.inputs.length; ++i) {
      if (this.inputs[i].checked) {
        values.push(this.inputs[i].value);
      }
    }
    return values;
  },

  /**
   * Set the selected values
   * @param   {Array<String>} values
   * @returns {MultiSelectInputView}
   */
  setValue: function(values) {
    for (var i=0; i<this.inputs.length; ++i) {

      var input = this.inputs[i];
      var label = this.labels[i];

      if (values.indexOf(input.value) === -1) {
        input.checked = false;
        label.classList.remove('is-selected');
      } else {
        input.checked = true;
        label.classList.add('is-selected');
      }

    }
    return this;
  },

  /**
   * Handle the change event
   */
  onClick: function(event) {

    var input = event.target;
    var index = Array.prototype.indexOf.call(this.inputs, input);

    if (index !== -1) {
      if (input.checked) {
        this.labels[index].classList.add('is-selected');
      } else {
        this.labels[index].classList.remove('is-selected');
      }
    }

    this.emit('change');
  }


});
