(function() {

  var assert    = require('assert');
  var InputView = require('control/lib/MultiOptionInputView.js');

  var view;

  /**
   * Create an element
   * @returns   {HTMLElement}
   */
  function createElement() {
    var element = document.createElement('div');
    element.innerHTML =
      '<label class="js-option-label"><input type="checkbox" name="color" class="js-option-input" value="red"/> Blue</label>' +
      '<label class="js-option-label"><input type="checkbox" name="color" class="js-option-input" value="green"/> Green</label>'+
      '<label class="js-option-label"><input type="checkbox" name="color" class="js-option-input" value="red"/> Red</label>' +
      '<label class="js-option-label"><input type="checkbox" name="color" class="js-option-input" value="yellow"/> Yellow</label>'
    ;
    return element;
  }

  /**
   * Create a view
   * @param     {HTMLElement} element
   * @returns   {InputView}
   */
  function createView(element) {
    return new InputView({el: element});
  }

  describe('MultiOptionInputView', function() {

    beforeEach(function () {
      view = createView(createElement());
      document.body.appendChild(view.el)
    });

    afterEach(function () {
      document.body.removeChild(view.el);
    });

    describe('.getValue()', function() {

      it('should return an empty array', function() {
        assert.equal(0, view.getValue().length);
      });

      it('should return an array of selected values', function() {

        //check some inputs
        var inputs = view.el.querySelectorAll('.js-option-input');
        var labels = view.el.querySelectorAll('.js-option-label');
        inputs[1].checked = true;
        inputs[2].checked = true;
        labels[1].classList.add('is-selected');
        labels[1].classList.add('is-selected');

        var value = view.getValue();
        assert.equal(2, value.length);
        assert.equal(value[0], 'green');
        assert.equal(value[1], 'red');

      });

    });

    describe('.setValue()', function() {

      it('should unselect values', function() {

        //select some inputs
        var inputs = view.el.querySelectorAll('.js-option-input');
        var labels = view.el.querySelectorAll('.js-option-label');
        inputs[1].checked = true;
        inputs[2].checked = true;
        labels[1].classList.add('is-selected');
        labels[1].classList.add('is-selected');

        view.setValue([]);

        //check inputs are unselected
        assert.equal(false, inputs[1].checked);
        assert.equal(false, inputs[2].checked);
        assert.equal(false, labels[1].classList.contains('is-selected'));
        assert.equal(false, labels[2].classList.contains('is-selected'));

      });

      it('should select values', function() {

        view.setValue(['red', 'green']);

        //check inputs are selected
        var inputs = view.el.querySelectorAll('.js-option-input');
        var labels = view.el.querySelectorAll('.js-option-label');
        assert(inputs[1].checked);
        assert(inputs[2].checked);
        assert(labels[1].classList.contains('is-selected'));
        assert(labels[2].classList.contains('is-selected'));

      });

    });

    describe('Events', function() {

      it('should fire blur event', function(done) {
        var inputs = view.el.querySelectorAll('.js-option-input');

        view.on('blur', function() {
          done();
        });

        //click an input
        inputs[1].focus();
        inputs[1].blur();

      });

      it('should fire change event and be "selected"', function(done) {
        var inputs = view.el.querySelectorAll('.js-option-input');
        var labels = view.el.querySelectorAll('.js-option-label');

        view.on('change', function() {
          assert(inputs[1].checked);
          assert(labels[1].classList.contains('is-selected'));
          done();
        });

        //click an input
        inputs[1].click();
      });

    });

  });

})();