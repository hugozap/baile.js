var Scene = require('./choreo.js')
var insertCss = require('insert-css')
var domReady = require('domready')
var domify = require('domify')
var fs = require('fs')
var svgContent = fs.readFileSync(__dirname + '/scene.svg', 'utf8');
var svgDom = domify(svgContent)

var s = new Scene();
s.select('.box')
.play('zoomInDown','3000ms','cubic-bezier(0.200, 1.305, 0.775, -0.415)')
.wait()
.playCascade('bounce','350ms', 'ease-in')
.wait()
.playCascade('rubberBand', '200ms', 'ease-in')
.wait()
.playCascade('swing', '1500ms', 'cubic-bezier(0.200, 1.305, 0.775, -0.415)')
.wait()
.play('wobble', '300ms', 'ease-in')
.wait()
.playCascade('ripple', '400ms', 'ease-in')


var s2 = new Scene()
s2
.select('path.smoke')
.play('border', 4000, 'ease-in')
.wait()
 .select('.smoke')
 .play('fadeInDown',2000, 'ease-in')
 .select('.nave')
 .play('bounceInDown',2000, 'ease-in')
 .wait()
 .play('bounce', 2000, 'ease-in')
 .wait()
 .play('rotateLeft', 2000, 'ease-in')
 .wait()
 .play('rubberBand', 2000, 'ease-in')



 

domReady(function(){
	document.querySelector('.ship').appendChild(svgDom)
	setTimeout(function(){
		s.start();
		s2.start()
	});
})