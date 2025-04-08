const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema, GraphQLNonNull } = require('graphql');
const db = require('../models');

const ParkingType = new GraphQLObjectType({
  name: 'Parking',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    contacto: { type: GraphQLString },
    spots: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
    parkingType: { type: GraphQLString }
  })
});

const CheckInType = new GraphQLObjectType({
  name: 'CheckIn',
  fields: () => ({
    id: { type: GraphQLInt },
    userType: { type: GraphQLString },
    success: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    user: {
      type: new GraphQLObjectType({
        name: 'UserMinimal',
        fields: () => ({
          name: { type: GraphQLString },
          email: { type: GraphQLString },
          userType: { type: GraphQLString }
        })
      })
    },
    parking: { type: ParkingType }
  })
});



const ParkingListType = new GraphQLObjectType({
  name: 'ParkingList',
  fields: () => ({
    totalItems: { type: GraphQLInt },
    data: { type: new GraphQLList(ParkingType) }
  })
});

const CheckInListType = new GraphQLObjectType({
  name: 'CheckInList',
  fields: () => ({
    totalItems: { type: GraphQLInt },
    data: { type: new GraphQLList(CheckInType) }
  })
});







const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    parkings: {
      type: ParkingListType,
      args: {
        skip: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        order: { type: GraphQLString }
      },
      resolve: async (_, { skip = 0, limit = 10, order = 'createdAt:DESC' }) => {
        const [field, direction] = order.split(':');
        const totalItems = await db.Parking.count();
        const data = await db.Parking.findAll({
          offset: skip,
          limit,
          order: [[field, direction?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']]
        });
        return { totalItems, data };
      }
    },

    myCheckIns: {
      type: CheckInListType,
      args: {
        skip: { type: GraphQLInt },
        limit: { type: GraphQLInt }
      },
      resolve: async (_, { skip = 0, limit = 10 }, context) => {
        const userId = context.user.id;
    
        const totalItems = await db.CheckIn.count({ where: { userId } });
    
        const data = await db.CheckIn.findAll({
          where: { userId },
          include: [{ model: db.Parking }],
          offset: skip,
          limit,
          order: [['createdAt', 'DESC']]
        });
    
        return { totalItems, data };
      }
    },
    
    checkInsByParking: {
      type: CheckInListType,
      args: {
        parkingId: { type: new GraphQLNonNull(GraphQLInt) },
        skip: { type: GraphQLInt },
        limit: { type: GraphQLInt }
      },
      resolve: async (_, { parkingId, skip = 0, limit = 10 }) => {
        const totalItems = await db.CheckIn.count({ where: { parkingId } });
    
        const data = await db.CheckIn.findAll({
          where: { parkingId },
          include: [{ model: db.User }],
          offset: skip,
          limit,
          order: [['createdAt', 'DESC']]
        });
    
        return { totalItems, data };
      }
    },

    allCheckIns: {
      type: CheckInListType,
      args: {
        skip: { type: GraphQLInt },
        limit: { type: GraphQLInt }
      },
      resolve: async (_, { skip = 0, limit = 10 }) => {
        const totalItems = await db.CheckIn.count();
    
        const data = await db.CheckIn.findAll({
          include: [
            { model: db.Parking, attributes: ['name'] },
            { model: db.User, attributes: ['name', 'email', 'userType'] }
          ],
          offset: skip,
          limit,
          order: [['createdAt', 'DESC']]
        });
    
        return { totalItems, data };
      }
    }
    
    
  }
});




module.exports = new GraphQLSchema({ query: RootQuery });
