const cron = require('node-cron');
const alertService = require('../modules/alerts/alert.service');

const startLowStockAlertJob = () => {
  cron.schedule('0 18 * * *', async () => {
    try {
      console.log('Running low stock alert job at 18:00');
      await alertService.sendLowStockAlerts();
    } catch (err) {
      console.error('Low stock alert job failed', err);
    }
  }, {
    timezone: 'Africa/Abidjan',
  });
};

module.exports = startLowStockAlertJob;
