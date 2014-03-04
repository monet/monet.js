$(document).ready(function(){
       $('pre').addClass('prettyprint lang-js');
       	prettyPrint();
		function convertToList(a) { 
			return a.toArray().list()
		}
		function convertToTOC(list) {
			return list.foldLeft("")(
				function(acc, e) {
					var element = $(e)
					return acc + "<li><a href='#"+element.attr('id') +"'>" + element.text() + "</a></li>\n"
				})
		}
				
		var getId = $.io1()

		var getTextForId = function (id) { return getId(id).map(getText) }
		
		var getValForId = function (id) { return getId(id).map(getVal) }

		var getText = function (o) {
		    return o.text()
		}

		    var setHtml = function (html, o) {
		        return o.html(html)
		    }.curry()

		    var setText = function (text, e) {
		        return e.text(text)
		    }.curry()

		    var getVal = function (o) {
		        return o.val()
		    }

		    var writer = function (writeFn, id, content) {
		        return getId(id).map(writeFn(content))
		    }.curry()
		
		getId("h2").map(convertToList.andThen(convertToTOC)).flatMap(writer(setHtml, "#contents")).run()
})