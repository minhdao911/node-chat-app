var expect = require('expect');
var {generateMess} = require('./message.js');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'John';
    var text = 'hello';
    var mess = generateMess(from, text);

    expect(mess.createdAt).toBeA('number');
    expect(mess).toInclude({
      from: from,
      text: text
    });
  });
});
