import { IghgEmissions } from '../models/ghg-emissions';
import GhgEmissionsModel from '../models/ghg-emissions';
import logger from '../../utils/pino';



export class EmissionService{
  
  static async insertEmissionToDb(data:IghgEmissions) {
    const emission = new GhgEmissionsModel({
      country: data.country,
      year: data.year,
      value: Number(data.value),
      parameter: data.parameter,
    });
    try{
      await emission.save()
    }catch(err){
      logger.error(err)
    }
  }

  static async getEmissionsByCountryAndTime(country:string,startYear:string,endYear:string,parameter?:string) {
   if(parameter){
    console.log(parameter);
     const emissions = await GhgEmissionsModel.find({
       country: country,
       year: {
        $gte: startYear,
        $lte: endYear,
      },
      parameter: parameter,
      
    });
    return emissions;
  }
  else{
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
  

  //end of class
}