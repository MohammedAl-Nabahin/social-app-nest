import * as dotenv from 'dotenv';
import { production } from './config.production';
import { development as defaultConfig } from './config.development';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';

const current = NODE_ENV === 'development' ? defaultConfig : production;
export default [defaultConfig, current];
