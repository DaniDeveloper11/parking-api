const CheckInHandler = require('./CheckInHandler');

class CortesyHandler extends CheckInHandler{
    
    validateAccess(){
        const { userType } = this;
        const today = new Date();
        const day = today.getDay();

        if(userType!== 'visitor'){
            return{
                success:false,
                errorCode:'ACCESS_DENIED',
                message:'Only visitor users can access to courtesy parking'
            };
        }

        if(day !== 0 && day !== 6 ){
            return {
                success:false,
                errorCode:'ACCESS_DENIED',
                message: 'Courtesy parkings just are available on weekend'
            };
        }

        return {
            success:true,
            message:'Access allowed to courtesy parking'
        }
    }
}

module.exports = CortesyHandler;