const mongoose = require('mongoose')

const connectMongo = async () => {
  try {
    return (
      mongoose.connect(process.env.MONGO_URL,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }),
      console.log('Database connection successful')
    )
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}

module.exports = {
  connectMongo
}
