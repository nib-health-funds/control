(function() {

  var assert = require('assert');
  var InputView = require('control/lib/InputView.js');

  var
    el,
    view,
    selectView
    ;

  /**
   * Create a text element
   * @returns   {InputView}
   */
  function createTextElement() {
    var text = document.createElement('input');
    text.type = 'text';
    return text;
  }

  /**
   * Create a select element
   * @returns   {InputView}
   */
  function createSelectElement() {
    var select = document.createElement('select');
    for (var i = 0; i < 5; ++i) {
      var option = document.createElement('option');
      option.value = i;
      option.appendChild(document.createTextNode('Option #' + i));
      select.appendChild(option);
    }
    return select;
  }

  /**
   * Create a view
   * @param     {HTMLElement} el
   * @returns   {InputView}
   */
  function createView(el) {
    return new InputView({el: el});
  }

  describe('InputView', function () {

    beforeEach(function () {
      view = createView(createTextElement());
      document.body.appendChild(view.el)
    });

    afterEach(function () {
      document.body.removeChild(view.el);
    });

    describe('.isDisabled()', function () {

      it('should be true', function () {
        view.el.disabled = true;
        assert(view.isDisabled());
      });

      it('should be false', function () {
        assert(!view.isDisabled());
      });

    });

    describe('.setDisabled()', function () {

      it('should be true', function () {
        view.setDisabled(true);
        assert(view.el.disabled);
      });

      it('should be false', function () {
        view.setDisabled(true);
        assert(view.el.disabled);
        view.setDisabled(false);
        assert(!view.el.disabled);
      });

    });

    describe('.focus()', function () {

      it('should have focus', function () {
        assert(view.el !== document.activeElement);
        view.focus();
        assert(view.el === document.activeElement);
      });

    });

    it('should trigger blur', function () {
      view.on('blur', function () {
        done();
      });
      document.body.focus();
    });

    describe('TextInput', function () {

      describe('.getValue()', function () {

        it('should be empty', function () {
          assert.equal('', view.getValue());
        });

        it('should be foobar', function () {
          view.el.value = 'foobar';
          assert.equal('foobar', view.getValue());
        });

      });

      describe('.setValue()', function () {

        it('should be empty', function () {
          view.setValue('');
          assert.equal('', view.el.value);
        });

        it('should be foobar', function () {
          view.setValue('foobar');
          assert.equal('foobar', view.el.value);
        });

      });

      it('should trigger change', function (done) {
        view.on('change', function () {
          done();
        });
        view.el.dispatchEvent(new Event('input'));
      });

    });

    describe('SelectInput', function () {

      beforeEach(function () {
        selectView = createView(createSelectElement());
        document.body.appendChild(selectView.el)
      });

      afterEach(function () {
        document.body.removeChild(selectView.el);
      });

      describe('.getValue()', function () {

        it('should be empty', function () {
          selectView.el.value = 'foobar';
          assert.equal('', selectView.getValue());
        });

        it('should be 0', function () {
          assert.equal('0', selectView.getValue());
        });

      });

      describe('.setValue()', function () {

        it('should be empty', function () {
          selectView.setValue('');
          assert.equal('', selectView.el.value);
        });

        it('should be 1', function () {
          selectView.setValue('1');
          assert.equal('1', selectView.el.value);
        });

      });

      it('should trigger change', function (done) {

        selectView.on('change', function () {
          done();
        });

        selectView.el.dispatchEvent(new Event('change'));

      });

    });

  });

})();