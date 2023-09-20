// core modules
const fs = require("fs")

// our own modules

// third-party modules
const express = require("express")
const morgan = require("morgan")
const app = express()

// middleware
// memodifikasi incoming request / request body ke api kita
app.use(express.json())
app.use(morgan("dev"))

// our own middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

const port = process.env.port || 3000

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
)

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    data: { tours },
  })
}

const getTourById = (req, res) => {
  const id = req.params.id * 1
  const tour = tours.find((tour) => tour.id === id)

  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: `data with id: ${id} is not found`,
    })
  }
  res.status(200).json({
    status: "success",
    data: { tour },
  })
}

const createTour = (req, res) => {
  // generate id untuk data baru dari api kita
  const newId = tours[tours.length - 1].id + 1
  const newData = Object.assign({ id: newId }, req.body)

  tours.push(newData)

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newData,
        },
      })
    }
  )
}

const editTour = (req, res) => {
  const id = req.params.id * 1
  const tourIndex = tours.findIndex((tour) => tour.id === id)

  if (tourIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `data with id: ${id} is not found`,
    })
  }

  tours[tourIndex] = {
    ...tours[tourIndex],
    ...req.body,
  }
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `tour with id: ${id} updated`,
        data: {
          tour: tours[tourIndex],
        },
      })
    }
  )
}

const removeTour = (req, res) => {
  const id = req.params.id * 1
  const tourIndex = tours.findIndex((tour) => tour.id === id)

  if (tourIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `data with id: ${id} not found`,
    })
  }

  const deletedTour = tours.splice(tourIndex, 1)[0]
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `tour with id: ${id} deleted`,
        data: {
          deletedTour,
        },
      })
    }
  )
}

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
)

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    data: { users },
  })
}

const getUserById = (req, res) => {
  const id = req.params.id
  const user = users.find((user) => user._id === id)

  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: `data with id: ${id} is not found`,
    })
  }
  res.status(200).json({
    status: "success",
    data: { user },
  })
}

const createUser = (req, res) => {
  // generate id untuk data baru dari api kita
  const newData = req.body

  users.push(newData)

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          user: newData,
        },
      })
    }
  )
}

const editUser = (req, res) => {
  const id = req.params.id
  const userIndex = users.findIndex((user) => user._id === id)

  if (userIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `data with id: ${id} is not found`,
    })
  }

  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
  }
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `user with id: ${id} updated`,
        data: {
          user: users[userIndex],
        },
      })
    }
  )
}

const removeUser = (req, res) => {
  const id = req.params.id
  const userIndex = users.findIndex((user) => user._id === id)

  if (userIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `data with id: ${id} not found`,
    })
  }

  const deletedUser = users.splice(userIndex, 1)[0]
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `user with id: ${id} deleted`,
        data: {
          deletedUser,
        },
      })
    }
  )
}

// ROUTING
// app.get("/api/v1/tours", getAllTours)
// app.get("/api/v1/tours/:id", getTourById)
// app.post("/api/v1/tours", createTour)
// app.patch("/api/v1/tours/:id", editTour)
// app.delete("/api/v1/tours/:id", removeTour)

const tourRouter = express.Router()
const userRouter = express.Router()

// ROUTES UNTUK TOURS
tourRouter.route("/").get(getAllTours).post(createTour)

tourRouter.route("/:id").get(getTourById).patch(editTour).delete(removeTour)

// ROUTES UNTUK USERS
userRouter.route("/").get(getAllUsers).post(createUser)

userRouter.route("/:id").get(getUserById).patch(editUser).delete(removeUser)

app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
