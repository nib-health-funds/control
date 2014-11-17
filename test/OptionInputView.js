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
      '<label class="js-option-label"><input type="radio" name="gender" class="js-option-input" value="male"/> Male</label>' +
      '<label class="js-option-label"><input type="radio" name="gender" class="js-option-input" value="female"/> Female</label>'
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

        for(var i=0; i<view.inputs.length; ++i) {
          view.inputs[i].disabled = true;
        }

        assert(view.isDisabled());
      });

      it('should be false', function () {
        assert(!view.isDisabled());
      });

      it('should be true on an option', function () {
        view.inputs[0].disabled = true;
        assert(view.isDisabled('male'));
      });

      it('should be false on an option', function () {
        view.inputs[0].disabled = false;
        assert(!view.isDisabled('male'));
      });
    });

    describe('.setDisabled()', function () {

      it('should be true', function () {
        view.setDisabled(true);

        for(var i=0; i<view.inputs.length; ++i) {
          assert(view.inputs[i].disabled);
        }

      });

      it('should be false', function () {
        view.setDisabled(false);

        for(var i=0; i<view.inputs.length; ++i) {
          assert(!view.inputs[i].disabled);
        }
      });

      it('should be true on an option', function () {

        for(var i=0; i<view.inputs.length; ++i) {
          view.inputs[i].disabled = false;
        }

        view.setDisabled('male', true);

        assert(view.inputs[0].disabled);
        assert(view.labels[0].classList.contains('is-disabled'))
        assert(!view.inputs[1].disabled);
        assert(!view.labels[1].classList.contains('is-disabled'))
      });

      it('should be false on an option', function () {

        for(var i=0; i<view.inputs.length; ++i) {
          view.inputs[i].disabled = true;
          view.labels[i].classList.add('is-disabled');
        }

        view.setDisabled('male', false);

        assert(!view.inputs[0].disabled);
        assert(!view.labels[0].classList.contains('is-disabled'));
        assert(view.inputs[1].disabled);
        assert(view.labels[1].classList.contains('is-disabled'));
      });

    });

    describe('.focus()', function () {

      it('should have focus', function () {
        assert(view.inputs[0] !== document.activeElement);
        view.focus();
        assert(view.inputs[0] === document.activeElement);
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
        view.inputs[1].checked = true;
        assert.equal('female', view.getValue());
      });

    });

    describe('.setValue()', function () {

      it('should be empty', function () {
        view.setValue('');
        assert(!view.inputs[0].checked);
        assert(!view.inputs[1].checked);
      });

      it('should be female', function () {
        view.setValue('female');
        assert(!view.inputs[0].checked);
        assert(view.inputs[1].checked);
      });

      it('should trigger change', function (done) {

        view.on('change', function () {
          done();
        });

        view.inputs[1].click();

      });

    });

  });

})();