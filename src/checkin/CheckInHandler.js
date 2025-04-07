class CheckInHandler{
    constructor(parking, userType){
        this.parking = parking;
        this.userType = userType;
    }
    validateAccess(){
        throw new Error(' ValidateAccess() should be implemented for a subclase')
    }
}

module.exports = CheckInHandler;