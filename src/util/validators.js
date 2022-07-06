export default function requiredString(name, value) {
  if (name == null) {
    throw new Error('requiredString(): name parameter is required');
  }

  if (typeof value !== 'string') {
    throw new Error(`${name} is expected to be a string`);
  }

  if (value.length === 0) {
    throw new Error(`${name} cannot be empty`);
  }
}
