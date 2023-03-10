import { Request , Response, NextFunction} from 'express';
import { EmissionService } from '../services/emission.service';
import Joi from 'joi';
import { getCache, setCache } from '../services/redis.service';

export async function createGhgEmissions(req: Request, res: Response) {
    try {
      const validtionSchema= Joi.object({
        country: Joi.string().required(),
        year: Joi.string().required().min(4).max(4),
        parameter: Joi.string().required().valid('CO2', 'NO2', 'SO2'),
        value: Joi.number().required(),
      });
      const { error } = validtionSchema.validate(req.body);
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
      await EmissionService.insertEmissionToDb(data);
      await setCache(`${country}-${year}`, data)
      res.status(200).json({ message: 'Emission added successfully', data });
    } catch (err:any) {
      res.status(err.status || 500).json({ message: err.message });
    }
  
}


export async function getGhgEmissions(req: Request, res: Response) {
  try {
    const validtionSchema = Joi.object({
      country: Joi.string().required(),
      start_year: Joi.string().required().min(4).max(4),
      end_year: Joi.string().required().min(4).max(4),
      parameter: Joi.string().valid('CO2', 'NO2', 'SO2'),
    });

    const { error } = validtionSchema.validate(req.query);
    if (error) {
      throw { message: error.message, status: 400 };
    }
    const { country, start_year, end_year, parameter } = req.query;
    if (end_year && start_year &&end_year < start_year) {
      throw {
        message: 'End year must be greater than start year',
        status: 400,
      };
    }
   const cachedData:any=[]
    for(let i=parseInt(start_year as string);i<=parseInt(end_year as string);i++){
      const data= await getCache(`${country}-${i}`);
      if(data){
        cachedData.push(data)
      }
    }
    if(cachedData){
      console.log('cached data');
      res.status(200).json({ data: cachedData });
    }else{
      const data= await EmissionService.getEmissionsByCountryAndTime(
        country as string,
        start_year as string,
        end_year as string,
        parameter as string
        );
        data.forEach(async (item:any)=>{
          await setCache(`${item.country}-${item.year}`, item)
        })
        res.status(200).json({ data });
      }
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
}