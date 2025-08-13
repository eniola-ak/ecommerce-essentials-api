import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { sequelize } from './models';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load('./src/docs/swagger.yaml');
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (_req, res) => {
  res.send('Homepage');
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('DB Connection error:', err);
  });
