class MenuClass{
   lock = true
   flatMode = true
   condition = {
      click: true,
      wheel: true,
      swipe: true,
   }
   frames = document.querySelectorAll('.frame')
   container = document.querySelector('.container')
   arrowBtns = document.querySelectorAll('.arrow')
   controllersBtn = document.querySelectorAll('.slider-mode .switch')

   returnToStartI(returnBtn){
      returnBtn.onpointerdown = e => {
         returnBtn.classList.toggle('active')
         this.lock = !this.lock
      }
   }

   controllersI(){
      const [switch1, switch2, switch3] = this.controllersBtn

      switch1.onpointerdown = e => {
         changeClass(switch1)
         this.condition.click = !this.condition.click
      }
      switch2.onpointerdown = e => {
         changeClass(switch2)
         this.condition.wheel = !this.condition.wheel
      }
      switch3.onpointerdown = e => {
         changeClass(switch3)
         this.condition.swipe = !this.condition.swipe
      }

      const changeClass = (element) => element.classList.toggle('active')
   }

   sensitivityI(sensitivityBtn){
      const [switch1, switch2] = sensitivityBtn
      const spanValue = document.querySelector('.slider-sensitive .span-value')
      const calcSlidePos = new CalcSlidePos()

      switch1.onpointerdown = e => {
         prevDef(e)
         const content = spanValue.textContent
         const value = content
         changeContent(+value + .5)
      }
      switch2.onpointerdown = e => {
         prevDef(e)
         const content = spanValue.textContent
         const value = content
         if(value - 1 > 0) changeContent(value - .5)
      }

      const prevDef = e => e.preventDefault()
      const changeContent = (value) => {
         calcSlidePos.sensitivity = value
         spanValue.innerHTML = value
      }
   }

   // verAndflatModeI(verHorBtn){
      // verHorBtn.onpointerdown = e => {
      //    verHorBtn.classList.toggle('active')
      //    this.container.classList.toggle('vertical')

      //    this.frames.forEach(item => {
      //       item.classList.toggle('vertical')
      //    })
      // }
   // }

   volumetricAndFlatI(volFlatBtn){
      const calcSlidePos = new CalcSlidePos()

      volFlatBtn.onpointerdown = e => {
         volFlatBtn.classList.toggle('active')
         this.container.classList.toggle('position-3d')
         this.flatMode = !this.flatMode
         
         this.frames.forEach(item => item.classList.toggle('position-3d'))

         if(this.flatMode) {
            calcSlidePos.framesEffects()
            calcSlidePos.initFramesPos()
            calcSlidePos.DOMPositionFrames()
         }
         else {
            calcSlidePos.DOMPositionFrames()
         }
         this.toggleOtherSwitches()
      }
   }

   toggleOtherSwitches(){
      const [switch1, switch2, switch3] = this.controllersBtn

      this.arrowBtns[0].classList.toggle('disable')
      this.arrowBtns[1].classList.toggle('disable')
      switch1.classList.toggle('disable')
      switch3.classList.toggle('disable')
   }
}
const menuClass = new MenuClass()

class CalcAngleClass{
   container = document.querySelector('.container')

   checkValue(value){return value < 0 ? 0 : value > 360 ? 360 : value}

   calcAngle(value){
      const calcSlidePos = new CalcSlidePos()
      const minOfResultArr = Math.min(...calcSlidePos.minmaxResultFunc())
      const position = (window.innerWidth - minOfResultArr) / 2

      if(value !== 0) document.querySelector('.wrapper').style.cssText = `--contPosition: ${window.innerWidth / 3}px;`
      else if(value === 0) document.querySelector('.wrapper').style.cssText = `--contPosition: ${position}px`
      this.container.style.cssText = `--rotateD: ${value}`
   }
}
const calcAngleClass = new CalcAngleClass()

