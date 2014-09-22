(function() {

  var assert = require('assert');
  var InputView = require('control/lib/OptionInputView.js');

  var
    el,
    view
  ;

  /**
   * Create a text element
   * @returns   {InputView}
   */
  function createRadioGroupElement() {
    var group = document.createElement('div');
    group.innerHTML =
      '<label><input type="radio" name="gender" class="js-option" value="male"/> Male</label>' +
      '<label><input type="radio" name="gender" class="js-option" value="female"/> Female</label>'
    ;
    return group;
  }

  /**
   * Create a view
   * @param     {HTMLElement} el
   * @returns   {InputView}
   */
  function createView(el) {
    return new InputView({el: el});
  }

  describe('OptionInputView', function () {

    beforeEach(function () {
      view = createView(createRadioGroupElement());
      document.body.appendChild(view.el)
    });

    afterEach(function () {
      document.body.removeChild(view.el);
    });

    describe('.isDisabled()', function () {

      it('should be true', function () {

        for(var i=0; i<view.options.length; ++i) {
          view.options[i].disabled = true;
        }

        assert(view.isDisabled());
      });

      it('should be false', function () {
        assert(!view.isDisabled());
      });

      it('should be true on an option', function () {
        view.options[0].disabled = true;
        assert(view.isDisabled('male'));
      });

      it('should be false on an option', function () {
        view.options[0].disabled = false;
        assert(!view.isDisabled('male'));
      });
    });

    describe('.setDisabled()', function () {

      it('should be true', function () {
        view.setDisabled(true);

        for(var i=0; i<view.options.length; ++i) {
          assert(view.options[i].disabled);
        }

      });

      it('should be false', function () {
        view.setDisabled(false);

        for(var i=0; i<view.options.length; ++i) {
          assert(!view.options[i].disabled);
        }
      });

      it('should be true on an option', function () {

        for(var i=0; i<view.options.length; ++i) {
          view.options[i].disabled = true;
        }

        view.setDisabled('male', true);

        assert(view.options[0].disabled);
        assert(view.options[0].disabled);
      });

      it('should be false on an option', function () {

        for(var i=0; i<view.options.length; ++i) {
          view.options[i].disabled = true;
        }

        view.setDisabled('male', false);

        assert(!view.options[0].disabled);
        assert(view.options[1].disabled);
      });

    });

    describe('.focus()', function () {

      it('should have focus', function () {
        assert(view.options[0] !== document.activeElement);
        view.focus();
        assert(view.options[0] === document.activeElement);
      });

    });

    it('should trigger blur', function () {
      view.on('blur', function () {
        done();
      });
      document.body.focus();
    });

    describe('.getValue()', function () {

      it('should be empty', function () {
        assert.equal('', view.getValue());
      });

      it('should be female', function () {
        view.options[1].checked = true;
        assert.equal('female', view.getValue());
      });

    });

    describe('.setValue()', function () {

      it('should be empty', function () {
        view.setValue('');
        assert(!view.options[0].checked);
        console.log(view.options[1].checked);
        assert(!view.options[1].checked);
      });

      it('should be female', function () {
        view.setValue('female');
        assert(!view.options[0].checked);
        assert(view.options[1].checked);
      });

      it('should trigger change', function (done) {

        view.on('change', function () {
          done();
        });

        view.options[1].dispatchEvent(new MouseEvent('click'));

      });

    });

  });

})();