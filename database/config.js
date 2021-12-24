const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
        //await mongoose.connect('mongodb+srv://david1975:david1975@cluster0.gwy9h.mongodb.net/hospitaldb');
        await mongoose.connect(process.env.DB_CNN);

        console.log('DB Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la DB ver logs');
    }
}

module.exports = {
    dbConnection
}
