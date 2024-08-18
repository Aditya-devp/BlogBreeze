import mongoose from "mongoose";

const Connection = async () => {
  try {
    await mongoose.connect(process.env.URL, {});
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error while connecting to the database ", error);
  }
};

export default Connection;
