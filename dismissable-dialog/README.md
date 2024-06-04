### To Install

1. Copy ```dismissable-dialog.js``` to the QuestJS ```/lib``` directory
2. Add ```settings.customLibraries.push({folder:'lib',files:['dismissable-dialog']})``` to ```settings.js```

### Dismissable Dialog

The default QuestJS dialog allows the author to provide a list of widgets to the `io.dialog` function, along with scripts to run when "Okay" and "Cancel" are clicked. In practice, the player triggers the dialog to be opened, interacts with the widgets, and any changes can be acted upon in the `okayScript`, or they could be discarded in the `cancelScript`.

The dismissable dialog preserves this functionality, but also allows the author to provide `oninput` functions to each widget, so that updates can occur immediately upon player interaction. This could eliminate the need for the `okayScript`, if every widget has an `oninput` script to handle player interaction, so the dismissable dialog also adds the ability to open a dialog as "dismissable", meaning that it can be hidden simply by clicking outside the borders of the dialog. If the dialog is dismissable and both buttons are suppressed, this will be the only way to hide the dialog.

### Parameters for `io.dialog()`
- `title` - The title of the dialog
- `widgets` - A list of widgets to display in the dialog
- `okayScript` - A script to run when "Okay" is clicked. Returns a dictionary with each widget's current value.
- `cancelScript` - A script to run when "Cancel" is clicked.
- `suppressOkay` - A boolean to hide the "Okay" button. Only effective if `dismissable` is also set to `true`.
- `suppressCancel` - A boolean to hide the "Cancel" button.
- `dismissable` - A boolean to allow the dialog to be hidden by clicking outside its borders. The `cancelScript` is executed if this happens.

### Widgets

There are three main changes that the dismissable dialog makes to the default QuestJS dialog widgets.

1. The default widget value can be set with `value`. The type of the value must match the type of the data returned (e.g. a "range" widget returns a number, so it may only be provided a number in the value)
2. The `oninput` script can be provided to be called whenever the player provides an input to the widget. This script may specify up to one parameter, which will be passed a dictionary with a the widget name and the current value.
3. A new `file` type widget is added

There are also a few changes to the properties that can be provided to each widget. This table summarizes which properties can be applied to each widget type.

type|title|name|value|data|oninput|min|max|step|pattern|placeholder|accept
---|---|---|---|---|---|---|---|---|---|---|---
radio|&#9745;|&#9745;|&#9745;|&#9745;|&#9745;|&#9746;|&#9746;|&#9746;|&#9746;|&#9746;|&#9746;
dropdown|&#9745;|&#9745;|&#9745;|&#9745;|&#9745;|&#9746;|&#9746;|&#9746;|&#9746;|&#9746;|&#9746;
dropdownPlus|&#9745;|&#9745;|&#9745;|&#9745;|&#9745;|&#9746;|&#9746;|&#9746;|&#9746;|&#9746;|&#9746;
checkbox|&#9745;|&#9745;|&#9745;|&#9745;|&#9745;|&#9746;|&#9746;|&#9746;|&#9746;|&#9746;|&#9746;
color|&#9745;|&#9745;|&#9745;|&#9746;|&#9745;|&#9746;|&#9746;|&#9746;|&#9746;|&#9746;|&#9746;
range|&#9745;|&#9745;|&#9745;|&#9746;|&#9745;|&#9745;|&#9745;|&#9745;|&#9746;|&#9746;|&#9746;
number|&#9745;|&#9745;|&#9745;|&#9746;|&#9745;|&#9745;|&#9745;|&#9746;|&#9746;|&#9746;|&#9746;
text|&#9745;|&#9745;|&#9745;|&#9746;|&#9745;|&#9745;|&#9745;|&#9746;|&#9745;|&#9745;|&#9746;
password|&#9745;|&#9745;|&#9745;|&#9746;|&#9745;|&#9745;|&#9745;|&#9746;|&#9745;|&#9745;|&#9746;
file|&#9745;|&#9745;|&#9745;|&#9746;|&#9745;|&#9746;|&#9746;|&#9746;|&#9746;|&#9746;|&#9745;

### Example

```
const onInputFunc = function (input){
  console.log(input)
}

const widgets = {
  title:'Test All Dialog Widgets',
  widgets:[
    { type: 'radio', title: 'Radio', name: 'radio', data: {radio1:'Option 1', radio2: 'Option 2'}, oninput: onInputFunc, value: 'radio2' },
    { type: 'dropdown', title: 'Dropdown', name: 'dropdown', data: {dropdown1:'Option 1', dropdown2: 'Option 2'}, oninput: onInputFunc, value: 'dropdown2' },
    { type:'dropdownPlus', title:'DropdownPlus', name:'dropdownPlus', lines:4, data:[
      {name:'dropdownPlus1', title:'Option 1', text:'Text for option 1'},
      {name:'dropdownPlus2', title:'Option 2', text:'Text for option 2'},
    ], oninput: onInputFunc, value: 'dropdownPlus2'},
    { type:'checkbox', title:'Checkbox', name:'checkbox', data:'Checked?', oninput: onInputFunc, value: true},
    { type: 'color', title: 'Color', name: 'color', oninput: onInputFunc, value: '#77767b' },
    { type:'range', title:'Range', name:'range', data:'Range?', min: 0, max: 10, step: 2, oninput: onInputFunc, value: 6},
    { type:'number', title:'Number', name:'number', data:'Number?', min: 0, max: 10, oninput: onInputFunc, value: 3},
    { type:'text', title:'Text', name:'text', min: 3, max: 10, oninput: onInputFunc, value: 'text'},
    { type:'password', title:'Password', name:'password', min: 3, max: 10, oninput: onInputFunc, placeholder: 'password'},
    { type:'file', title: 'File', name: 'file', accept: ".txt,.json", oninput: onInputFunc}
  ],
  okayScript:function(results) {
    console.log(results)
  },
  cancelScript:function(results) {
    console.log(results)
  },
  suppressOkay: true,
  suppressCancel: true,
  dismissable: true
}

io.dialog(widgets)
```
