import mongoose from "mongoose";

mongoose.set("strictQuery", false);
const connetionToDB= async () => {
    try{
        const { connection }= await mongoose.connect(process.env.MONGO_URI);
        if(connection) console.log(`Connected to MongoDB: ${connection.host}`);
    } catch(err){
        console.log(err);
        process.exit(1); // kill the server
    }
}

export default connetionToDB;


// create a cluster using Mongodb atlas and get the connection string
// using the connection string(wihtout database name) connect using mongodb compass
// using the complete connection string connect to the particular database of that connection