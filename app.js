// CORE PACKAGE/MODULE

// THIRD PARTY PACKAGE/MODULE
const express = require("express")
const morgan = require("morgan")

// OUR OWN PACKAGE/MODULE
const tourRouter = require("./routes/tourRoutes")
const userRouter = require("./routes/userRoutes")

const app = express()

// middleware dari express
app.use(express.json())
app.use(morgan("dev"))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  console.log(req.requestTime)
  next()
})

app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

module.exports = app
