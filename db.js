var mongoose = require('mongoose');

async function main() {
    await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    console.log('Connected to MongoDB');
}

main().catch(err => console.log(err));


