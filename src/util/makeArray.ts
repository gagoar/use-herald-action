export const makeArray = (field: unknown) => (field && Array.isArray(field) ? field : [field].filter(Boolean));
