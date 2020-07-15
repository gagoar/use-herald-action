import { FILE_ENCODING } from '../util/constants';
import { readFileSync } from 'fs';

export const loadJSONFile = (filePath: string) => {
  const file = readFileSync(filePath, { encoding: FILE_ENCODING });
  const content = JSON.parse(file) as unknown;
  return content;
};
