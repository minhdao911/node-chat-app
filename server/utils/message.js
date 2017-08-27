var moment = require('moment');

var generateMess = (from, text) => {
  return {
    from: from,
    text: text,
    createdAt: moment().valueOf()
  };
};

var generateLocationMess = (from, latitude, longitude) => {
  return {
    from: from,
    url: `https://www.google.fi/maps/?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  };
};

module.exports = {generateMess, generateLocationMess};
