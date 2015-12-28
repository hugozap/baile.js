var test = require('tape')
var Choreia = require('../index.js')

test('Select works with jquery wrapped object', function(t){

})


test('Select works with DomList object', function(t){

})

test('Play plays animation', function(t){
	var elem = document.querySelector('#elem')
	t.plan(1)
	var c = Choreia()
	c.select('#elem').play('moveright', '5ms','ease')
	c.start()
	setTimeout(function(){
		t.equal(elem.style.left, '20px', 'Move to left')
	}, 100)
})

test('wait, waits until animation ends', function(t) {

})

test('select works with DOM node', function(t) {

})

test('playCascade works with animation name and time', function (t){

})

test('playCascade custom delay set', function(t) {

})

test('play end callback is called', function(t) {

})

test('playCascade end callback is called', function(t) {

})

test('play end callback is called', function(t) {

})