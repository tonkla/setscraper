Object.assign(String.prototype, {
  toFloat(opt = {}) {
    try {
      const str = this.replace(/,/g, '')
      if (str === '-') return 0
      const num = parseFloat(str)
      return opt.multiply
        ? Math.round(num * opt.multiply)
        : isNaN(num)
        ? 0
        : num
    } catch (err) {
      return this.toString()
    }
  },
})
