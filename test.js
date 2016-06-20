var Scene = require('./choreia.js')
var anim = new Scene()
//TODO: cambiar forma de instanciar
//solo con anim()
var root = document.body
window.$ = require('jquery')

// este es el espacio de trabajo
// correr con wzrd index
function animate() {
	console.log('will animate')
	anim.select('.item')
		.play('wobble', '300ms', 'ease-in')
		.clear()
		.wait()
		.select('.item2')
		.play('wobble', '300ms', 'ease-in')
		.clear()

	anim.start()
}

var markup = `
	<link rel="stylesheet" href="./animate.css" />
	<ul>
		<li class="item"> item 1 </li>
		<li class="item2"> item 2 </li>
		<li> item 3 </li>
	</ul>
	<button id="btn1">Animate</button>
	`



$('<div>').html(markup).appendTo(document.body)

$(function() {
	$('#btn1').click(function(){
		animate();
	})
})