class CalcSlidePos{
   frames = document.querySelectorAll('.frame')
   container = document.querySelector('.container')
   position = []
   position3d = []
   lockToReturn = true
   remDeltaY = 0
   smootingIndex = 0
   remPosition = 0
   itemIndex = 0
   resetDOMLock = true

   initContainerPosition(){
      const minOfResultArr = Math.min(...this.minmaxResultFunc())
      const position = (window.innerWidth - minOfResultArr) / 2

      document.querySelector('.wrapper').style.cssText = `--contPosition: ${position}px`
      this.initFramesPos()
   }

   initFramesPos(){
      this.frames.forEach((item, index) => {
         this.position[index] = 0
         if(index !== 0) item.classList.add('turned-right')
      })
   }

   calcClickPrev(){
      const lockToReturn = menuClass.lock
      const minOfResultArr = Math.min(...this.minmaxResultFunc())
   
      this.frames.forEach((item, index) => {
         const char = this.position[index]
         const width = item.clientWidth
         const minus = width - minOfResultArr
         const divider = (this.frames.length - 2) * -1
         const expresMinus = width - minus
         const positiveDeltaY = Math.abs(this.remDeltaY)

         if(lockToReturn && char - expresMinus > minOfResultArr * -2 && this.remDeltaY === 0){
            this.refreshFramesEffects()
            return this.position[index] = expresMinus * (divider - 1)
         }
         else if((char - width + minus) + (expresMinus + this.remDeltaY) === 0 && this.itemIndex > 0) this.position[index] += ((this.itemIndex * minOfResultArr) - minOfResultArr - positiveDeltaY) * -1
         else if((char - width + minus) + (expresMinus + this.remDeltaY) === 0) this.position[index] += positiveDeltaY
         else if(char - width < minOfResultArr * -1 && Math.sign(this.remDeltaY) === 1) this.position[index] += this.remDeltaY
         else if(char - width < minOfResultArr * -1) this.position[index] += minOfResultArr + this.remDeltaY
         else return
      })

      this.calcItemIndex()
      this.remDeltaY = 0
      return this.DOMPositionFrames()
   }
   calcClickNext(){
      const minOfResultArr = Math.min(...this.minmaxResultFunc())
      const lockToReturn = menuClass.lock
   
      this.frames.forEach((item, index) => {
         const char = this.position[index]
         const width = item.clientWidth
         const minus = width - minOfResultArr
         const divider = (this.frames.length - 2) * -1
         const expresMinus = width - minus
         const sign = Math.sign(this.remDeltaY)
         const maxIndexPos = this.itemIndex * minOfResultArr + minOfResultArr

         if(lockToReturn && char - minOfResultArr <= expresMinus * (divider - 2)){
            this.refreshFramesEffects()
            return this.position[index] = 0
         }
         else if(char - this.remDeltaY < expresMinus * divider && sign === -1) return this.position[index] += this.remDeltaY
         else if(char * -1 < maxIndexPos - minOfResultArr) return this.position[index] -= (maxIndexPos - minOfResultArr) - char * -1
         else if(char * -1 < maxIndexPos) return this.position[index] -= maxIndexPos + char
         else return
   
      })

      this.calcItemIndex()
      this.remDeltaY = 0
      return this.DOMPositionFrames()
   }

