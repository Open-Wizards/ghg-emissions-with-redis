/** @format */

import logger from '../utils/pino';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const dataArr: any[] = [];
const stream = fs.createReadStream(path.join(__dirname, '../data.csv'));
if (!stream) {
  logger.error('No file found');
}
interface AxiosRetryConfig extends AxiosRequestConfig {
  retries?: number;
  retryDelay?: (retryCount: number) => number;
}

const axiosInstance: AxiosInstance = axios.create({
  // set maximum number of retries
  retries: 3,

  // set retry delay as a function
  retryDelay: (retryCount: number) => {
    return retryCount * 1000;
  },
} as AxiosRetryConfig);

stream
  .pipe(csv())
  .on('data', async (row) => {
    //Delete this line to avoid deleting the data in the database
    //making req to the endpoint
    const data = {
      country: row['country_or_area'],
      year: row['year'],
      value: Number(row['value']),
      parameter: row['parameter'],
    };
    dataArr.push(data);
  })
  .on('end', () => {
    logger.info('CSV file successfully processed');
    logger.info('Sending requests to the endpoint');
    makeRequest(dataArr);

    //wait 5 seconds before closing the connection
  })
  .on('error', (err) => {
    logger.error(err);
  });

//recursive function to make requests to the endpoint
const makeRequest = async (dataArr: any[]) => {
  try {
    const data = dataArr.shift();
    if (!data) {
      logger.info('Done');
      return;
    }
    await axiosInstance.post('http://localhost:8888/api/ghg_emissions', data);
    logger.info('Request sent');
    makeRequest(dataArr);
  } catch (err) {
    logger.error(err);
  }
};
