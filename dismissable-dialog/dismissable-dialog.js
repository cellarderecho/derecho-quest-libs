"use strict"

document.addEventListener('click', function(event) {
  var dialog = document.getElementById('dialog');
  if (io.dialogDismissable && event.target !== dialog && !dialog.contains(event.target)) {
    io.dialogCancel();
  }
});

io.dialogDismissable = false

io.dialog = function(data) {
  if (test.testing || settings.walkthroughMenuResponses.length > 0) {
    return
  }

  world.suppressEndTurn = true

  io.dialogWidgets = data.widgets
  io.dialogOkayScript = data.okayScript
  io.dialogCancelScript = data.cancelScript
  const diag = document.getElementById("dialog")
  diag.innerHTML = "";

  const heading = document.createElement('h3');
  heading.className = 'dialog-heading';
  heading.textContent = data.title;
  diag.appendChild(heading);

  if (data.desc) {
    const p = document.createElement('p');
    p.textContent = data.desc;
    diag.appendChild(p);
  }

  if (data.html) {
    diag.insertAdjacentHTML('beforeend', data.html);
  }

  for (const el of data.widgets) {
    diag.appendChild(io.setWidget(el));
  }

  if (!data.dismissable || !data.suppressCancel || !data.suppressOkay) {
    const hr = document.createElement('hr');
    diag.appendChild(hr);

    const p = document.createElement('p');
    if (!data.suppressCancel) {
      const cancel = document.createElement('input');
      cancel.type = 'button';
      cancel.value = 'Cancel';
      cancel.style.color = 'grey';
      cancel.style.float = 'right';
      cancel.addEventListener('click', io.dialogCancel);
      p.appendChild(cancel);
    }

    if (!data.dismissable || !data.suppressOkay) {
      const okay = document.createElement('input');
      okay.type = 'button';
      okay.value = 'Okay';
      okay.style.color = 'grey';
      okay.style.float = 'right';
      okay.addEventListener('click', io.dialogOkay);
      p.appendChild(okay);
    }
    diag.appendChild(p);
  }

  diag.style.width = '400px';
  diag.style.height = 'auto';
  diag.style.top = '80px';
  diag.style.position = 'fixed';
  diag.style.display = 'block';

  document.body.appendChild(diag);

  io.disable(3);

  if (data.dismissable) {
    const dismissScript = document.createElement('script');
    dismissScript.text = 'setTimeout(function() { io.dialogDismissable = true; }, 0);';
    diag.appendChild(dismissScript);
  }
}

io.setWidget = function(options) {
  let type = options.type;
  if (type === 'auto') {
    type = Object.keys(options.data).length > settings.widgetRadioMax ? 'dropdown' : 'radio';
  }

  const widgetDiv = document.createElement('div');
  widgetDiv.id = `dialog-div-${options.name}`;
  widgetDiv.className = 'widget';

  const h4 = document.createElement('h4');
  h4.textContent = options.title;
  widgetDiv.appendChild(h4);

  if (type === 'radio') {
    let value = (typeof options.value === 'string' && Object.keys(options.data).includes(options.value)) ? options.value : Object.keys(options.data)[0];

    const div = document.createElement('div');
    div.id = options.name;
    div.style.display = 'none';
    widgetDiv.appendChild(div);

    for (const key in options.data) {
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = options.name;
      input.id = key;
      input.value = key;

      if (key === value) {
        input.checked = true;
      }
      if (options.hasOwnProperty('oninput')) {
        input.addEventListener('input', (event) => {
          io.onWidgetInput(options.name, event.target.value)
        });
      }
      
      widgetDiv.appendChild(input);

      const label = document.createElement('label');
      label.htmlFor = key;
      label.textContent = options.data[key];
      widgetDiv.appendChild(label);

      const br = document.createElement('br');
      widgetDiv.appendChild(br);
    }
  }

  else if (type === 'dropdown') {
    let value = (typeof options.value === 'string' && Object.keys(options.data).includes(options.value)) ? options.value : Object.keys(options.data)[0]

    const select = document.createElement('select');
    select.name = options.name;
    select.id = options.name;
    if (options.hasOwnProperty('oninput')) {
      select.addEventListener('change', (event) => {
        io.onWidgetInput(options.name, event.target.value)
      });
    }
    const br = document.createElement('br')
    select.appendChild(br)
    for (const key in options.data) {
      const option = document.createElement('option');
      option.value = key
      if (key === value){
        option.selected = "selected"
      }
      option.textContent = options.data[key]
      select.appendChild(option)
    }  
    widgetDiv.appendChild(select);
  }

  else if (type === 'dropdownPlus') {
    let index = options.data.findIndex(el => el.name === options.value);
    if (index === -1) index = 0

    const select = document.createElement('select');
    select.name = options.name;
    select.id = options.name;
    if (options.hasOwnProperty('oninput')) {
      select.addEventListener('change', (event) => {
        io.onWidgetInput(options.name, event.target.value)
      });
    }
    const br = document.createElement('br')
    select.appendChild(br)

    for (let i = 0; i < options.data.length; i++) {
      const  el = options.data[i]
      const option = document.createElement('option');
      option.value = el.name
      if (i === index){
        option.selected = "selected"

      }
      option.textContent = el.title
      select.appendChild(option)
    }

    widgetDiv.appendChild(select);

    const p = document.createElement('p')
    p.className = "dialog-text"
    p.id = `${options.name}-text`
    p.textContent = options.data[index].text

    widgetDiv.appendChild(p);
  }

  else if (type === 'checkbox') {
    const input = document.createElement('input');
    input.type = "checkbox"
    input.name = options.name;
    input.id = options.name;
    if (options.value) input.checked = true
    if (options.hasOwnProperty('oninput')) {
      input.addEventListener('input', (event) => {
        io.onWidgetInput(options.name, event.target.checked)
      });
    }
 
    widgetDiv.appendChild(input);

    const label = document.createElement('label')
    label.htmlFor = options.name;
    label.textContent = options.data;
    widgetDiv.appendChild(label);
  }

  else if (type === 'color' || type === 'colour') {
    const colorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/
    let value = (typeof options.value === 'string' && options.value.match(colorRegex)) ? options.value : '#000000'
    const input = document.createElement('input');
    input.type = "color"
    input.name = options.name;
    input.id = options.name;
    input.value = value;
    if (options.hasOwnProperty('oninput')) {
      input.addEventListener('input', (event) => {
        io.onWidgetInput(options.name, event.target.value)
      });
    }
 
    widgetDiv.appendChild(input);

  }

  else if (type === 'range' || type === 'number') {
    const value = typeof options.value === 'number' ? options.value : 0
    const input = document.createElement('input');
    input.type = type
    input.name = options.name;
    input.id = options.name;
    input.value = value;
    if (options.min) input.min = options.min
    if (options.max) input.max = options.max
    if (options.step) input.step = options.step
    if (options.hasOwnProperty('oninput')) {
      input.addEventListener('input', (event) => {
        io.onWidgetInput(options.name, event.target.value)
      });
    }
 
    widgetDiv.appendChild(input);

  }

  else if (type === 'text' || type === 'password') {
    const value = typeof options.value === 'string' ? options.value : ''
    const input = document.createElement('input');
    input.type = type
    input.name = options.name;
    input.id = options.name;
    input.value = value;
    if (options.min) input.minlength = options.min
    if (options.max) input.maxlength = options.max
    if (options.pattern) input.pattern = options.pattern
    if (options.placeholder) input.placeholder = options.placeholder
    if (options.hasOwnProperty('oninput')) {
      input.addEventListener('blur', (event) => {
        io.onWidgetInput(options.name, event.target.value)
      });
    }

    widgetDiv.appendChild(input);

  }

  else if (type === 'file') {
    const value = typeof options.value === 'string' ? options.value : ''
    const input = document.createElement('input');
    input.type = type
    input.name = options.name;
    input.id = options.name;
    input.value = value;
    if (options.accept) input.accept = options.accept
    if (options.hasOwnProperty('oninput')) {
      input.addEventListener('input', (event) => {
        io.onWidgetInput(options.name, event.target.value)
      });
    }
 
    widgetDiv.appendChild(input);

  }

  if (options.comment) {
    const p = document.createElement('p');
    p.className = 'dialog-comment';
    p.textContent = options.comment;
    widgetDiv.appendChild(p);
  }

  return widgetDiv;
};

