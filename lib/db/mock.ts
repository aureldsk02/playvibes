// Mock database for deployment without real DB
export const mockDb = {
  query: () => Promise.resolve({ rows: [] }),
  select: () => ({
    from: () => ({
      where: () => Promise.resolve([]),
      limit: () => Promise.resolve([]),
    }),
  }),
  insert: () => ({
    values: () => Promise.resolve({ insertId: 'mock' }),
  }),
  update: () => ({
    set: () => ({
      where: () => Promise.resolve({ affectedRows: 1 }),
    }),
  }),
  delete: () => ({
    where: () => Promise.resolve({ affectedRows: 1 }),
  }),
};