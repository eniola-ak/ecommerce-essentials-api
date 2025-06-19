import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { sequelize } from './config/database';
import categoryRoutes from './routes/categoryRoutes';

/*sequelize.sync({ alter: true }) 
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Sync error", err);
  });*/

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/categories', categoryRoutes);

app.get('/', (_req, res) => {
  res.send('Homepage');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
