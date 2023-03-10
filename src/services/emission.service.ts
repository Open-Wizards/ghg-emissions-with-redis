import { IghgEmissions } from '../models/ghg-emissions';
import GhgEmissionsModel from '../models/ghg-emissions';
import logger from '../../utils/pino';

//This service  class is used to handel Data manipulation and data retrieval for the ghg-emissions model

export class EmissionService {
  static async insertEmissionToDb(data: IghgEmissions) {
    const emission = new GhgEmissionsModel({
      country: data.country,
      year: data.year,
      value: Number(data.value),
      parameter: data.parameter,
    });
    try {
      await emission.save();
    } catch (err) {
      logger.error(err);
    }
    return emission;
  }

  static async getEmissionsByCountryAndTime(
    country: string,
    startYear: string,
    endYear: string,
    parameter?: string
  ) {
    if (parameter) {
      const emissions = await GhgEmissionsModel.find({
        country: country,
        year: {
          $gte: startYear,
          $lte: endYear,
        },
        parameter: parameter,
      });
      return emissions;
    } else {
      const emissions = await GhgEmissionsModel.find({
        country: country,
        year: {
          $gte: startYear,
          $lte: endYear,
        },
      });
      return emissions;
    }
  }

  static async getEmissionByCountryAndYear(country: string, year: string) {
     return await  GhgEmissionsModel.findOne({ country: country, year: year });
  }

  //end of class
}