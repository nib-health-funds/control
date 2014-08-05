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
    this.state        = '';
    this.messageType  = '';
    this.messageText  = '';

    //set the initial state of the feedback container
    if (this.feedbackContainer) {
      this.feedbackContainer.style.transition = 'none'; //disable transitions
      this.feedbackContainer.style.height = '0';
      this.feedbackContainer.style.transition = ''; //enable transitions
    }
  },

  /**
   * Get the state of the control
   * @returns {String|null}
   */
  getState: function() {
    return this.state;
  },

  /**
   * Set the state of the control
   * @returns {ControlView}
   */
  setState: function(state) {
    state = String(state);

    //TODO: check the state is a valid class name e.g. does not contain spaces or other cruft?

    //remove the previous state
    if (this.state.length > 0) {
      this.el.classList.remove('is-'+this.state);
    }

    //add the new state
    if (state.length > 0) {
      this.el.classList.add('is-'+state);
    }

    this.state = state;
    return this;
  },

  /**
   * Clear the control message
   * @returns {String}
   */
  clearMessage: function() {

    //TODO: need to set the type on the message container if no feedback container

    //unset the message type
    if (this.feedbackContainer) {
      this.feedbackContainer.classList.remove('is-'+this.messageType);
    }

    //unset the message text
    if (typeof this.feedbackMessage.textContent !== 'undefined') {
      this.feedbackMessage.innerHTML = '';
    }

    this.messageType = '';
    this.messageText = '';

    return this;
  },

  /**
   * Get the control message
   * @returns {String}
   */
  getMessage: function() {
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

    //TODO: need to set the type on the message container if no feedback container

    if (this.feedbackContainer) {

      //unset the message type
      if (this.messageType.length > 0) {
        this.feedbackContainer.classList.remove('is-'+this.messageType);
      }

      //set the message type
      this.feedbackContainer.classList.add('is-'+type);

    }

    //set the message text
    if (typeof this.feedbackMessage.textContent !== 'undefined') {
      this.feedbackMessage.innerHTML = text;
    }

    this.messageType = type;
    this.messageText = text;

    return this;
  },

  /**
   * Hide the message
   * @returns {ControlView}
   */
  hideMessage: function() {
    if (this.feedbackContainer) {
      var self = this;
      transition(this.feedbackContainer, 'height', '0px', function() {
        self.emit('message:hidden');
      });
    } else {
      this.emit('message:hidden');
    }
    return this;
  },

  /**
   * Show the message
   * @returns {ControlView}
   */
  showMessage: function() {
    if (this.feedbackContainer) {
      var self = this;
      transition(this.feedbackContainer, 'height', 'auto', function() {
        self.emit('message:shown');
      });
    } else {
      this.emit('message:shown');
    }
    return this;
  }

});

ViewMixin.visibility(ControlView.prototype);

module.exports = ControlView;