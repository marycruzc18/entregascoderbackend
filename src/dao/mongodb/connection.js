import mongoose from "mongoose";
import config from '../../config.js'

const MONGO_URL = config.MONGO_URL || config.MONGO_URL_LOCAL


export const  initMongoDB = async () => {
    try {
      mongoose.set('strictQuery', false)
      await mongoose.connect(MONGO_URL);
      console.log("Conectado a la base de datos de MONGO");
    } catch (error) {
      console.log(error);
    }
  };