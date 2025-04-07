const CheckInHandler = require('./CheckInHandler');

class PublicHandler extends CheckInHandler {
    validateAccess(){
        return{
            success:true,
            message:'Access allowed to public parking'
        }
    }
}
module.exports = PublicHandler;