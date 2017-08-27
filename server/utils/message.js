var generateMess = (from, text) => {
  return {
    from: from,
    text: text,
    createdAt: new Date().getTime()
  };
};

var generateLocationMess = (from, latitude, longitude) => {
  return {
    from: from,
    url: `https://www.google.fi/maps/?q=${latitude},${longitude}`,
    createdAt: new Date().getTime()
  };
};

module.exports = {generateMess, generateLocationMess};
