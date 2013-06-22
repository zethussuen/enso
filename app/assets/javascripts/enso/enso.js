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
  var r = confirm('Are you sure you want to clear text?\n\nWarning: this cannot be undone!');
  if (r==true )
    {
      document.getElementById('editor_code').value = "";
      localStorage.removeItem('recover');
    }
  else {
    e.preventDefault();
  }
};

$(function(){
  $('#save-btn').on('click', function(){
    saveDraft();
  })

  var recover = localStorage.getItem('recover');
  var template = 
      '# Enso Markdown Editor \n' +
      'Maintained by [@zethussuen](twitter.com/zethussuen)\n' +
      '***\n' +
      '## Font styling\n' +
      '*italics* or _italics_\n' +
      '**bold** or __bold__\n' +
      '**_a combo of both?_**\n' +
      '~~nope~~\n' +
      '##Creating Lists\n' +
      '1. Oranges\n' +
      '2. Apples\n' +
      '  * Granny smith\n' +
      '3. Bananas\n' +
      ' 1. Two of them\n' +
      '- Unordered List with a hyphen\n' +
      '+ ... or a plus!\n\n' +
      '##Blockquoting\n' +
      '> Quote goes in here\n' +
      '> -attribution\n\n' +
      '##Tables\n' +
      '| Tables        | Are           | Cool  |\n' +
      '|---------------- |:-------------:| ---    --:|\n' +
      '| col 3 is      | right-aligned | $1600 |\n' +
      '| col 2 is      | centered      |   $12 |\n' +
      '| zebra stripes | are neat      |    $1 |\n\n' +
      '##Images\n' +
      '![Alt Text](http://f.cl.ly/items/033l3B0W3J3V363r0j1w/Animated%20Gif%20on%20Giphy.gif "Alt Text")\n\n' +
      '##Links\n' +
      "[I'm an inline-style link](https://www.google.com)\n" +
      "[I'm a reference-style link][Arbitrary case-insensitive reference text]\n" +
      '[You can use numbers for reference-style link definitions][1]\n' +
      'Or leave it empty and use the [link text itself][]\n' +
      'Some text to show that the reference links can follow later.\n' +
      '[arbitrary case-insensitive reference text]: https://www.mozilla.org\n' +
      '[1]: http://slashdot.org\n' +
      '[link text itself]: http://www.reddit.com\n'
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