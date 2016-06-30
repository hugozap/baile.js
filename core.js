function Scene () {
  if (!(this instanceof Scene)) {
    return new Scene()
  }
  this.groups = []
  this.currentGroupIndex = -1
  this.animationSteps = []
  this.cssClassStack = []
  return this
}

Scene.prototype = {
  select: function (group) {
    // TODO: support multiple elements
    this.groups.push(group)
    this.currentGroupIndex++
    return this
  },
  play: function (name, duration, easing) {
    var step = {
      type: 'play',
      group: this.groups[this.currentGroupIndex],
      'name': stringToId(name),
      'duration': duration,
      'durationms': this._getMilliseconds(duration),
      'easing': easing,
      onStartListeners: [],
      onEndListeners: []
    // TODO: support optional parameters
    }

    this._generateClass(step)

    this.animationSteps.push(step)

    return this
  },
  // Applies the animation to first elem, wait and then to second...
  playCascade: function (name, duration, easing) {
    var step = {
      type: 'playCascade',
      'cascade': true,
      'group': this.groups[this.currentGroupIndex],
      'name': stringToId(name),
      'duration': duration,
      'durationms': this._getMilliseconds(duration),
      'easing': easing || 'linear',
      onStartListeners: [],
      onEndListeners: []
    // TODO: support optional parameters
    }

    this._generateClass(step)

    this.animationSteps.push(step)

    return this
  },
  reset: function () {
    // resets all the elements state
    var step = {
      type: 'reset'

    }
    this.animationSteps.push(step)

    return this
  },
  _getMilliseconds: function (value) {
    if (typeof value == 'number')
      return value
    // let timeparse handle the conversion to ms
    return parse(value)
  },

  // Genera la clase css con la regla de animación
  _generateClass: function (step) {
    var className = step.name + getNewId()
    // Modify step, set class
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

  /* cb[optional]: callback executed when the wait period is over
     delay[optional]: if specified, executes the callback after the delay time
     , by default delay === last step duration
 */
  wait: function (cb, delay) {
    //only delay was set as argument

    var delayms = null
    if (['string','number'].indexOf(typeof cb) > -1) {
      delayms = this._getMilliseconds(cb)
    } else if (['string','number'].indexOf(typeof delay) > -1) {

      delayms = this._getMilliseconds(delay)
    }
    var cb = typeof cb === 'function' ? cb:  new Function()
    var step = {
      type: 'wait',
      cb: cb ,
      delay: delayms
    }
    this.animationSteps.push(step)
    return this
  },
  clear: function (cb) {
    this.animationSteps.push({
      type: 'clear',
      cb: cb || new Function()
    })

    return this
  },

  start: function () {
    var time = 0
    var self = this
    this.setupWaitCalls()
    this.runStep(0)

    return this
  },

  setupWaitCalls: function () {
    var self = this
    for (var i = 0; i < this.animationSteps.length; i++) {
      var currentStep = this.animationSteps[i]
      var currentStepIndex = i
      if (currentStep.type === 'wait') {

        // TODO: validar que exista una animacion previa
        // TODO: soportar varios play antes de wait
        var prev = this.animationSteps[i - 1]
        prev.nextStepIndex = i + 1
        /* If the wait step has a delay set, then 
           we should not wait until the last step has
           finished. We should instead wait delayms from the moment
           the previous step starts
        */
        
        //The callback called onstart or onend 
        //for the previous step
        var pcallback = (function (waitStep, prevStep) {
          return function() {
            //Run wait user callback
            if (waitStep.cb) {
              waitStep.cb()
            }
            // Run next animation
            self.runStep(prevStep.nextStepIndex)
          }

        })(currentStep, prev)

        if (currentStep.delayms) {
          //add to listeners executed on start
          prev.onStartListeners.push(pcallback)
        } else {
          //add to listeners executed on end
          prev.onEndListeners.push(pcallback)
        }
      }
    }
  },
  runStep: function (stepIndex) {
    if (stepIndex >= this.animationSteps.length)
      return
    var step = this.animationSteps[stepIndex]
    var self = this

    // If a wait is found, exit, the previous
    // step should have an attached callback that continues
    if (step.type === 'wait') {
      throw new Error('wait should be called after a play or playCascade method has been called')
    }

    if (step.type === 'clear') {
      var className = this.cssClassStack.shift()
      var lastPlayStep = this._getLastPlayStep(stepIndex)
      if (!lastPlayStep) {
        throw new Error('play or playCascade must be called before clear')
      }
      // Remove generated classes from elements
      lastPlayStep.elems.forEach(function (elem) {
        elem.classList.remove(className)
      })
      self.runStep(stepIndex + 1)

      return
    }

    if (step.type === 'reset') {

      // reset elements
      this.cssClassStack.forEach(function (cname) {
        document.querySelectorAll('.' + cname).forEach(function (elem) {
          elem.classList.remove(cname)
        })
      })
      this.animationSteps = []
      this.currentGroupIndex = -1
      this.groups = []
      return
    }

    //for play and playCascade steps:
    
    //Execute onStartListeners for the step
    step.onStartListeners.forEach(function(startListener) {
      setTimeout(function () {
        startListener.bind(step)(step, stepIndex)
      },0)
    })
 
    var elems = this._getTargetElements(step.group)
    var totalAnimTime = step.cascade ? elems.length * step.durationms : step.durationms

    step.elems = elems
    if (step.cascade) {
      var startTime = 0
      elems.forEach(function (elem) {
        setTimeout(function () {
          elem.classList.add(step.className)
        }.bind(this), startTime)

        startTime += step.durationms
      })
      
    } else {
      // Not cascade
      elems.forEach(function (elem) {
        elem.classList.add(step.className)
      })
      
    }
    // Execute onEndListeners when step completes
    step.onEndListeners.forEach(function(endListener) {
      setTimeout(function () {
        endListener.bind(step)(step, stepIndex)
      }, totalAnimTime)
    })

    //If there are not start/endListeners run the next step
    //this will happen asynchronously so
    // multiple play or playCascade calls will start
    // at the same time
    //TODO: onStartListeners is not needed, it will only have 1 item
    //go back to startCallback, endCallback?
    if (step.onEndListeners.length === 0  && step.onStartListeners.length === 0) {
      this.runStep(stepIndex+1)
    }

  },
  _getLastPlayStep: function (index) {
    // Given an index return the last action of type
    // play or playCascade
    while(index >= 0) {
      if (this.animationSteps[index].type === 'play'
        || this.animationSteps[index].type === 'playCascade') {
        return this.animationSteps[index]
      }
      index--
    }
    return null
  },

  _getTargetElements: function (group) {
    if (typeof group === 'string') {
      // String DOM selector
      return Array.prototype.slice.call(document.querySelectorAll(group), 0)
    } else if (window.jQuery && group instanceof jQuery) {
      // Is a jquery wrapped element?
      return Array.prototype.slice.call(group)
    } else if (group instanceof NodeList) {
      // Node list (from document.querySelectorAll)
      return Array.prototype.slice.call(group)
    } else if (group instanceof Node) {
      // It's just one element return it wrapped as array
      return [group]
    }
  }
}

// support for node
if (typeof exports === 'object' && exports) {
  module.exports = Scene
} else {
  window.Baile = Scene
}
