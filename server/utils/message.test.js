var expect = require('expect');
var {generateMess, generateLocationMess} = require('./message.js');

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

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'John';
    var url = 'https://www.google.fi/maps/?q=60.207930399999995,24.6629102';
    var mess = generateLocationMess(from, 60.207930399999995, 24.6629102);

    expect(mess.createdAt).toBeA('number');
    expect(mess).toInclude({
      from: from,
      url: url
    });
  });
});
