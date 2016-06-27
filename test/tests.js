var test = require('tape')
var jsdom = require('jsdom')
var jquery = require('fs').readFileSync(__dirname+'/jquery.js', 'utf8')
var Baile = require('fs').readFileSync(__dirname + '/baile.js', 'utf8')


test('JQuery wrapped object is supported', function(t){
	t.plan(1)
	jsdom.env({
	  html: `
		<html>
			<body>
				<div class="elem"></div>
			</body>
		</html>
	  `,
	  src: [jquery, Baile],
	  done: function (err, window) {
	    var $ = window.$;
	    var Baile = window.Baile
	    var b = Baile().select($('.elem')).play('testanim','1s').start()
	    setTimeout(function(){
	    	t.equals($('.elem')[0].classList.length, 2, 'class applied')
	    },200)
	  }
	});
})


test('Select works with DomList object', function(t){
	t.plan(1)
	jsdom.env({
	  html: `
		<html>
			<body>
				<div class="elem"></div>
			</body>
		</html>
	  `,
	  src: [jquery, Baile],
	  done: function (err, window) {
	    var $ = window.$
	    var document = window.document
	    var Baile = window.Baile
	    var b = Baile().select(document.querySelectorAll('.elem')).play('testanim','1s').start()
	    setTimeout(function(){
	    	t.equals($('.elem')[0].classList.length, 2, 'class applied')
	    },200)
	  }
	});
})


test('select works with DOM node', function(t) {
	t.plan(1)
	jsdom.env({
	  html: `
		<html>
			<body>
				<div class="elem"></div>
			</body>
		</html>
	  `,
	  src: [jquery, Baile],
	  done: function (err, window) {
	    var $ = window.$
	    var document = window.document
	    var Baile = window.Baile
	    var b = Baile().select(document.querySelector('.elem')).play('testanim','1s').start()
	    setTimeout(function(){
	    	t.equals($('.elem')[0].classList.length, 2, 'class applied')
	    },200)
	  }
	});
})

test('wait executes callback', function(t){
	t.plan(1)
	jsdom.env({
	  html: `
		<html>
			<body>
				<div class="elem"></div>
			</body>
		</html>
	  `,
	  src: [jquery, Baile],
	  done: function (err, window) {
	    var $ = window.$
	    var document = window.document
	    var Baile = window.Baile
	    var now = new Date()

	    var b = Baile().select('.elem')
	    	.play('testanim','1s')
	    	.wait(function() {
	    		t.pass();
	    	})
	    	.start()

	    setTimeout(function(){
	    },200)
	  }
	});
})


test('wait executes after animation', function(t){
	t.plan(1)
	jsdom.env({
	  html: `
		<html>
			<body>
				<div class="elem"></div>
			</body>
		</html>
	  `,
	  src: [jquery, Baile],
	  done: function (err, window) {
	    var $ = window.$
	    var document = window.document
	    var Baile = window.Baile
	    var now = new Date()

	    var b = Baile().select('.elem')
	    	.play('testanim','1s')
	    	.wait(function() {
	    		var currentTime = new Date()
	    		var diff = currentTime.getTime() -  now.getTime()
	    		t.comment(diff)
	    		var moreThan1Second = diff >= 1000
	    		t.equals($('.elem')[0].classList.length, 2, 'class applied')
	    		t.ok(moreThan1Second, 'wait waits for the animation to stop')
	    	})
	    	.start()

	    setTimeout(function(){
	    },200)
	  }
	});
})


test('wait after playCascade waits for every element animation', function (t){
	t.plan(1)
	jsdom.env({
	  html: `
		<html>
			<body>
				<div class="elem"></div>
				<div class="elem"></div>
				<div class="elem"></div>
			</body>
		</html>
	  `,
	  src: [jquery, Baile],
	  done: function (err, window) {
	    var $ = window.$
	    var document = window.document
	    var Baile = window.Baile
	    var now = new Date()

	    var b = Baile().select('.elem')
	    	.playCascade('testanim','1s')
	    	.wait(function() {
	    		var currentTime = new Date()
	    		var diff = currentTime.getTime() -  now.getTime()
	    		//For 3 elements more than 3 seconds should have passed
	    		//(each anim is 1 second)
	    		var moreThan3Second = diff >= 3000
	    		t.ok(moreThan3Second,'wait runs after 3 seconds')
	    	})
	    	.start()

	    setTimeout(function(){
	    },200)
	  }
	});
})

test('playCascade custom delay set', function(t) {

})

test('play end callback is called', function(t) {

})

test('playCascade end callback is called', function(t) {

})

test('play end callback is called', function(t) {

})

test('Clear removes class from elements', function(t) {
	
})