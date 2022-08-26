export class MinMaxGUIHelper {
  constructor(obj, minProp, maxProp, minDif) {
    this.obj = obj
    this.minProp = minProp
    this.maxProp = maxProp
    this.minDif = minDif
  }

  get min() {
    return this.obj[this.minProp]
  }

  set min(m) {
    this.obj[this.minProp] = m
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], m + this.minDif)
  }

  get max() {
    return this.obj[this.maxProp]
  }

  set max(x) {
    this.obj[this.maxProp] = x
    this.min = this.min + 0 // call min setter
  }
}
