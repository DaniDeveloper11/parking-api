const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema, GraphQLNonNull } = require('graphql');
const db = require('../models');

const ParkingType = new GraphQLObjectType({
  name: 'Parking',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    contact: { type: GraphQLString },
    spots: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
    parkingType: { type: GraphQLString }
  })
});

const ParkingListType = new GraphQLObjectType({
  name: 'ParkingList',
  fields: () => ({
    totalItems: { type: GraphQLInt },
    data: { type: new GraphQLList(ParkingType) }
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
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery });
