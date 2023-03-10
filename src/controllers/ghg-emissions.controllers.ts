/** @format */

import logger from '../../utils/pino';
import { Request, Response, NextFunction } from 'express';
import { EmissionService } from '../services/emission.service';
import Joi from 'joi';
import { getCache, setCache } from '../services/redis.service';

export async function createGhgEmissions(req: Request, res: Response) {
  try {
    //validating the request body using Joi
    const validationSchema = Joi.object({
      country: Joi.string().required(),
      year: Joi.string().required().min(4).max(4),
      parameter: Joi.string().required().valid('CO2', 'NO2', 'SO2'),
      value: Joi.number().required(),
    });
    const { error } = validationSchema.validate(req.body);
    if (error) {
      throw { message: error.message, status: 400 };
    }
    const { country, year, value, parameter } = req.body;
    const data = {
      country,
      year,
      value,
      parameter,
    };

    //setting the cache
    //inserting the data to the database
    const saved = await EmissionService.insertEmissionToDb(data);
    await setCache(country, saved)
      .then((res: any) => {
        logger.info(`Cache set for ${country}`);
      })
      .catch((err: any) => {
        throw { message: err.message, status: 500 };
      });
    res.status(200).json({ message: 'Emission added successfully', saved });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
}

export async function getGhgEmissions(req: Request, res: Response) {
  try {
    const validationSchema = Joi.object({
      country: Joi.string().required(),
      start_year: Joi.string().required().min(4).max(4),
      end_year: Joi.string().required().min(4).max(4),
      parameter: Joi.string().valid('CO2', 'NO2', 'SO2'),
    });

    const { error } = validationSchema.validate(req.query);
    if (error) {
      throw { message: error.message, status: 400 };
    }
    const { country, start_year, end_year, parameter }: any = req.query;
    if (end_year && start_year && end_year < start_year) {
      throw {
        message: 'End year must be greater than start year',
        status: 400,
      };
    }

    const toBeReturned = await getCache(country as string);

    const cachedData = toBeReturned.filter((parsedItem: any) => {
      if (parameter) {
        return (
          parsedItem.year >= start_year &&
          parsedItem.year <= end_year &&
          parsedItem.parameter === parameter
        );
      } else
        return parsedItem.year >= start_year && parsedItem.year <= end_year;
    });
    //If the values are in the cache, we return them

    if (cachedData.length > 0) {
      res.status(200).json({ data: cachedData });
    } else {
      const data = await EmissionService.getEmissionsByCountryAndTime(
        country as string,
        start_year as string,
        end_year as string,
        parameter as string
      );

      //If the values are not in the cache, we set them
      data.forEach(async (item: any) => {
        await setCache(country as string, item).catch((err: any) => {
          throw { message: err.message, status: 500 };
        });
      });
      res.status(200).json({ data });
    }
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
}
