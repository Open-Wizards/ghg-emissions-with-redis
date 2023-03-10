
import cluster from 'node:cluster';
import os from 'node:os';
import process from 'node:process'
import express,{Application ,Request,Response,NextFunction} from 'express'
import connectToDb, { closeDbConnection } from './src/services/db.service';
import config, { checkEnvironmentVariables } from './utils/config';
import logger from './utils/pino'
import ghgEmissionsRouter from './src/routes/ghg-emissions.routes'
const app:Application = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))


//connecting to db
connectToDb()
//checking for environment variables 
checkEnvironmentVariables()

//logging the oncoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

//API routes
app.use('/api/ghg_emissions',ghgEmissionsRouter)


// using the cluster module to create multiple workers
// spawn a worker for each CPU core -2
// const numCPUs = os.cpus().length-2;
// logger.info(`Number of CPUs: ${numCPUs}`);

// if (cluster.isPrimary) {
//   logger.info(`Primary ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     logger.info(`worker ${worker.process.pid} died`);
//   });
// } else {
//  Workers can share connection
//   logger.info(`Worker ${process.pid} started`);
// }

//THe cluster approach have a long startup time and is not suitable for small applications and development

app
  .listen(config.PORT, () => {
    logger.info(`Server is running on port ${config.PORT}`);
  })
  .on('error', (err) => {
    closeDbConnection();
    logger.error(err);
  });

//This wll spawn a worker for each CPU core -2 which can be used to handle the incoming requests
//The cluster module will automatically load balance the incoming requests among the workers




