/* Scene ( Choreography animation ) */
var restyle = require('restyle')
var Guid = require('node-uuid')
var insertCss = require('insert-css')
var timeparse = require('timeparse')

var util = require('util')
module.exports = Scene

function Scene(){
	if(!(this instanceof Scene)){
		return new Scene()
	}
	this.groups = [];
	this.currentGroupIndex = -1;
	this.animationSteps = [];
	return this;

}

Scene.prototype = {
	select:function(group){
		//TODO: support multiple elements
		this.groups.push(group);
		this.currentGroupIndex++;
		return this;
	},

	play:function(name, duration, easing){

		var step = {
			group: this.groups[this.currentGroupIndex],
			'name': name,
			'duration': duration,
			'durationms' : this._getMilliseconds(duration),
			'easing' : easing
			//TODO: support optional parameters
		}

		this._generateClass(step);

		this.animationSteps.push(step)

		return this;
	},
	//Applies the animation to first elem, wait and then to second...
	playCascade:function(name, duration, easing){

		var step = {
			'cascade': true,
			'group': this.groups[this.currentGroupIndex],
			'name': name,
			'duration': duration,
			'durationms' : this._getMilliseconds(duration),
			'easing' : easing
			//TODO: support optional parameters
		}

		this._generateClass(step)

		this.animationSteps.push(step)

		return this;

	},

	_getMilliseconds: function(value) {
		if (typeof value == 'number')
			return value
		//let timeparse handle the conversion to ms
		return timeparse(value)
	},

	//Genera la clase css con la regla de animación
	_generateClass: function(step) {
		var className = step.name + Guid.v4()
		//Modify step, set class
		step.className = className
		var duration = step.durationms + 'ms'
		var ease = step.easing
		var direction = 'forwards'
		var cssRule = util.format('%s %s %s %s', step.name, duration, ease, direction )
		var cssClassName = '.' + className
		var cssObj = {
		}

		cssObj[cssClassName] = {'animation': cssRule, 'opacity': 1}
		var css = restyle(cssObj)

	},

	wait:function(cb){
		this.animationSteps.push({
			type:'wait',
			cb: cb || new Function()
		})

		return this;

	},

	start:function(){
		//Create graph or state machine here
		var time = 0;
		var self = this;
		//1. set wait callbacks
		console.log('Setting wait callbacks')
		console.log(this.animationSteps)
		for(var i=0; i< this.animationSteps.length ; i++){
			var currentStep = this.animationSteps[i];
			var currentStepIndex = i;
			if(currentStep.type === 'wait'){
				console.log('Wait found')
				//TODO: validar que exista una animacion previa
				//TODO: soportar varios play antes de wait
				var prev = this.animationSteps[i-1];
				prev.nextStepIndex = i+1;
				console.log('When previous callback runs, run:')
				console.log(self.animationSteps[prev.nextStepIndex])

				prev.callback = function(){
					console.log('animation callback called, running next step')
					if(this.cb){
						this.cb();
					}
					//Run next animation
					self.runStep(this.nextStepIndex);
				}.bind(prev);
			}
		}

		this.runStep(0);

		return this;


	},

	runStep:function(stepIndex){
		if(stepIndex >= this.animationSteps.length)
			return;

		var step = this.animationSteps[stepIndex]
		console.log('runStep called', stepIndex)
		console.log(step)

		var self = this;

		//If a wait is found, exit, the previous
		//step should have an attached callback that continues
		if(step.type === 'wait')
			return;

		console.log('running step:', stepIndex);
		console.log(this.animationSteps[stepIndex]);

		//TODO: Aquí aplicar la animación
		
		var animTime = step.durationms; //TODO: extraer tiempo de animación

		//Aplicar la clase que contiene la animación.
		var elems = this._getTargetElements(step.group)
		if (step.cascade) {
			var startTime = 0;
			var cascadeDuration = elems.length * step.durationms
			console.log('cascadeDuration ', cascadeDuration)
			elems.forEach(function(elem) {
				console.log('cascade startTime ', startTime)

				setTimeout( function(){
					console.log('-> applying class to element in cascade')
					elem.classList.add( step.className )
					
				}.bind(this), startTime )

				startTime += step.durationms
			})
			//When cascade ends call callback ( once for all cascade)
			if(step.callback){
				setTimeout(function(){
					step.callback();
				}, cascadeDuration);
			}else{
				self.runStep(stepIndex + 1)
			}
		} else {
			//Not cascade
			elems.forEach(function(elem) {
				elem.classList.add( step.className )
			})
			if(step.callback){
				setTimeout(function(){
					step.callback();
				}, animTime);
			}else{
				self.runStep(stepIndex + 1)
			}
		}


		
	},

	_getTargetElements : function( group ) {
		
		if( typeof group === 'string'){
			//String DOM selector
			return  Array.prototype.slice.call( document.querySelectorAll( group ), 0 )
		} else if ( group instanceof jQuery) {
			//Is a jquery wrapped element?
			return Array.prototype.slice.call(group)
		} else if (group instanceof NodeList) {
			//Node list (from document.querySelectorAll)
			return Array.prototype.slice.call(group)
		} else if( group instanceof Node) {
			//It's just one element return it wrapped as array
			return [group]
		}
	}
}
if(window){
	window.Choreia = Scene
}
