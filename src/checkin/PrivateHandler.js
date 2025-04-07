const CheckInHandler = require('./CheckInHandler');

class PrivateHandler extends CheckInHandler {
    validateAccess(){
        const {userType} = this;
        const today = new Date();
        const day = today.getDay();

        if(usertype !== 'corporate'){
            return{
                success:false,
                errorCode: 'ACCESS_DENIED',
                message:'Only user type corporate can access to private parking'
            };
        }

        if(day === 0 || day === 6){
            return {
                success :false,
                errorCode:'WEEKEND_BLOKED',
                message:'private parkings just available on weekdays'
            }
        }
        return {
            success:true,
            message:'Access allowed to private parking'
        }

    }
}

module.exports = PrivateHandler;