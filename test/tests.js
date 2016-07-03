var test = require('tape')
var jsdom = require('jsdom')
var jquery = require('fs').readFileSync(__dirname+'/jquery.js', 'utf8')
var Baile = require('fs').readFileSync(__dirname + '/baile.js', 'utf8')
var BaileObj = require('./baile.js')


function createVirtualConsole() {
	var virtualConsole = jsdom.createVirtualConsole();
	virtualConsole.on("log", function (message) {
	  console.log("console.log ->", message);
	});
	return virtualConsole;
}


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
	  },
	  virtualConsole: createVirtualConsole()
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
	  },
	  virtualConsole: createVirtualConsole()

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
	  },
	  virtualConsole: createVirtualConsole()

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
	    	.wait(function waitCallback() {
	    		t.pass();
	    	})
	    	.start()

	    setTimeout(function(){
	    },200)
	  },
	  virtualConsole: createVirtualConsole()

	});
})

test('wait supports callback and delay', function(t) {
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
	    Baile().select('.elem')
	    .play('someanim', '0.5s')
	    .wait(function() {
	    	t.equal(this.delay, 500)
	    }, '0.5s')
	    .start()
	  },
	  virtualConsole: createVirtualConsole()

	});
})

test('wait executes after animation', function(t){
	t.plan(2)
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
	    		var moreThan1Second = diff >= 1000
	    		t.equals($('.elem')[0].classList.length, 2, 'class applied')
	    		t.ok(moreThan1Second, 'wait waits for the animation to stop')
	    	})
	    	.start()

	    setTimeout(function(){
	    },200)
	  },
	  virtualConsole: createVirtualConsole()

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
	  },
	  virtualConsole: createVirtualConsole()

	});
})

test('Multiple wait callbacks get executed', function(t) {
	t.plan(1)
	jsdom.env({
	  html: `
		<html>
			<body>
				<ul class="items">
					<li class="item">A</li>
					<li class="item">B</li>
					<li class="item">C</li>
					<li class="item">D</li>
					<li class="item">E</li>
				</ul>
			</body>
		</html>
	  `,
	  src: [jquery, Baile],
	  done: function (err, window) {
	    var $ = window.$
	    var document = window.document
	    var Baile = window.Baile
	    var now = new Date()
	    var firstWaitExecuted = false
	    var secondWaitExecuted = false
	    Baile().select('.items')
	    .play('pulse', '1s')
	    .wait(function(){
	    	firstWaitExecuted = true
	    })
	    .select('.items')
	    .playCascade('pulse', '1s')
	    .wait(function(){
	    	secondWaitExecuted = true
	    	t.ok(firstWaitExecuted, 'first wait executed')
	    })
	    .start()
	  },
	  virtualConsole: createVirtualConsole()

	});
})

test('wait with custom delay called before cascade finishes', function (t){
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
	    var cascadeFinished = false

	    var b = Baile().select('.elem')
	    	.playCascade('testanim','1s')
	    	.wait(function() {
	    		var currentTime = new Date()
	    		var diff = currentTime.getTime() -  now.getTime()
	    		//total animation time = 1s x 3
	    		var lessThan3Seconds = diff <= (1000 * 3)
	    		console.log('wait runs, diff:', diff)
	    			    		//t.message(diff)
	    		t.ok(lessThan3Seconds,'wait ends before cascade')
	    	}, '0.5s')
	    	.start()
	  }
	});
})


test('Multiple sequential waits are not supported', function (t){
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
	    try{ 
	    	var b = Baile().select('.elem')
    		.playCascade('testanim','1s')
    		.wait(function() {
    			t.ok('first wait executed')
    		})
    		.wait(function() {
    			t.ok('second wait executed')
    		})
    		.start()
	    }catch(e) {
	    	console.log(e)
	    	t.equals(e.message, 'Only one wait call is supported between play/playCascade calls')
	    }

	  }
	});
})


