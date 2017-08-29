const expect = require('expect');
var {isRealString} = require('./validation.js');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    expect(isRealString(123)).toBe(false);
  });
  it('should reject string with only space', () => {
    expect(isRealString('   ')).toBe(false);
  });
  it('should allow string with non-space character', () => {
    expect(isRealString('node room')).toBe(true);
  });
});
