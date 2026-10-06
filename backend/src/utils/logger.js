const logInfo = (message, meta = null) => {
  const timestamp = new Date().toISOString();
  if (meta) {
    console.log(`[INFO] [${timestamp}] ${message}`, meta);
  } else {
    console.log(`[INFO] [${timestamp}] ${message}`);
  }
};

const logWarn = (message, meta = null) => {
  const timestamp = new Date().toISOString();
  if (meta) {
    console.warn(`[WARN] [${timestamp}] ${message}`, meta);
  } else {
    console.warn(`[WARN] [${timestamp}] ${message}`);
  }
};

const logError = (message, meta = null) => {
  const timestamp = new Date().toISOString();
  if (meta) {
    console.error(`[ERROR] [${timestamp}] ${message}`, meta);
  } else {
    console.error(`[ERROR] [${timestamp}] ${message}`);
  }
};

module.exports = {
  logInfo,
  logWarn,
  logError
};
