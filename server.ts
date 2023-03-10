
import express,{Application ,Request,Response,NextFunction} from 'express'
import connectToDb, { closeDbConnection } from './src/services/db.service';
import config, { checkEnvironmentVariables } from './utils/config';
import logger from './utils/pino'
import ghgEmissionsRouter from './src/routes/ghg-emissions.routes'
import cluster from 'node:cluster';
import os from 'node:os';
import process from 'node:process'
const app:Application = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))


connectToDb()
checkEnvironmentVariables()

//logging the oncoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});
app.use('/api/ghg_emissions',ghgEmissionsRouter)


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
//   // Workers can share any TCP connection
//   // In this case it is an HTTP server
  
//   logger.info(`Worker ${process.pid} started`);
// }


app
  .listen(config.PORT, () => {
    logger.info(`Server is running on port ${config.PORT}`);
  })
  .on('error', (err) => {
    closeDbConnection();
    logger.error(err);
  });



