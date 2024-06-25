import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { Logger } from '@nestjs/common';

const YAML_CONFIG_FILENAME = `config-${process.env.NODE_ENV || 'default'}.yaml`;

export default () => {
  const configFile = join(__dirname, YAML_CONFIG_FILENAME);
  Logger.log(`Reading config from file: ${configFile}`);
  return yaml.load(readFileSync(configFile, 'utf8')) as Record<string, any>;
};