io.onWidgetInput = function(widgetName, value){
  const result = {}
  result[widgetName] = value
  io.dialogWidgets.find(widget => widget.name === widgetName).oninput(result)
}

io.convertFuncToString = function(funcStr, paramReplStr){
  const param = funcStr.substring(funcStr.indexOf('(') + 1, funcStr.indexOf(')'))
  funcStr = funcStr.substring(funcStr.indexOf('{'), funcStr.lastIndexOf('}') + 1)
  funcStr = funcStr.replace(/"/g, "'");
  if (param.length > 0){
    const regex = new RegExp(`\\b${param}\\b`, 'g')
    funcStr = funcStr.replace(regex, paramReplStr);
  }
  return funcStr
}

io.htmlValue = function(options) {
  //log(options.name)
  // use type to cover the auto type
  const type = document.querySelector('#' + options.name).type

  let value
  
  if (options.type === 'dropdownPlus') {
    value = document.querySelector('#' + options.name).value
    options.checked = 0
    for (const el of options.data) {
      if (el.name === value) break
      options.checked++
    }
  }
  else if (type === 'select-one') {
    value = document.querySelector('#' + options.name).value
    options.checked = 0
    for (const key in options.data) {
      if (key === value) break
      options.checked++
    }
  }
  else if (type === 'checkbox') {
    value = document.querySelector('#' + options.name).checked
    options.checked = value
  }
  else if (type === 'text' || type === 'number' || type === 'password' || type === 'range' || type === 'color' || type === 'file') {
    value = document.querySelector('#' + options.name).value
    if (type === 'number') value = parseInt(value)
    options.checked = value
  }
  else {  // radio button has no type
    value = document.querySelector('input[name="' + options.name + '"]:checked').value
    options.checked = 0
    for (const key in options.data) {
      if (key === value) break
      options.checked++
    }
  }

  return value
}

io.dialogOkay = function() {
  const diag = document.getElementById("dialog")  
  diag.style.display = 'none'
  io.enable()
  io.dialogDismissable = false
  const results = {}
  for (const data of io.dialogWidgets) {
    results[data.name] = io.htmlValue(data)
  }
  //log(results)
  io.dialogOkayScript(results)
  world.endTurn(world.SUCCESS)
}

io.dialogCancel = function() {
  const diag = document.getElementById("dialog")  
  diag.style.display = 'none'
  io.enable()
  io.dialogDismissable = false
  if (io.dialogCancelScript) io.dialogCancelScript()
  world.endTurn(world.FAILED)
}