const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
mongoose.connect(
  process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD),
);

const app = require('./app');

//START SERVER
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

// console.log(app.get('env'));
console.log(process.env);
