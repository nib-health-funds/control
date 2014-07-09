# control

A form control. Validate user input, display an error message and save data to the model.

## Example

The HTML:

    <div class="js-name-control">
        <label>
            Your name:
            <input class="control-input js-input" autofocus/>
        </label>
        <span class="js-feedback-message"></span>
    </div>

The JS:
    
    var Control = require('control');
    
    var nameControl = Control.create({
        el:             document.querySelector('.js-name-control'),
        filters:        [trim],
        validators:     [[required, 'Your name is required so we can contact you.']]
    });
    
See `test/example.html` for a working example.

## Methods

### Control.create(options) : ControlPresenter

Create and wire up a new control.

#### Options

 - `el` - The control element. Must contain a `.js-input` element and should probably also contain a `.js-feedback-message` element.
 - `type` - The type of the control. Used for creating an input view. Optional. Defaults to `text`.
 - `name` - The name of the control. Used for retrieving the control from a collection. e.g. `first-name`. Optional. 
 - `events` - The events emitted by the input view which should trigger validation. Optional. Defaults to `blur`.
 - `filters` - The filters. Optional. 
 - `validators` - The validators. Optional. 
 
 - `model` - The model on which the valid data should be set. Optional.
 - `modelProperty` - The model property on which the valid data should be set. Optional.

### ControlPresenter.getName() : String

Get the control name.

### ControlPresenter.getValue() : String

Get the control value.

### ControlPresenter.setValue(value : String)

Set the control value.

### ControlPresenter.isValid() : Boolean

Get the result of the last call to `validate()`. 

### ControlPresenter.focus()

Focus the input.

### ControlPresenter.clear()

Clear the value and validation state.

### ControlPresenter.validate()

Filters the input value, validates the input value and updates the control view accordingly.

### ControlPresenter.on(type : String, callback : Function)

### ControlPresenter.off(type : String, callback : Function)

## Events

### change

Emitted after the input value has changed.

### validate

Emitted after each call to `validate()`.

#### Arguments

- `valid` - Whether the input is valid.
- `value` - The filtered value.
- `control` - The control.

## Advanced

If you want to display your feedback messages in a different way e.g. in a popup, you can create your own `ControlView` 
and pass it to a new `ControlPresenter` instance.