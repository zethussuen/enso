var draft = '';

window.onload = function() {
  marked.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    langPrefix: 'language-'/*,
    highlight: function(code, lang) {
      if (lang === 'js') {
        return highlighter.javascript(code);
      }
      return code;
    }
    */
  });

  var source = document.getElementById('editor_code');
  var output = document.getElementById('preview_code');

  source.onkeydown = function(event) {
    var keyCode = event.keyCode ? event.keyCode : event.charCode ? event.charCode : event.which;
    if (keyCode == 9 && !event.shiftKey && !event.ctrlKey && !event.altKey) {
      var scrollTop = this.scrollTop;

      if (this.setSelectionRange) {
        var selectionStart = this.selectionStart;
        var selectionEnd = this.selectionEnd;
        this.value = this.value.substring(0, selectionStart) + '\t' + this.value.substr(selectionEnd);
        this.setSelectionRange(selectionStart + 1, selectionStart + 1);
        this.focus();
      } else if (this.createTextRange) {
        document.selection.createRange().text = '\t';
        event.returnValue = false;
      }

      this.scrollTop = scrollTop;

      if (event.preventDefault) {
        event.preventDefault();
      }

      return false;
    }

    return true;
  }

  source.onchange = source.onkeyup = function() {
    var html = marked(this.value);
    output.innerHTML = '<div class="markdown-body">'+html+'</div>';
  }

  source.onchange();
};

function saveDraft(e){
  var draft = document.getElementById('editor_code').value;
  localStorage.setItem('recover', draft);
  return false;
};

function clearDraft(e){
  confirm('Are you sure you want to clear text?\n\nWarning: this cannot be undone!');
  document.getElementById('editor_code').value = "";
  localStorage.removeItem('recover');
};

$(function(){
  $('#save-btn').on('click', function(){
    saveDraft();
  })

  var recover = localStorage.getItem('recover');
  var template = 
      '# Enso Markdown Editor \n' +
      '***\n' + 
      'Maintained by [@zethussuen](twitter.com/zethussuen)\n'
  ;

  if(recover == null || recover == ""){
    $('#editor_code').html(template);
  }
  else {
    $('#editor_code').html(recover);
  };

  jwerty.key('ctrl+shift+s/cmd+shift+s', function(){
    saveDraft();
  });

  jwerty.key('ctrl+shift+backspace/cmd+shift+backspace', function(){
    clearDraft();
  });
});