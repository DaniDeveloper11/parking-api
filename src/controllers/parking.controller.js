const db = require('../models');
const Parking = db.Parking;
const sanitizePhone = require('../helpers/sanitizePhone')

exports.createParking  = async(req,res) => {
    try{
        const {name, spots, contacto, parkingType} = req.body;
        const normalizedName = name.toLowerCase().replace(/\s+/g, '_');
        const userId = req.user.id
        const addLada  = sanitizePhone(contacto);


        //1. Validacion de campos obligatorios
        if(!name || !spots || !contacto || !parkingType){
            return res.status(400).json({error:'all fields are required'});    
        }

        //2. Reglas de negocios
        if(spots < 50){
            return res.status(400).json({error:'parking lot too small'});
        }

        if(spots > 1500){
            return res.status(400).json({error:'parking lot too big'});
        }
        //3.Verificar nombre duplicado
        
        const existing = await Parking.findOne({where:{normalizedName}});
        if(existing)
            return res.status(409).json({error:'there is already a parking lot with this name '})

        const allowedTypes = ['public', 'private', 'courtesy'];
        if (!allowedTypes.includes(parkingType)) {
          return res.status(400).json({ error: 'Invalid parkingType value' });
        }
        const parking = await Parking.create({ 
            name,
            spots,
            addLada,
            parkingType,
            normalizedName,
            userId
        });
        res.status(201).json({
            message:'Parking lot was created success',
            parking
        });



    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Could not create parking' });
    }
};

exports.getAllParkings = async (req, res) => {
    try {
      const parkings = await Parking.findAll();
      res.json(parkings);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching parkings' });
    }
  };

  exports.getParkingById = async (req, res) => {
    try {
      const { id } = req.params;
      const parking = await Parking.findByPk(id);
  
      if (!parking) {
        return res.status(404).json({ error: 'Parking not found' });
      }
  
      res.json(parking);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching parking' });
    }
  };

  exports.updateParking = async (req, res) => {
    try {
      const { id } = req.params;
      const { contacto, spots, ...rest } = req.body;
  
      if (Object.keys(rest).length > 0) {
        return res.status(400).json({
          error: "just can update spots and contact"
        });
      }
  
      const parking = await Parking.findByPk(id);
      if (!parking) {
        return res.status(404).json({ error: 'parking not found' });
      }
  
      if (spots !== undefined) {
        const parsedSpots = parseInt(spots);
        if (isNaN(parsedSpots)) {
          return res.status(400).json({ error: 'Spots should be a valid number' });
        }
        if (parsedSpots < 50 || parsedSpots > 1500) {
          return res.status(400).json({ error: 'spots number should be between 50 y 1500' });
        }
        parking.spots = parsedSpots;
      }
  
      if (contacto) {
        parking.contacto = contacto;
      }
  
      await parking.save();
  
      res.status(200).json({
        message: 'parking was updated',
        parking
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error somethings was wrong to update' });
    }
  };
  
  

  exports.deleteParking = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Parking.destroy({ where: { id } });
  
      if (!deleted) {
        return res.status(404).json({ error: 'Parking not found' });
      }
  
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Error deleting parking' });
    }
  };