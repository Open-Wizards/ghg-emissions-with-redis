import logger from './pino';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import GhgEmissionsModel from '../src/models/ghg-emissions';
import connectToDb, { closeDbConnection } from '../src/services/db.service';

const stream = fs.createReadStream(path.join(__dirname, '../data.csv'));
if (!stream) {
    logger.error('No file found');
}


connectToDb();


stream.pipe(csv()).on('data',  async(row) => {
 //Delete this line to avoid deleting the data in the database
  await GhgEmissionsModel.deleteMany({});  
  const data = new GhgEmissionsModel({
    country: row['country_or_area'],
    year: row['year'],
    value: Number(row['value']),
    parameter: row['parameter'],
  });
  
  try{
    await data.save()
  }catch(err){
    logger.error(err)
  }


}
).on('end', () => {
    logger.info('CSV file successfully processed');
    //wait 5 seconds before closing the connection
    setTimeout(() => {
    closeDbConnection();
    }, 6000);
}
).on('error', (err) => {
    logger.error(err);

    closeDbConnection();
  process.exit(1);
}
);

