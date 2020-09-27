import { RuleFile } from './constants';
import { env } from '../environment';
import { logger } from './debug';

const debug = logger('getBlobURL');

export const getBlobURL = (filename: string, files: RuleFile[], owner: string, repo: string, base: string): string => {
  const baseBlobPath = `https://github.com/${owner}/${repo}/blob`;

  debug('getBlobURL', filename, files, baseBlobPath, base);
  const file = files.find((file) => filename.match(file.filename));

  return file ? file.blob_url : `${baseBlobPath}/${base}/${filename.replace(`${env.GITHUB_WORKSPACE}/`, '')}`;
};
