import { FILE_ENCODING } from '../util/constants';
import { readFileSync } from 'fs';
export const loadJSONFile = <T>(filePath: string): T => {
  const file = readFileSync(filePath, { encoding: FILE_ENCODING });
  const content = JSON.parse(file) as T;
  return content;
};
