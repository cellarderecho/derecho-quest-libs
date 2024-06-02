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
    //fn(cols[1], typeof row === 'string' ? rows[1] : rows[1].name)
    return
  }
  world.suppressEndTurn = true

  io.dialogWidgets = data.widgets
  io.dialogOkayScript = data.okayScript
  io.dialogCancelScript = data.cancelScript
  const diag = document.getElementById("dialog")
  
  let html = ''
  html += '<h3 class="dialog-heading">' + data.title + '</h3>'
  if (data.desc) html += '<p>' + data.desc + '</p>'
  if (data.html) html += data.html
  
  for (const el of data.widgets) html += io.setWidget(el)
  if (!data.dismissable || !data.suppressCancel || !data.suppressOkay) html += '<hr><p>'
  if (!data.suppressCancel) html += '<input type="button" value="Cancel" style="color:grey;float: right;" onclick="io.dialogCancel()"/>'
  if (!data.dismissable || !data.suppressOkay) html += '<input type="button" value="Okay" style="color:grey;float: right;" onclick="io.dialogOkay()"/></p>'
  diag.innerHTML = html
  diag.style.width = '400px'
  diag.style.height = 'auto'
  diag.style.top = '80px'
  diag.style.position = 'fixed'
  diag.title = data.title
  io.disable(3)
  if (data.dismissable) {
    let dismissScript = document.createElement('script');
    dismissScript.innerHTML = 'setTimeout(function() { io.dialogDismissable = true; }, 0);';
    diag.appendChild(dismissScript);
  }
  diag.style.display = 'block';
  
  //log('here')
}

io.setWidget = function(options) {
  //log(options)
  let type = options.type
  if (type === 'auto') {
    type = Object.keys(options.data).length > settings.widgetRadioMax ? 'dropdown' : 'radio'
  }
    
  let html = '<div id="dialog-div-' + options.name + '" class="widget"><h4>' + options.title + '</h4>'
  if (type === 'radio') {
    let value = (typeof options.value === 'string' && Object.keys(options.data).includes(options.value)) ? options.value : Object.keys(options.data)[0]
    html += '<div id="' + options.name + '" style="display:none" ></div>'  // usefu later when deciding what type this is
    for (const key in options.data) {
      html += '<div><input type="radio" name="' + options.name + '" id="' + key +'" value="' + key +'" '
      if (key === value) html += 'checked '
      if (options.hasOwnProperty("oninput")){
        const onInputStr = io.convertFuncToString(options.oninput.toString(), `{${options.name}: this.value}`)
        html += 'oninput="' + onInputStr + '"';
      }
      html += '/><label for="' + key +'">' + options.data[key] + '</label></div>'
    }
  }  
  
  if (type === 'dropdown') {
    let value = (typeof options.value === 'string' && Object.keys(options.data).includes(options.value)) ? options.value : Object.keys(options.data)[0]
    html += '<select name="' + options.name + '" id="' + options.name + '"'
    if (options.hasOwnProperty("oninput")){
      const onInputStr = io.convertFuncToString(options.oninput.toString(), `{${options.name}: this.value}`)
      html += 'onchange="' + onInputStr + '"';
    }
    html +='><br/>'
    for (const key in options.data) {
      html += '<option value="' + key + '"'
      if (key === value) html += ' selected="selected" '
      html += '/>' + options.data[key] + '</option>'
    }
    html += '</select>'
  }
  
  if (type === 'dropdownPlus') {
    let index = options.data.findIndex(el => el.name === options.value);
    if (index === -1) index = 0
    html += '<select name="' + options.name + '" id="' + options.name + '" onchange="io.dropdownChange(\'' + options.name + '\')'
    if (options.hasOwnProperty("oninput")){
      const onInputStr = io.convertFuncToString(options.oninput.toString(), `{${options.name}: this.value}`)
      html += ';' + onInputStr;
    }
    html += '"><br/>'
    for (let i = 0; i < options.data.length; i++) {
      let el = options.data[i]
      html += '<option value="' + el.name + '"'
      if (i === index) html += ' selected="selected" '
      if (options.hasOwnProperty("oninput")){
        const onInputStr = io.convertFuncToString(options.oninput.toString(), `{${options.name}: this.value}`)
        html += 'oninput="' + onInputStr + '"';
      }
      html += '/>' + el.title + '</option>'
    }
    html += '</select>'
    //log(index)
    //log(options.data)
    html += '<p class="dialog-text" id="' + options.name + '-text">' + options.data[index].text + '</p>'
  }
  
  if (type === 'checkbox') {
    html += '<input type="checkbox" name="' + options.name + '" id="' + options.name + '" '
    if (options.value) html += 'checked '
    if (options.hasOwnProperty("oninput")){
      const onInputStr = io.convertFuncToString(options.oninput.toString(), `{${options.name}: this.checked}`)
      html += 'oninput="' + onInputStr + '"';
    }
    html += '/><label for="' + options.name +'">' + options.data + '</label></div>'
  }
  
  if (type === 'color' || type === 'colour') {
    const colorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/
    let value = (typeof options.value === 'string' && options.value.match(colorRegex)) ? options.value : '#000000'
    html += '<input type="color" name="' + options.name + '" id="' + options.name + '" '
    html += 'value="' + value + '" '
    if (options.hasOwnProperty("oninput")){
      const onInputStr = io.convertFuncToString(options.oninput.toString(), `{${options.name}: this.value}`)
      html += 'oninput="' + onInputStr + '"';
    }
    html += '/></div>'
  }
  
  if (type === 'range' || type === 'number') {
    let value = typeof options.value === 'number' ? options.value : 0
    html += '<input type="' + type + '" name="' + options.name + '" id="' + options.name + '" '
    html += 'value="' + value + '" '
    if (options.opts) html += options.opts + ' '
    if (options.hasOwnProperty("oninput")){
      const onInputStr = io.convertFuncToString(options.oninput.toString(), `{${options.name}: parseInt(this.value)}`)
      html += 'oninput="' + onInputStr + '"';
    }
    html += '/></div>'
  }
  
  if (type === 'text' || type === 'password') {
    let value = typeof options.value === 'string' ? options.value : ''
    html += '<input type="' + type + '" name="' + options.name + '" id="' + options.name + '" '
    html += 'value="' + value + '" '
    if (options.opts) html += options.opts + ' '
    if (options.hasOwnProperty("oninput")){
      const onInputStr = io.convertFuncToString(options.oninput.toString(), `{${options.name}: this.value}`)
      html += 'onblur="' + onInputStr + '"';
    }
    html += '/></div>'
  }
  
  if (options.comment) html += '<p class="dialog-comment">' + options.comment + '</p>'
  html += '</div>'
  
  return html
}

io.convertFuncToString = function(funcStr, paramReplStr){
  const param = funcStr.substring(funcStr.indexOf('(') + 1, funcStr.indexOf(')'))
  funcStr = funcStr.substring(funcStr.indexOf('{'), funcStr.lastIndexOf('}') + 1)
  if (param.length > 0){
    const regex = new RegExp(`\\b${param}\\b`, 'g')
    funcStr = funcStr.replace(regex, paramReplStr)
  }
  return funcStr
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