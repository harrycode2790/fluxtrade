let dbConnected = false;
let modulesPromise;

const loadModules = async () => {
  if (!modulesPromise) {
    modulesPromise = Promise.all([
      import("../backend/src/app.js"),
      import("../backend/src/config/db.js"),
    ]).then(([appModule, dbModule]) => ({
      app: appModule.default,
      connectDB: dbModule.default,
    }));
  }

  return modulesPromise;
};

module.exports = async function handler(req, res) {
  const { app, connectDB } = await loadModules();

  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }

  return app(req, res);
};
