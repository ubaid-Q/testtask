import Mongoose from 'mongoose'
import Dotenv from 'dotenv'
Dotenv.config()
const URI = process.env.MONGO_URI;
Mongoose.connect(URI, (error) => {
    if (error) {
        console.log("DB CONNECTION ERROR : ", error.message);
    }
})


let db = Mongoose.connection;
db.once('open', () => console.log("Database Connected!"))

export default Mongoose;