   calcWheel(e){
      const flatMode = menuClass.flatMode
      const {deltaY} = e
      const minOfResultArr = Math.min(...this.minmaxResultFunc())
      const sensitivity = document.querySelector('.slider-sensitive .span-value').textContent
      this.remDeltaY += deltaY

      if(!((!flatMode || flatMode) && navigator.maxTouchPoints > 0)){
         this.frames.forEach((item, index) => {
            const char = flatMode ? this.position[index] : this.position3d[index]
            const width = item.clientWidth
            const minus = width - minOfResultArr
            const divider = (this.frames.length - 2) * -1
            const expresMinus = width - minus
   
            const flatTrue = {
               start: (char === 0 && deltaY >= 100) || (char > -100 && deltaY >= 100),
               end: char - 100 < expresMinus * (divider - 1) && deltaY === -100,
            }
            const flatFalse = {
               start: char <= expresMinus * -index && deltaY <= -100,
               end: this.position3d[index] >= expresMinus * (-(divider - 1) - index) && deltaY >= 100,
            }
   
            const conditionStart = flatMode ? flatTrue.start : flatFalse.start
            const conditionEnd = flatMode ? flatTrue.end : flatFalse.end
   
            if(conditionStart){
               this.remDeltaY = 0
               return flatMode ? this.position[index] = 0 : this.position3d[index] = expresMinus * -index
            }
            else if(conditionEnd){
               const result = flatMode ? minOfResultArr * (divider - 1) : expresMinus * (-(divider - 1) - index)
               this.remDeltaY = 0
               return flatMode ? this.position[index] = result : this.position3d[index] = result
            }
            else {
               const result = flatMode ? deltaY : deltaY * 2 * sensitivity
               if(isNaN(result)) flatMode ? this.position[index] += this.position[index] * -1 : this.position3d[index] = expresMinus * -index
               else flatMode ? this.position[index] += result : this.position3d[index] += result
            }
   
            if(!flatMode && char + deltaY * 2 * sensitivity > expresMinus / 2) item.classList.add('hidden')
            else item.classList.remove('hidden')
         })

         this.calcItemIndex()
         return this.DOMPositionFrames()
      }
   }

   calcPointerEvents(e){
      const downX = e.clientX
      const downY = e.clientY
      let moveX = 0
      let moveY = 0
      const minOfResultArr = Math.min(...this.minmaxResultFunc())
      const sensitivity = document.querySelector('.slider-sensitive .span-value').textContent
      const {target} = e
      const itemT = document.querySelectorAll('.item')
      const containerT = document.querySelectorAll('.container')
      const wrapperT = document.querySelectorAll('.wrapper')
      const fewArrays = [...this.frames, ...itemT, ...containerT, ...wrapperT]
      const comparedTargetRes = comparedTarget()
      const flatMode = menuClass.flatMode
      const maxIndexPos = this.itemIndex * minOfResultArr + minOfResultArr

      if(!flatMode && this.resetDOMLock && this.position3d.length === 0){
         this.frames.forEach((item, index) => {
            this.position3d[index] = minOfResultArr * -index
            item.style.cssText = `--position: ${minOfResultArr * -index}px;`
            this.refreshFramesEffects()
         })
         this.resetDOMLock = false
      }
      else this.resetDOMLock = true


      window.onpointermove = e => {
         e.preventDefault()
         moveX = e.clientX
         moveY = e.clientY
         const expression = flatMode ? downX - moveX : downY - moveY

         if(!(!flatMode && navigator.maxTouchPoints === 0)) this.frames.forEach((item, index) => {
            const char = flatMode ? this.position[index] : this.position3d[index]
            const result = flatMode ? char + (downX - moveX) / -2 * sensitivity : char + (downY - moveY) * -sensitivity
            const string = `--position: ${result}px; --transition: .5s linear;`

            if(comparedTargetRes) item.style.cssText = string
            else return

            if(!flatMode && char + (-expression * sensitivity) > minOfResultArr / 2.5) item.classList.add('hidden')
            else item.classList.remove('hidden')
         })
      }
      window.onpointerup = e => {
         const upX = e.clientX
         const upY = e.clientY
         const expression = flatMode ? downX - moveX : downY - moveY
         const minForSwipe = flatMode ? (window.innerWidth / 2) / 1.5 / sensitivity : window.innerHeight / 2 / sensitivity
         if((downX !== upX || downY !== upY) && !(!flatMode && navigator.maxTouchPoints === 0) && comparedTargetRes) this.frames.forEach((item, index) => {
            const char = flatMode ? this.position[index] : this.position3d[index]
            const width = item.clientWidth
            const minus = width - minOfResultArr
            const divider = (this.frames.length - 2) * -1
            const expresMinus = width - minus

            const flatTrue = {
               condition: flatMode && comparedTargetRes,
               start: expression * -1 > minForSwipe && char < 0,
               end: expression > minForSwipe && char > expresMinus * (divider - 1),
            }
            const flatFalse = {
               condition: !flatMode && comparedTargetRes,
               start: (char >= minOfResultArr * -index && -expression > 0) || ((char > minOfResultArr * -index && -expression < 0) && -expression < 0),
               end: (char < minOfResultArr * (-(divider - 1) - index) && -expression > 0) || (char <= minOfResultArr * (-(divider - 1) - index) && -expression < 0),
            }
            const volConditions = flatFalse.start && flatFalse.end
            const expressSign = Math.sign(expression * -1)

            if(flatTrue.condition && flatTrue.start){
               const result = Math.sign(this.remDeltaY) === 1 ? this.remDeltaY : minOfResultArr + this.remDeltaY
               this.position[index] += result
            }
            else if(flatTrue.condition && flatTrue.end){
               const result = char * -1 < maxIndexPos - minOfResultArr ? (maxIndexPos - minOfResultArr) - char * -1 : maxIndexPos - char * -1
               this.itemIndex++
               this.position[index] -= result
            }
            else if(flatFalse.condition && volConditions && Math.abs(expression) > minForSwipe) this.position3d[index] += minOfResultArr * expressSign

            // if(!flatMode && char * sensitivity + -expression > 0 && -expression > 0 && index !== this.frames.length - 1 || index !== 0) item.classList.add('hidden')
            if(!flatMode && char * sensitivity + -expression > minForSwipe && -expression > 0) item.classList.add('hidden')
            else item.classList.remove('hidden')

            this.calcItemIndex()
            this.DOMPositionFrames()
         })

         window.onpointermove = null
      }
      function comparedTarget(){
         let result = false

         for(let i = 0; i < fewArrays.length; i++) if(fewArrays[i] === target) result = true
         return result
      }
   }

