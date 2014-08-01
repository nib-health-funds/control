var assert           = require('assert');
var ControlPresenter = require('control/lib/ControlPresenter.js');

var presenter;

describe('ControlPresenter', function() {

  beforeEach(function(){
    presenter = new ControlPresenter({

      events: {},

      inputView: {
        on: function () {
        },
        getValue: function() {
          return 'crapola';
        }
      },

      filterChain: {
        filter: function (value, callback) {
          callback(value);
        }
      },

      validatorChain: {
        valid: false,
        context: null,
        validate: function (value, callback) {
          callback(null, this.valid, this.context);
        }
      },

      controlView: {

        messageType: '',
        messageText: '',
        messageVisible: null,

        once: function(event, callback) {
          callback();
          return this;
        },

        hideMessage: function() {
          this.messageVisible = false;
          return this;
        },

        showMessage: function() {
          this.messageVisible = true;
          return this;
        },

        getState: function() {
          return this.state;
        },

        setState: function(state) {
          this.state = state;
          return this;
        },

        clearMessage: function() {
          this.messageType = '';
          this.messageText = '';
          return this;
        },

        setMessage: function(type, text) {
          this.messageType = type;
          this.messageText = text;
          return this;
        }

      }

    });
  });

  it('should hide the message when transitioning from invalid to valid', function(done) {
    presenter.validatorChain.valid    = true;
    presenter.controlView.state       = 'invalid';

    //check the state
    //this event handler will be registered before the presenter registers its own, hence the check won't work -- need event priorities?
//    presenter.controlView.once('message:hidden', function() {
//      assert.equal('valid', presenter.controlView.getState());
//    });

    presenter.on('validate', function() {

      //check the message visibility
      assert(!this.controlView.messageVisible);

      //check the message type
      assert.equal('', this.controlView.messageType);
      assert.equal('', this.controlView.messageText);

      done();
    });

    presenter.validate();
  });

  it('should not hide the message when transitioning from valid to valid with a message set', function(done) {
    presenter.validatorChain.valid        = true;
    presenter.controlView.state           = 'valid';
    presenter.controlView.messageVisible  = true;
    presenter.controlView.messageType     = 'info';
    presenter.controlView.messageText     = 'Looks good bro!';

    presenter.on('validate', function() {

      //check the state
      assert.equal('valid', this.controlView.getState());

      //check the message visibility
      assert(this.controlView.messageVisible);

      //check the message type
      assert.equal('info', this.controlView.messageType);
      assert.equal('Looks good bro!', this.controlView.messageText);

      done();
    });

    presenter.validate();
  });

  it('should show the message when transitioning from valid to invalid', function(done) {
    presenter.validatorChain.valid    = false;
    presenter.validatorChain.context  = 'Error!';
    presenter.controlView.state       = 'valid';

    presenter.on('validate', function() {

      //check the state
      assert.equal('invalid', this.controlView.getState());

      //check the message visibility
      assert(this.controlView.messageVisible);

      //check the message type
      assert.equal('error', this.controlView.messageType);
      assert.equal('Error!', this.controlView.messageText);

      done();
    });

    presenter.validate();
  });

});