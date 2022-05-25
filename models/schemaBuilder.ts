import {
  ObjectTypeComposer,
  Resolver,
  ResolverResolveParams,
  SchemaComposer,
} from 'graphql-compose';
import { ReservationTC } from './reservation';

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
  reservationByIds: ReservationTC.mongooseResolvers.findByIds(),
  reservationById: ReservationTC.mongooseResolvers.findById(),
  reservationMany: ReservationTC.mongooseResolvers.findMany(),
  reservationOne: ReservationTC.mongooseResolvers.findOne(),
});

schemaComposer.Mutation.addFields({
  reservationCreateOne: ReservationTC.mongooseResolvers.createOne(),
  reservationCreateMany: ReservationTC.mongooseResolvers.createMany(),
  reservationUpdateById: ReservationTC.mongooseResolvers.updateById(),
  reservationUpdateOne: ReservationTC.mongooseResolvers.updateOne(),
  reservationUpdateMany: ReservationTC.mongooseResolvers.updateMany(),
  reservationRemoveById: ReservationTC.mongooseResolvers.removeById(),
  reservationRemoveOne: ReservationTC.mongooseResolvers.removeOne(),
  reservationRemoveMany: ReservationTC.mongooseResolvers.removeMany(),
});

const GraphQLSchema = schemaComposer.buildSchema();
export { GraphQLSchema };
export default GraphQLSchema;