   minmaxResultFunc(){
      const minmaxResultArr = []
      this.frames.forEach(item => minmaxResultArr.push(item.clientWidth))  

      return minmaxResultArr
   }
   DOMPositionFrames(){
      const flatMode = menuClass.flatMode
      const items = document.querySelectorAll('.item')
      const minOfResultArr = Math.min(...this.minmaxResultFunc())
      
      this.frames.forEach((item, index) => {
         const result = flatMode ? this.position[0] : this.position3d[index]
         const checkResult = !flatMode && result === undefined ? minOfResultArr * -index : result
         // item.style.cssText = `--position: ${result}px;`
         item.style.cssText = `--position: ${checkResult}px;`
         items[index].classList.remove('active') 
      })

      this.refreshFramesEffects()
      this.framesEffects()
      this.smoothingPosition()
   }
   DOMPositionReset(){
      const autoEvent = new Event('wheel')
      window.dispatchEvent(autoEvent)
   }
   refreshFramesEffects(){
      this.frames.forEach(item => {
         item.classList.remove('turned-left', 'turned-right')
      })
   }
   framesEffects(){
      const flatMode = menuClass.flatMode

      this.frames.forEach((item, index) => {
         if(index === this.itemIndex) item.classList.remove('turned-left', 'turned-right')
         else if(flatMode && index < this.itemIndex) item.classList.add('turned-left')
         else if(flatMode && index > this.itemIndex) item.classList.add('turned-right')
      })
   }
   smoothingPosition(){
      const minmaxResultArr = this.minmaxResultFunc()
      const localPos = Math.min(...this.position)
      const localMinMax = Math.min(...minmaxResultArr)

      for(let i = 0; i < minmaxResultArr.length; i++){
         if(localPos * -1 === localMinMax * i){
            this.smootingIndex = i
            this.remDeltaY = 0
         }
         else this.remDeltaY = (localPos * -1) - (localMinMax * this.smootingIndex)
      }
   }
   calcItemIndex(){
      const minOfResultArr = Math.min(...this.minmaxResultFunc())
      const calcIndex = Math.abs((this.frames.length * minOfResultArr - this.position[0] * -1) / minOfResultArr - this.frames.length)
      this.itemIndex = +calcIndex.toFixed(0)
   }
}
const calcSlidePos = new CalcSlidePos()

class InitClickToElement{
   items = document.querySelectorAll('.item')

   initClickListener(){
      this.items.forEach((item, index) => {
         item.onpointerup = e => {
            e.preventDefault()
            const flatMode = menuClass.flatMode
            const itemIndex = calcSlidePos.itemIndex
            flatMode && (index === itemIndex) ? this.switchItemClass(index) : item.classList.remove('active')
         }
      })
   }

   switchItemClass(index){
      this.items[index].classList.toggle('active')
   }
}

class SwitchActivator{
   menuClass = new MenuClass()
   frames = document.querySelectorAll('.frame')

   activateArrowPrev(){
      const {click} = menuClass.condition

      if(click) calcSlidePos.calcClickPrev()
   }

   activateArrowNext(){
      const {click} = menuClass.condition

      if(click) calcSlidePos.calcClickNext()
   }

   activateWheel(e){
      const {wheel} = menuClass.condition
      if(wheel) calcSlidePos.calcWheel(e)
   }

   activateSwipe(e){
      const {swipe} = menuClass.condition
      if(swipe) calcSlidePos.calcPointerEvents(e)
   }
}
const switchActivator = new SwitchActivator()

class InitControllerListeners{
   value = document.querySelector('.slider-incline .span-value')

   initAngleBtns(){
      const buttons = document.querySelectorAll('.slider-incline .number')
      buttons[0].onpointerdown = () => {
         const value = +this.value.textContent
         if(value + 15 <= 30){
            this.value.innerHTML = value + 15
            calcAngleClass.calcAngle(value + 15)
         }
      }
      buttons[1].onpointerdown = () => {
         const value = +this.value.textContent
         if(value - 15 >= -30){
            this.value.innerHTML = value - 15
            calcAngleClass.calcAngle(value - 15)
         }
      }
      // const value = document.querySelector('.slider-incline .span-value')
      // const btnAngle = document.querySelector('.slider-incline .save')
      // btnAngle.onclick = () => calcAngleClass.calcAngle(input.value)
      this.initArrowBtns()
   }

   initArrowBtns(){
      document.querySelector('.arrow.prev').onclick = e => switchActivator.activateArrowPrev()
      document.querySelector('.arrow.next').onclick = e => switchActivator.activateArrowNext()
   }

   initWheel(){window.onwheel = e => switchActivator.activateWheel(e)}

   initMouse(){window.onpointerdown = e => switchActivator.activateSwipe(e)}
}
class InitListeners{

   initialListeners(){
      const returnBtn = document.querySelector('.return-to-start .switch')
      const inclineBtn = document.querySelector('.slider-incline .save')
      const sensitivityBtn = document.querySelectorAll('.slider-sensitive .number')
      const verHorBtn = document.querySelector('.slider-ver-hor .switch')
      const volFlatBtn = document.querySelector('.slider-2d-3d .switch')

      menuClass.returnToStartI(returnBtn)
      // menuClass.inclineI(inclineBtn)
      menuClass.controllersI()
      menuClass.sensitivityI(sensitivityBtn)
      // menuClass.verAndflatModeI(verHorBtn)
      menuClass.volumetricAndFlatI(volFlatBtn)

      const initControllerListeners = new InitControllerListeners()
      initControllerListeners.initAngleBtns()
      initControllerListeners.initWheel()
      initControllerListeners.initMouse()

      // calcSlidePos.initFramesPos()
      calcSlidePos.initContainerPosition()
      new InitClickToElement().initClickListener()
   }
}
const initListeners = new InitListeners()
initListeners.initialListeners()