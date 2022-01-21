const request = require('request-promise-native');

const fetchMyIP = () => {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = body => {
  const IP = JSON.parse(body).ip;
  return request(`https://api.freegeoip.app/json/${IP}?apikey=52ee39f0-7a44-11ec-b928-e97065cac973`);
};

const fetchISSFlyOverTimes = coords => {
  const data = JSON.parse(coords);
  return request(`https://iss-pass.herokuapp.com/json/?lat=${data.latitude}&lon=${data.longitude}`);
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};




module.exports = { nextISSTimesForMyLocation };