test('playCascade with custom delay', function (t){
	t.plan(2)
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

	    //using 0s for delay will start inmediately the next
	    //element animation, total time should be approx 1s
	    var b = Baile().select('.elem')
	    	.playCascade('testanim','1s','0s')
	    	.wait(function() {
	    		var currentTime = new Date()
	    		var diff = currentTime.getTime() -  now.getTime()
	    		//For 3 elements more than 3 seconds should have passed
	    		//(each anim is 1 second)
	    		var lessThan05s = diff <= 1500
	    		t.ok(lessThan05s,'cascade total wait should be less than 1.5s')
	    	})
	    	.start()

	   	Baile().select('.elem')
	   		    	.playCascade('testanim','1s','1s')
	   		    	.wait(function() {
	   		    		var currentTime = new Date()
	   		    		var diff = currentTime.getTime() -  now.getTime()
	   		    		//For 3 elements more than 3 seconds should have passed
	   		    		//(each anim is 1 second)
	   		    		var moreThan3Second = diff >= 3000
	   		    		console.log(diff)
	   		    		t.ok(moreThan3Second,'cascade total wait should be more than 3s')
	   		    	})
	   		    	.start()

	  },
	  virtualConsole: createVirtualConsole()

	});
})

test('play without duration parameter defaults to 1s',function(t) {
	t.plan(2)
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

	    //using 0s for delay will start inmediately the next
	    //element animation, total time should be approx 1s
	    var b = Baile().select('.elem')
	    	.play('testanim')
	    	.wait(function() {
	    		var currentTime = new Date()
	    		var diff = currentTime.getTime() -  now.getTime()
	    		//For 3 elements more than 3 seconds should have passed
	    		//(each anim is 1 second)
	    		var approx1sec = Math.abs(diff-1050) < 50
	    		console.log(diff)
	    		t.ok(approx1sec,'default play duration time = 1s')
	    	})
	    	.start()

	   	Baile().select('.elem')
	   		    	.playCascade('testanim','1s','1s')
	   		    	.wait(function() {
	   		    		var currentTime = new Date()
	   		    		var diff = currentTime.getTime() -  now.getTime()
	   		    		//For 3 elements more than 3 seconds should have passed
	   		    		//(each anim is 1 second)
	   		    		var moreThan3Second = diff >= 3000
	   		    		console.log(diff)
	   		    		t.ok(moreThan3Second,'cascade total wait should be more than 3s')
	   		    	})
	   		    	.start()

	  },
	  virtualConsole: createVirtualConsole()

	});
})


test('play supports an array of declarations', function (t){
	
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
	    	.play(['testanim','1s'], ['otheranim', '2s'])
	    	.wait(function() {
	    		var currentTime = new Date()
	    		var diff = currentTime.getTime() -  now.getTime()
	    		//Default wait time should be the largest duration
	    		//from the array of elements
	    		var approx2Sec = Math.abs(diff-2000) < 50
	    		t.ok(approx2Sec,'play time should be 2s (largest value from array)')
	    		t.end()
	    	})
	    	.start()
	  },
	  virtualConsole: createVirtualConsole()

	});
})

test('playCascade supports an array of declarations', function (t){
	/* If an array is passed to playCascade the following should happen
	- each element will run n animations
	- the total duration for each element animation is the MAX duration of the
	  animations in the array
	- The total animation time would be MAX( anim durations)x n
	- The delay used to start animating the next element will be the MAX of the
	  delays used for each animation
	*/
	jsdom.env({
	  html: `
		<html>
			<body>
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
	    	.playCascade(['testanim','1s'], ['otheranim', '2s'])
	    	.wait(function() {
	    		var currentTime = new Date()
	    		var diff = currentTime.getTime() -  now.getTime()
	    		//Default wait time should be the largest duration
	    		//from the array of elements
	    		var approx4Sec = Math.abs(diff-4000) < 50
	    		t.ok(approx4Sec,'total playCascade time should be 4s (Max of durations x n)')
	    		t.end()
	    	})
	    	.start()

	    setTimeout(function(){
	    },200)
	  },
	  virtualConsole: createVirtualConsole()

	});
})

test('delay argument for play supported', function(t) {

})
