const app = require('./app');
const env = require('./config/env');
const { logInfo } = require('./utils/logger');

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  logInfo(`🚀 ResearchLens Backend Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  logInfo(`📡 API Gateway: http://localhost:${PORT}/api`);
  logInfo(`🩺 Health Check: http://localhost:${PORT}/api/health`);
});
