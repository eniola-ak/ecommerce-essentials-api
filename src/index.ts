import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Homepage');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
