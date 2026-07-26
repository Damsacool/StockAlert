const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const auth = require('./middleware/auth');
const tenant = require('./middleware/tenant');
const errorHandler = require('./middleware/errorHandler');
const productRoutes = require('./modules/products/product.routes');
const transactionRoutes = require('./modules/transactions/transaction.routes');
const userRoutes = require('./modules/users/user.routes');
const alertRoutes = require('./modules/alerts/alert.routes');
const startLowStockAlertJob = require('./jobs/lowStockAlert.job');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'ok' });
});

app.use('/api/products', auth, tenant, productRoutes);
app.use('/api/transactions', auth, tenant, transactionRoutes);
app.use('/api/users', auth, tenant, userRoutes);
app.use('/api/alerts', auth, tenant, alertRoutes);

app.use(errorHandler);

startLowStockAlertJob();

module.exports = app;
