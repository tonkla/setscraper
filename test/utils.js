/* global describe it */

const { expect } = require('chai')
require('../src/utils')

describe('String.toFloat()', function () {
  it('should work', () => {
    expect('1'.toFloat()).to.eq(1)
    expect('12'.toFloat()).to.eq(12)
    expect('123,'.toFloat()).to.eq(123)
    expect('1,234'.toFloat()).to.eq(1234)
    expect('1,234.00'.toFloat()).to.eq(1234)
    expect('1,234.56'.toFloat()).to.eq(1234.56)
    expect('N/A'.toFloat()).to.eq(0)
    expect('1.234'.toFloat({ multiply: 1e3 })).to.eq(1234)
  })
})
