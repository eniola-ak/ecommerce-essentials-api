import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { sequelize } from './models';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';

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
app.use('/api/products', productRoutes);

app.get('/', (_req, res) => {
  res.send('Homepage');
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB Connection error:', err);
  });
