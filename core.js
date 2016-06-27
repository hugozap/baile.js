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
      'easing': easing
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
      'easing': easing
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

  wait: function (cb) {
    this.animationSteps.push({
      type: 'wait',
      cb: cb || new Function()
    })

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

        prev.callback = function () {
          //Run wait callback
          if (currentStep.cb) {
            currentStep.cb()
          }
          // Run next animation
          self.runStep(this.nextStepIndex)
        }.bind(prev)
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
    // TODO: Aquí aplicar la animación

    var animTime = step.durationms; // TODO: extraer tiempo de animación

    // Aplicar la clase que contiene la animación.
    var elems = this._getTargetElements(step.group)
    step.elems = elems
    if (step.cascade) {
      var startTime = 0
      var cascadeDuration = elems.length * step.durationms

      elems.forEach(function (elem) {
        setTimeout(function () {
          elem.classList.add(step.className)
        }.bind(this), startTime)

        startTime += step.durationms
      })
      // When cascade ends call callback ( once for all cascade)
      if (step.callback) {
        setTimeout(function () {
          step.callback()
        }, cascadeDuration)
      }else {
        self.runStep(stepIndex + 1)
      }
    } else {
      // Not cascade
      elems.forEach(function (elem) {
        elem.classList.add(step.className)
      })
      if (step.callback) {
        setTimeout(function () {
          step.callback()
        }, animTime)
      }else {
        self.runStep(stepIndex + 1)
      }
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
