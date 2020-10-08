import { RuleFile } from './constants';
import { env } from '../environment';
import { logger } from './debug';

const debug = logger('getBlobURL');

/**
 * getBlobURL will return a URL for the provided fileName.
 * It will figure out if the file is part of the changeSet or not and return the correct URL for it.
 */
export const getBlobURL = (filename: string, files: RuleFile[], owner: string, repo: string, base: string): string => {
  const baseBlobPath = `https://github.com/${owner}/${repo}/blob`;

  debug('getBlobURL', filename, files, baseBlobPath, base);
  const file = files.find((file) => filename.match(file.filename));

  return file ? file.blob_url : `${baseBlobPath}/${base}/${filename.replace(`${env.GITHUB_WORKSPACE}/`, '')}`;
};
