const db = require('../models');
const CheckInFactory = require('../checkin/CheckInFactory');
const Parking = db.Parking;
const User = db.User;
const CheckIn = db.CheckIn;

exports.checkIn = async (req,res) => {
    try{
        const { parkingId } = req.body;
        const userId = req.user.id;

        if(!parkingId){
            return res.status(404).json({
                success:false,
                errorCode:'MISSING_PARAMETERS',
                message:'parkingId is required'
            });
        }

        const user = await User.findByPk(userId);
        if(!user){
            return res.status(404).json({
                success:false,
                errorCode:'USER_NOT_FOUND',
                message:'user is not authenticated'
            })
        }
        
        const userType = user.userType;

        const parking = await Parking.findByPk(parkingId);
        if(!parking){
            return res.status(404).json({
                success:false,
                errorCode:'PARKING_NOT_FOUND',
                message:'Parking dont exist'
            })
        }

        const handler = CheckInFactory.getHandler(parking, userType);
        const result = handler.validateAccess();

        await CheckIn.create({
            userId,
            parkingId,
            success:result.success,
            userType:user.userType
        });

        if(result.success){
            return res.status(200).json(result);
        }else{
            return res.status(403).json(result)
        }

    }catch(err){
        console.error('Error in checkIn:', err);
        res.status(500).json({
            success:false,
            errorCode:'SERVER_ERROR',
            message:'Something wrong to process the check-in'
        });
    }
};

