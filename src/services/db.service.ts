import mongoose from 'mongoose';
import config from '../../utils/config';
import logger from '../../utils/pino';


export default async function connectToDb() {
mongoose.connect(config.DB_URL).then(() => {
    logger.info('Connected to MongoDB');
}
).catch((err) => {
    logger.error(err);
}
);
}

export function closeDbConnection() {
mongoose.connection.close().then(() => {
    logger.info('Closed MongoDB connection');
}
).catch((err) => {
    logger.error(err);
}
);
}