const mongoose = require('mongoose')
const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI, { 
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log('Mongo success');
            
        })
        .catch((err) => {
            console.log('error',err);
            
        })
}

module.exports = connectDatabase;