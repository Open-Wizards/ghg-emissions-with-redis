/** @format */

import mongoose from 'mongoose';
enum parameter {
  CO2 = "CO2",
  NO2 = "NO2",
  SO2 = "SO2",
}

export interface IghgEmissions {
  // Define the fields in your data
  country: string;
  year: string;
  value: number;
  parameter: parameter;
}


const ghgEmissionsSchema = new mongoose.Schema<IghgEmissions>({
  // Define the fields in your data
  country: {type: String, required: true },
  year: {type: String, required: true},
  value: {type: Number, required: true},
  parameter: {
    type: String,
    enum: [parameter.CO2, parameter.NO2, parameter.SO2],
    required: true,
  }
});

const GhgEmissionsModel = mongoose.model<IghgEmissions>('ghgEmissions', ghgEmissionsSchema);



export default GhgEmissionsModel;