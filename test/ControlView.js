(function() {

  var assert = require('assert');
  var ControlView = require('../lib/ControlView.js');

  var view;

  describe('ControlView', function () {

    beforeEach(function () {

      var el = document.createElement('div');
      el.style.visibility = 'hidden';
      el.innerHTML = '<label>Your name:<input class="js-input" autofocus/></label><div class="js-feedback-container"><span class="js-feedback-message"></span></div></div>';

      view = new ControlView({
        el: el
      });

      document.body.appendChild(el);
    });

    afterEach(function () {
      document.body.removeChild(view.el);
    });

    it('gets the state', function () {

      assert.equal(null, view.isValid());
      view.setValid(false);
      assert(!view.isValid());
      view.setValid(true);
      assert(view.isValid());
      view.setValid(null);
      assert.equal(null, view.isValid());

    });

    it('sets the state', function () {

      assert.equal('', view.el.className);
      view.setValid(false);
      assert.equal('is-invalid', view.el.className);
      view.setValid(true);
      assert.equal('is-valid', view.el.className);
      view.setValid(null);
      assert(!view.el.classList.contains('is-valid'));
      assert(!view.el.classList.contains('is-invalid'));

    });

    it('sets the message', function () {

      var container = view.el.querySelector('.js-feedback-container');
      var message = view.el.querySelector('.js-feedback-message');

      assert.equal('js-feedback-container', container.className);
      assert.equal('', message.textContent);

      view.setMessage('error', 'Need to enter your name!');

      assert.equal('js-feedback-container is-error', container.className);
      assert.equal('Need to enter your name!', message.textContent);

      view.setMessage('info', 'Your name stinks!');

      assert.equal('js-feedback-container is-info', container.className);
      assert.equal('Your name stinks!', message.textContent);

    });

    it('clears the message', function () {

      var container = view.el.querySelector('.js-feedback-container');
      var message = view.el.querySelector('.js-feedback-message');

      view.setMessage('error', 'Need to enter your name!');
      view.clearMessage();

      assert.equal('js-feedback-container', container.className);
      assert.equal('', message.textContent);

    });

    it('shows the message', function (done) {

      var container = view.el.querySelector('.js-feedback-container');
      var message = view.el.querySelector('.js-feedback-message');

      view
        .setMessage('error', 'no name!')
        .once('message:hidden', function () {
          view
            .once('message:shown', function () {
              assert.equal('auto', container.style.height);
              done();
            })
            .showMessage()
          ;
        })
        .hideMessage()
      ;

    });

    it('hides the message', function (done) {

      var container = view.el.querySelector('.js-feedback-container');
      var message = view.el.querySelector('.js-feedback-message');

      view
        .setMessage('error', 'no name!')
        .once('message:shown', function () {
          view
            .once('message:hidden', function () {
              assert.equal('0px', container.style.height);
              done();
            })
            .hideMessage()
          ;
        })
        .showMessage()
      ;

    });

  });

})();