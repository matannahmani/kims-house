/* This is a database connection function*/
import mongoose from 'mongoose';
mongoose.set('debug', true);

const connection = {
  isConnected: false,
}; /* creating connection object*/

async function dbConnect() {
  /* check if we have connection to our databse*/
  if (connection.isConnected) {
    return;
  }

  /* connecting to our database */
  // @ts-ignore
  const db = await mongoose.connect(process.env?.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // @ts-ignore
  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
