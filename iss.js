const request = require('request');

const fetchMyIP = (callback) => {
  
  const URL = 'https://api.ipify.org';
  request(URL, (error, response, body) => {
 
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    if (body === undefined) {
      return callback('No IP address found', null);
    }

    return callback(null, body);
    
  });

};

const fetchCoordsByIP = (ip, callback) => {
  const URL = `https://api.freegeoip.app/json/${ip}?apikey=52ee39f0-7a44-11ec-b928-e97065cac973`;
  request(URL, (error, response, body) => {

    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    if (body === undefined) {
      return callback('Coordinates not found', null);
    }
    const coords = {};
    const data = JSON.parse(body);
    coords['latitude'] = data['latitude'];
    coords['longitude'] = data['longitude'];
    return callback(null, coords);

  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  const latitude = coords['latitude'];
  const longitude = coords['longitude'];
  const URL = `https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  request(URL, (error, response, body) => {

    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS data. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    const responseArray = data['response'];

    return callback(null, responseArray);

  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = (callback) => {
  
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error);
      }
      
      fetchISSFlyOverTimes(coords, (error, data) => {
        if (error) {
          return callback(error);
        }
        
        callback(null, data);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };