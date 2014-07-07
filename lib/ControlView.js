var transition  = require('transition-auto');
var ViewMixin   = require('view-mixins');
/**
 * ControlView
 * @constructor
 */
var ControlView = require('view').extend({
  elements: {
    '.js-feedback-container': 'feedbackContainer',
    '.js-feedback-message':   'feedbackMessage'
  }
});

ViewMixin.visibility(ControlView.prototype);

/**
 * Gets the state of the control
 * @returns {string}
 */
ControlView.prototype.getState = function() {

  if (this.el.classList.contains('is-valid')) {
    return 'valid';
  }

  if (this.el.classList.contains('is-invalid')) {
    return 'invalid';
  }

};

/**
 * Sets the state of the control
 * @returns {ControlView}
 */
ControlView.prototype.setState = function(state) {

  if (this.feedbackContainer) {
    if (state === 'valid') {
      transition(this.feedbackContainer, 'height', '0');
      this.el.classList.remove('is-invalid');
      this.el.classList.add('is-valid');
    } else if (state === 'invalid') {
      transition(this.feedbackContainer, 'height', 'auto');
      this.el.classList.remove('is-valid');
      this.el.classList.add('is-invalid');
    } else {
      transition(this.feedbackContainer, 'height', '0');
      this.el.classList.remove('is-valid');
      this.el.classList.remove('is-invalid');
    }
  }

  return this;
};

/**
 * Gets the state of the control
 * @returns {string}
 */
ControlView.prototype.getMessage = function() {
  if (typeof this.feedbackMessage.textContent !== 'undefined') {
    return this.feedbackMessage.textContent;
  } else {
    return this.feedbackMessage.innerText; //IE8
  }
};

/**
 * Sets the state of the control
 * @param   {string} msg
 * @returns {ControlView}
 */
ControlView.prototype.setMessage = function(msg) {
  if (typeof this.feedbackMessage.textContent !== 'undefined') {
    this.feedbackMessage.textContent = msg;
  } else {
    this.feedbackMessage.innerText = msg; //IE8
  }
  return this;
};

module.exports = ControlView;