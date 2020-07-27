export default class FieldsNotPopulatedError extends Error {
  constructor(...fields: string[]) {
    super(`Fields ${fields.toString()} must be populated.`);
  }
}
