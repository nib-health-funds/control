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
  },

  /**
   * Initialise the view
   */
  init: function() {
    this.valid        = null;
    this.messageType  = '';
    this.messageText  = '';

    //set the initial state of the feedback container
    this.feedbackContainer = this.feedbackContainer || this.feedbackMessage;
    this.feedbackContainer.style.transition = 'none'; //disable transitions
    this.feedbackContainer.style.height = '0';
    this.feedbackContainer.style.transition = ''; //enable transitions

  },

  /**
   * Get whether the control is valid
   * @returns {Boolean}
   */
  isValid: function() {
    return this.valid;
  },

  /**
   * Set whether the control is valid
   * @param   {Boolean} valid
   * @returns {ControlView}
   */
  setValid: function(valid) {
    valid = valid === null ? null : Boolean(valid);

    //TODO: check the state is a valid class name e.g. does not contain spaces or other cruft?

    //remove the previous state
    if (this.valid !== null) {
      this.el.classList.remove('is-'+(this.valid ? 'valid' : 'invalid'));
    }

    //add the new state
    if (valid !== null) {
      this.el.classList.add('is-'+(valid ? 'valid' : 'invalid'));
    }

    this.valid = valid;
    return this;
  },

  /**
   * Clear the control message
   * @returns {String}
   */
  clearMessage: function() {

    //TODO: need to set the type on the message container if no feedback container

    //unset the message type
    this.feedbackContainer.classList.remove('is-'+this.messageType);

    //unset the message text
    this.feedbackMessage.innerHTML = '';

    this.messageType = '';
    this.messageText = '';

    return this;
  },

  /**
   * Get the message type
   * @returns {String}
   */
  getMessageType: function() {
    return this.messageType;
  },

  /**
   * Get the message text
   * @returns {String}
   */
  getMessageText: function() {
    return this.messageText;
  },

  /**
   * Set the control message
   * @param   {String} type
   * @param   {String} text
   * @returns {ControlView}
   */
  setMessage: function(type, text) {

    //TODO: check the state is a valid class name e.g. does not contain spaces or other cruft?

    //unset the message type
    if (this.messageType.length > 0) {
      this.feedbackContainer.classList.remove('is-'+this.messageType);
    }

    //set the message type
    this.feedbackContainer.classList.add('is-'+type);

    //set the message text
    this.feedbackMessage.innerHTML = text;

    this.messageType = type;
    this.messageText = text;

    return this;
  },

  /**
   * Hide the message
   * @returns {ControlView}
   */
  hideMessage: function() {
    var self = this;

    //try the transition again later
    if (this._transitioning) {
      setTimeout(self.hideMessage.bind(this), 100);
      return this;
    }

    //transition the message
    self._transitioning = true;
    transition(this.feedbackContainer, 'height', '0px', function() {
      self._transitioning = false;
      self.emit('message:hidden');
    });

    return this;
  },

  /**
   * Show the message
   * @returns {ControlView}
   */
  showMessage: function() {
    var self = this;

    //try the transition again later
    if (this._transitioning) {
      setTimeout(self.showMessage.bind(this), 100);
      return this;
    }

    //transition the message
    self._transitioning = true;
    transition(this.feedbackContainer, 'height', 'auto', function() {
      self._transitioning = false;
      self.emit('message:shown');
    });

    return this;
  }

});

ViewMixin.visibility(ControlView.prototype);

module.exports = ControlView;