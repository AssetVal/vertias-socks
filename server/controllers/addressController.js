require('dotenv').config();
const Lob = require('lob')(process.env.lobLiveSecret.toString());

class addressController {
  async verify ({street: primary_line, unitNumber: secondary_line, city: city, state: state, zip: zip} = {}){
    const suggestions = {};
    let avResponse;
    if (!secondary_line){
      avResponse = await Lob.usVerifications.verify({primary_line: primary_line.toUpperCase(), city: city.toUpperCase(), state: state.toUpperCase(), zip_code: zip});
    } else {
      avResponse = await Lob.usVerifications.verify({primary_line: primary_line.toUpperCase(), secondary_line: secondary_line.toUpperCase(), city: city.toUpperCase(), state: state.toUpperCase(), zip_code: zip});
    }

    if (avResponse.primary_line !== primary_line.toUpperCase()) {
      if (avResponse.components.street_predirection.length > 0 || avResponse.components.street_postdirection.length > 0) {
        suggestions.street = 'cardinal direction';
      }
    }
    if (avResponse.components.zip_code !== zip) { suggestions.zip = 'Zip Code Changed'; }
    if (avResponse.components.state !== state.toUpperCase()) { suggestions.state = 'State changed'; }
    if (Object.keys(suggestions).length > 0) {
      return {
        verificationResult: avResponse,
        suggestions: suggestions,
        location: [avResponse.components.longitude, avResponse.components.latitude],
      }
    }
    return {
      verificationResult: avResponse,
      suggestions: null,
      location: [avResponse.components.longitude, avResponse.components.latitude],
    };
  };
}
module.exports = addressController;
