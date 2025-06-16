import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { sequelize } from './config/database';

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Sync error", err);
  });



const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Homepage');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
