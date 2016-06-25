
(function() {
	var currentId = 1
function getNewId() {
	return currentId++;
}

function stringToId (str) {
	return str.replace(/\W/g,'_');
}

/* time parse methods from 
   https://github.com/nescalante/timeparse/
*/
var units = {
  μs : 1,
  ms : 1000,
  s  : 1000 * 1000,
  m  : 1000 * 1000 * 60,
  h  : 1000 * 1000 * 60 * 60,
  d  : 1000 * 1000 * 60 * 60 * 24,
  w  : 1000 * 1000 * 60 * 60 * 24 * 7
};



function parse(string, returnUnit) {
  returnUnit = returnUnit || 'ms';

  var totalMicroseconds = 0;

  var groups = string
    .toLowerCase()
    .match(/[-+]?[0-9\.]+[a-z]+/g);


  if (groups !== null) {
    groups.forEach(function (g) {
      var value = g.match(/[0-9\.]+/g)[0];
      var unit = g.match(/[a-z]+/g)[0];

      totalMicroseconds += getMicroseconds(value, unit);
    });
  }

  return totalMicroseconds / units[returnUnit];
}

function getMicroseconds(value, unit) {
  var result = units[unit];

  if (result) {
    return value * result;
  }

  throw new Error('The unit "' + unit + '" could not be recognized');
}
	//https://github.com/WebReflection/restyle/blob/master/build/restyle.js
/*! (C) Andrea Giammarchi Mit Style License */
var restyle=function(e){"use strict";function f(e,t,n,r,i){this.component=e,this.node=t,this.css=n,this.prefixes=r,this.doc=i}function l(e){e instanceof f||(e=a(this.component,e,this.prefixes,this.doc)),this.remove(),f.call(this,e.component,e.node,e.css,e.prefixes,e.doc)}function c(e,t,n){return t+"-"+n.toLowerCase()}function h(e,t,n){var i=[],s=typeof t=="number"?"px":"",o=e.replace(r,c),u;for(u=0;u<n.length;u++)i.push("-",n[u],"-",o,":",t,s,";");return i.push(o,":",t,s,";"),i.join("")}function p(e,t){return e.length?e+"-"+t:t}function d(e,t,r,i){var s,u,a;for(s in r)if(n.call(r,s))if(typeof r[s]=="object")if(o(r[s])){u=r[s];for(a=0;a<u.length;a++)e.push(h(p(t,s),u[a],i))}else d(e,p(t,s),r[s],i);else e.push(h(p(t,s),r[s],i));return e.join("")}function v(e,t,r){var o=[],a,f,l,c,h,p,m,g,y,b;for(m in t)if(n.call(t,m)){b=m.length,b||(m=e.slice(0,-1)),a=m.charAt(0)==="@",p=a||!e.indexOf(m+" "),f=a&&s.test(m)?e:"",l=a&&!i.test(m),c=l?m.slice(1):m,g=u.concat(t[b?m:""]);for(y=0;y<g.length;y++){h=g[y];if(l){b=r.length;while(b--)o.push("@-",r[b],"-",c,"{",v(f,h,[r[b]]),"}");o.push(m,"{",v(f,h,r),"}")}else o.push(p?m:e+m,"{",d([],"",h,r),"}")}}return o.join("")}var t=e.toString,n=e.hasOwnProperty,r=/([a-z])([A-Z])/g,i=/^@(?:page|font-face)/,s=/^@(?:media)/,o=Array.isArray||function(e){return t.call(e)==="[object Array]"},u=[],a;return f.prototype={overwrite:l,replace:l,set:l,remove:function(){var e=this.node,t=e.parentNode;t&&t.removeChild(e)},valueOf:function(){return this.css}},{"undefined":!0}[typeof document]?(a=function(e,t,n){return typeof e=="object"?(n=t,t=e,e=""):e+=" ",v(e,t,n||u)},a.restyle=a):a=function(e,t,n,r){typeof e=="object"?(r=n,n=t,t=e,i=e=""):i=e+" ";var i,s=r||(r=document),o=v(i,t,n||(n=a.prefixes)),u=s.head||s.getElementsByTagName("head")[0]||s.documentElement,l=u.insertBefore(s.createElement("style"),u.lastChild);return l.type="text/css",l.styleSheet?l.styleSheet.cssText=o:l.appendChild(s.createTextNode(o)),new f(e,l,o,n,r)},{"undefined":!0}[typeof window]||(a.animate=function(t){var n=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(e){setTimeout(e,10)},r={},i="restyle-".concat(Math.random()*+(new Date),"-"),s=0,o,u;switch(!0){case!!t.AnimationEvent:o="animationend";break;case!!t.WebKitAnimationEvent:o="webkitAnimationEnd";break;case!!t.MSAnimationEvent:o="MSAnimationEnd";break;case!!t.OAnimationEvent:o="oanimationend"}switch(!0){case!!t.TransitionEvent:u="transitionend";break;case!!t.WebKitTransitionEvent:u="webkitTransitionEnd";break;case!!t.MSTransitionEvent:u="MSTransitionEnd";break;case!!t.OTransitionEvent:u="oTransitionEnd"}a.transition=function(e,t,o){function b(){u?e.removeEventListener(u,E,!1):(clearTimeout(y),y=0)}function w(){d[v]=g.last=S(h,c.shift()),g.css.replace(d),u?e.addEventListener(u,E,!1):y=setTimeout(E,10)}function E(t){b(),c.length?n(w):(t?t.detail=m:t=new CustomEvent("transitionend",{detail:m}),o&&o.call(e,t))}function S(e,t){for(var n in t)e[n]=t[n];return e}var f=t.transition||"all .3s ease-out",l=e.getAttribute("id"),c=[].concat(t.to),h=S({},t.from),p=!l,d={},v,m,g,y;return p&&e.setAttribute("id",l=(i+s++).replace(".","-")),v="#"+l,r.hasOwnProperty(l)?(g=r[l],h=g.last=S(g.last,h),d[v]=h,g.transition.remove(),g.css.replace(d)):g=r[l]={last:d[v]=h,css:a(d)},n(function(){d[v]={transition:f},g.transition=a(d),n(w)}),m={clean:function(){p&&e.removeAttribute("id"),b(),g.transition.remove(),g.css.remove(),delete r[l]},drop:b}},f.prototype.getAnimationDuration=function(e,t){for(var n,r,i=e.className.split(/\s+/),s=i.length;s--;){n=i[s];if(n.length&&(new RegExp("\\."+n+"(?:|\\{|\\,)([^}]+?)\\}")).test(this.css)){n=RegExp.$1;if((new RegExp("animation-name:"+t+";.*?animation-duration:([^;]+?);")).test(n)||(new RegExp("animation:\\s*"+t+"\\s+([^\\s]+?);")).test(n)){n=RegExp.$1,r=parseFloat(n);if(r)return r*(/[^m]s$/.test(n)?1e3:1)}}}return-1},f.prototype.getTransitionDuration=function(e){var t=getComputedStyle(e),n=t.getPropertyValue("transition-duration")||/\s(\d+(?:ms|s))/.test(t.getPropertyValue("transition"))&&RegExp.$1;return parseFloat(n)*(/[^m]s$/.test(n)?1e3:1)},f.prototype.transit=u?function(e,t){function n(n){r(),t.call(e,n)}function r(){e.removeEventListener(u,n,!1)}return e.addEventListener(u,n,!1),{drop:r}}:function(e,t){var n=setTimeout(t,this.getTransitionDuration(e));return{drop:function(){clearTimeout(n)}}},f.prototype.animate=o?function(t,n,r){function i(e){e.animationName===n&&(s(),r.call(t,e))}function s(){t.removeEventListener(o,i,!1)}return t.addEventListener(o,i,!1),{drop:s}}:function(n,r,i){var s,o,u=this.getAnimationDuration(n,r);return u<0?o=e:(s=setTimeout(function(){i.call(n,{type:"animationend",animationName:r,currentTarget:n,target:n,stopImmediatePropagation:e,stopPropagation:e,preventDefault:e})},u),o=function(){clearTimeout(s)}),{drop:o}}}(window)),a.customElement=function(e,t,n){var r,i="extends",s=Object.create(t.prototype),o={prototype:s},u=o.hasOwnProperty,f=n&&u.call(n,i);f&&(o[i]=n[i]);for(r in n)r!==i&&(s[r]=r==="css"?a(f?n[i]+"[is="+e+"]":e,n[r]):n[r]);return document.registerElement(e,o)},a.prefixes=["webkit","moz","ms","o"],a}({});
	
function Scene(){
    if(!(this instanceof Scene)){
        return new Scene()
    }
    this.groups = [];
    this.currentGroupIndex = -1;
    this.animationSteps = [];
    this.cssClassStack = [];
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
            type:'play',
            group: this.groups[this.currentGroupIndex],
            'name': stringToId(name),
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
            type:'playCascade',
            'cascade': true,
            'group': this.groups[this.currentGroupIndex],
            'name': stringToId(name),
            'duration': duration,
            'durationms' : this._getMilliseconds(duration),
            'easing' : easing
            //TODO: support optional parameters
        }

        this._generateClass(step)

        this.animationSteps.push(step)

        return this;

    },
    reset: function() {
        //reset elements
        this.cssClassStack.forEach(function(cname) {
            document.querySelectorAll('.'+cname).forEach(function(elem) {
                elem.classList.remove(cname)
            })
        })
        this.animationSteps = []
        this.currentGroupIndex = -1
        this.groups = []
    },
    _getMilliseconds: function(value) {
        if (typeof value == 'number')
            return value
        //let timeparse handle the conversion to ms
        return parse(value)
    },

    //Genera la clase css con la regla de animación
    _generateClass: function(step) {
        var className = step.name + getNewId()
        //Modify step, set class
        step.className = className
        var duration = step.durationms + 'ms'
        var ease = step.easing
        var direction = 'forwards'
        var cssRule = [step.name, duration, ease, direction].join(' ')
        var cssClassName = '.' + className
        var cssObj = {
        }

        cssObj[cssClassName] = {'animation': cssRule, 'opacity': 1}
        var css = restyle(cssObj)
        this.cssClassStack.push(className)

    },

    wait:function(cb){
        this.animationSteps.push({
            type:'wait',
            cb: cb || new Function()
        })

        return this;

    },
    clear: function(cb) {
        this.animationSteps.push({
            type:'clear',
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
        this.setupWaitCalls()
        this.runStep(0)

        return this;
    },

    setupWaitCalls: function() {
        var self = this;
        for(var i=0; i< this.animationSteps.length ; i++){
            var currentStep = this.animationSteps[i];
            var currentStepIndex = i;
            if(currentStep.type === 'wait'){
                console.log('Wait found')
                //TODO: validar que exista una animacion previa
                //TODO: soportar varios play antes de wait
                var prev = this.animationSteps[i-1];
                prev.nextStepIndex = i+1;
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
    },
    runStep:function(stepIndex){
        if(stepIndex >= this.animationSteps.length)
            return;

        var step = this.animationSteps[stepIndex]
        var self = this;

        //If a wait is found, exit, the previous
        //step should have an attached callback that continues
        if(step.type === 'wait')
        {
            throw new Error('wait should be called after a play or playCascade method has been called')
        }

        if (step.type === 'clear') {
            var className = this.cssClassStack.shift()
            console.log('clear', className)
            var lastPlayStep  = this._getLastPlayStep(stepIndex);
            if (!lastPlayStep) {
                throw new Error('play or playCascade must be called before clear')
            }
            //Remove generated classes from elements
            lastPlayStep.elems.forEach(function(elem) {
                elem.classList.remove(className);
            })
            self.runStep(stepIndex + 1)

            return
        }
        //TODO: Aquí aplicar la animación
        
        var animTime = step.durationms; //TODO: extraer tiempo de animación

        //Aplicar la clase que contiene la animación.
        var elems = this._getTargetElements(step.group)
        step.elems = elems
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
    _getLastPlayStep: function(index) {
        //Given an index return the last action of type
        //play or playCascade
        while( index >= 0 ) {
            if (this.animationSteps[index].type === 'play'
                || this.animationSteps[index].type === 'playCascade' ) {
                return this.animationSteps[index]
        }
        index--
    }
    return null
},

_getTargetElements : function( group ) {

    if( typeof group === 'string'){
            //String DOM selector
            return  Array.prototype.slice.call( document.querySelectorAll( group ), 0 )
        } else if ( window.jQuery && group instanceof jQuery) {
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

//support for node
if(typeof exports === "object" && exports) {  
    module.exports = Scene;
} else {
    window.Baile = Scene
}

})();
