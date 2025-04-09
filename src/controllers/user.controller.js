const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;
    console.log(email)
    // Validación simple
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    //Validar si ya existe un usuario con ese email
    const existingUser = await User.findOne({where:{email}});
    if(existingUser){
      return res.status(409).json({error:'Email is already exist'})
    }

    // Encriptar password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password,
      userType
    });

    res.status(201).json({ message: 'User was created', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // para no mostrar password
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

exports.loginUser = async (req, res) => {
  try{
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Buscar al usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'invalid email' });
    }

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'invalid password' });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      'supersecretjwtkey', 
      { expiresIn: '1h' }
    );

    // Opcional: quitar password antes de retornar
    const { password: _, ...userData } = user.toJSON();

    res.status(200).json({
      message: 'Login is success',
      token,
      user: userData
    });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}