import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import mongoose from "mongoose"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js";

dotenv.config({})
const app = express()

app.get("/", (req, res) => {
      return res.status(200).json({
            message: "I am ok",
            success: true
      })
})

app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))
const corsOptions = {
      origin: "http://localhost:3000",
      credentials: true
}
app.use(cors(corsOptions))

app.use("/api/v1/user", userRoute)
app.use("/api/v1/post", postRoute)
app.use("/api/v1/message", messageRoute)

const PORT = process.env.PORT || 1234

const connnectDB = async () => {
      try {
            await mongoose.connect(process.env.MONGO_URL)
            console.log('Mongo connected ')
      } catch (error) {
            console.log('check error mongoDB', error)
      }
}

app.listen(PORT, () => {
      connnectDB()
      console.log(`Server is running at port ${PORT}`)
})