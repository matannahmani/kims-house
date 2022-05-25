import {
  composeMongoose,
  ObjectTypeComposerWithMongooseResolvers,
} from 'graphql-compose-mongoose';
import mongoose from 'mongoose';
import { ObjectTypeComposer, schemaComposer } from 'graphql-compose';

interface Reservation {
  _id: mongoose.Types.ObjectId;
  name: string;
  checkIn: Date;
  checkOut: Date;
  room: string;
  payment: Boolean;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

// create User model
const ReservationSchema = new mongoose.Schema<Reservation>(
  {
    name: {
      type: String,
      required: true,
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    room: {
      type: String,
      required: true,
    },
    payment: {
      type: Boolean,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// STEP 2: CONVERT MONGOOSE MODEL TO GraphQL PIECES
const customizationOptions = {}; // left it empty for simplicity, described below
const Reservation =
  mongoose.models.Reservation ||
  mongoose.model<Reservation>('Reservation', ReservationSchema);
function createObjectTC(model: mongoose.Model<any>) {
  let ModelTC = null;

  try {
    ModelTC = schemaComposer.getOTC(model.modelName);
  } catch {
    ModelTC = composeMongoose(model, customizationOptions);
  }
  return ModelTC;
}

const ReservationTC = createObjectTC(
  Reservation
) as ObjectTypeComposerWithMongooseResolvers<mongoose.Document<Reservation>>;
export { Reservation, ReservationTC };
export default Reservation;
