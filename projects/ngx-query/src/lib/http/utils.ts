
/**
 * Check if a provided string is a valid resource url
 * 
 * @internal
 */
export function isValidHttpUrl(uri: string) {
  try {
    const url = new URL(uri);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

/**
 * Get the host part of a web url object
 *
 * @internal
 *
 */
export function getHttpHost(url: string) {
  if (url) {
    const webURL = new URL(url);
    url = `${webURL.protocol}//${webURL.host}`;
    return `${`${url.endsWith('/') ? url.slice(0, -1) : url}`}`;
  }
  return url ?? '';
}
