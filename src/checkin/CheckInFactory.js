const PublicHandler = require('./PublicHandler');
const PrivateHandler = require('./PrivateHandler');
const CourtesyHandler = require('./CourtesyHandler');

class CheckInFactory {
    static getHandler(parking, userType){
        switch (parking.parkingType){
            case 'public':
                return new PublicHandler(parking, userType);
            case 'private':
                return new PrivateHandler(parking, userType);
            case 'courtesy':
            return new CourtesyHandler(parking, userType);

            default:
                throw new Error(`Kind of parking is not supported : ${parking.parkingType}`)
        }
    }
}

module.exports = CheckInFactory;