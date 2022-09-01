/**
 * It takes an array of strings and a string, and returns an array of strings
 * @param {string[]} includeAvailable - An array of strings that are the available includes.
 * @param [include] - string
 * @returns An array of strings that are included in the includeAvailable array.
 */
export const includeCriteria = (includeAvailable: string[], include = ''): string[] => {
  const split: string[] = include.replace(/\s/g, '').split(',')
  return split.filter((value) => includeAvailable.includes(value))
}
