$(document).ready(function () {
  $('pre').addClass('prettyprint lang-js');
  prettyPrint();

  function convertToList(a) {
    return Monet.List.fromArray(a.toArray())
  }
  
  function convertToTOC(list) {
    return list.foldLeft('')(function (acc, e) {
      var element = $(e);
      return acc + '<li><a href="#' + element.attr('id') + '">' + element.text() + '</a></li>\n'
    })
  }

  function addAuthors(html) {
    return html + '<li><a href="#authors">Authors</a></li>\n'
  }

  function elem(id) {
    return Monet.IO(function () {
      return $(id)
    });
  }

  var setHtml = Monet.curry(function (html, o) {
    return o.html(html)
  });
  
  var writer = Monet.curry(function (writeFn, id, content) {
    return elem(id).map(writeFn(content))
  });

  elem('h3').map(convertToList).map(convertToTOC).flatMap(writer(setHtml, '#contents')).run()
});
