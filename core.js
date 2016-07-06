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
  play: function (name, duration, delay, timingFunction) {

    if (Array.isArray(arguments[0])) {
      //An array of elements was passed. 
      //The step will have the 'multiple' flag on
      var animations = []
      for (var i = 0; i < arguments.length; i++) {
        animations.push(arguments[i])
      }
      var step = {
        type: 'play',
        multiple: true, 
        animations: animations,
        group: this.groups[this.currentGroupIndex],
        onStartListeners: [],
        onEndListeners: [],
      }

      console.log('array passed:' + step.animations)

      //Each animation array object will be expected to have:
      //[name, duration, delay OPTIONAL, timingFunction OPTIONAL]
      //calculate duration ms for each anim object
      step.animations.forEach(function(anim) {
        console.log('anim:'+JSON.stringify(anim))
        anim.name = anim[0]
        anim.duration = anim[1]
        anim.delay = anim[2] || 0
        anim.timingFunction = anim[3] || 'linear'
        anim.durationms = this._getMilliseconds(anim.duration),
        anim.delayms = this._getMilliseconds(anim.delay)
      }.bind(this))
      //Because animations are played at the same time, the duration
      //of the step will be the MAX(durationms + delayms)
      step.durationms = getMaxOfArray(animations.map(function(a) {
        return a.durationms + a.delay
      }))
      //The css class generated will contain all the animation declarations
      //So when it's applied, all the animations will run
      this._generateClass(step)
      this.animationSteps.push(step)
      
    } else {
      //Single animation specified
      var step = {
        type: 'play',
        group: this.groups[this.currentGroupIndex],
        'name': stringToId(name),
        'timingFunction': 'linear',
        onStartListeners: [],
        onEndListeners: []
      // TODO: support optional parameters
      }

      step.duration= duration || '1s'
      step.durationms= this._getMilliseconds(step.duration),
      this._generateClass(step)
      this.animationSteps.push(step)
    }

    return this
  },
  // Applies the animation to first elem, wait and then to second...
  // @nextElementDelay: (default will be equals to duration) The
  // time to wait for the next element in the sequence to start being
  // animated
  playCascade: function (name, duration, nextElementDelay, timingFunction) {
    var step = {
      type: 'playCascade',
      'cascade': true,
      'group': this.groups[this.currentGroupIndex],
      'name': stringToId(name),
      'timingFunction': timingFunction || 'linear',
      onStartListeners: [],
      onEndListeners: []
    // TODO: support optional parameters
    }

    step.duration  = duration || 500
    step.durationms = this._getMilliseconds(step.duration)
    step.nextElementDelay =  nextElementDelay || step.duration
    step.nextElementDelayms = this._getMilliseconds(step.nextElementDelay)

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
    if (step.multiple) {
      //When the user passes an array to the play call
      //multiple animations must be run on the elements
      //CSS supports this using the animation property as:
      //animation: first animation config, second animation config;
      var className = step.animations.reduce(function(prev,cur) {
        return prev.name+'_'+cur.name
      })
      // Modify step, set class
      step.className = className + getNewId()
      //Generate the list of animation declarations
      var animationDeclarations = []
      step.animations.forEach(function(anim) {
        var direction = 'forwards'
        animationDeclarations.push([anim.name, anim.durationms + 'ms', anim.delayms + 'ms', anim.timingFunction, direction].join(' '))
      })
      var cssRule = animationDeclarations.join(',')
      var cssClassName = '.' + className
      var cssObj = {}
      cssObj[cssClassName] = {'animation': cssRule, 'opacity': 1}
      var css = restyle(cssObj)
      this.cssClassStack.push(className)
    } else {
      //Single animation
      var className = step.name + getNewId()
      // Modify step, set class
      step.className = className
      var duration = step.durationms + 'ms'
      var delay = step.delayms + 'ms'
      var ease = step.timingFunction
      var direction = 'forwards'
      var cssRule = [step.name, duration, delay, ease, direction].join(' ')
      var cssClassName = '.' + className
      var cssObj = {
      }

      cssObj[cssClassName] = {'animation': cssRule, 'opacity': 1}
      var css = restyle(cssObj)
      this.cssClassStack.push(className)
    }

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
        var prev; //previous play step
        var previousPlayStepIndex = i-1
        //Find closest play step
        do {
          
          prev = this.animationSteps[previousPlayStepIndex]
          if (['play','playCascade'].indexOf(prev.type) >= 0) {
            break
          }
          if (prev.type === 'wait') {
            throw new Error('Only one wait call is supported between play/playCascade calls')
          }
          previousPlayStepIndex--

        }while ( previousPlayStepIndex >= 0)

        prev.nextStepIndex = i + 1
        /* If the wait step has a delay set, then 
           we should not wait until the last step has
           finished. We should instead wait delayms from the moment
           the previous step starts
        */
        
        //The callback called onstart or onend 
        //for the previous step
        var pcallback = (function (waitStep, prevStep) {
          var c =  function() {
            //Run wait user callback
            if (waitStep.cb) {
              waitStep.cb()
            }
            // Run next animation
            self.runStep(prevStep.nextStepIndex)
          }
          //Save the wait specified delay so we can retrieve it when the start callbacks
          //are executed
          c.delay = waitStep.delay
          return c

        })(currentStep, prev)

        if (currentStep.delay) {
          console.log('adding callback to previous onStarTListeners list')
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
      throw new Error('wait should be called after a play or playCascade call')
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
    
    //Execute onStartListeners for the step, use step delay (from wait)
    step.onStartListeners.forEach(function(startListener) {
     
      setTimeout(function () {
        startListener.bind(step)(step, stepIndex)
        //startListener.delay was set in setupWaitCallbacks
        //it was copied from the wait step delay
      },startListener.delay || 0)
    })
 
    var elems = this._getTargetElements(step.group)
    var totalAnimTime = step.cascade ? elems.length * step.nextElementDelayms : step.durationms

    step.elems = elems
    if (step.cascade) {
      var startTime = 0
      elems.forEach(function (elem) {
        setTimeout(function () {
          elem.classList.add(step.className)
        }.bind(this), startTime)

        startTime += step.nextElementDelayms
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
