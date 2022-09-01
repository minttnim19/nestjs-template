/**
 * It takes a list of selectable criteria and a string of selected criteria, and returns a list of
 * selected criteria.
 * @param {string[]} selectable - An array of strings that are the selectable criteria.
 * @param [select] - The string that the user has entered into the select box.
 * @returns An array of strings that are in the selectable array.
 */
export const selectableCriteria = (selectable: string[], select = ''): string[] => {
  const split: string[] = select.replace(/\s/g, '').split(',')
  return split.filter((value) => selectable.includes(value))
}
