export const PORT = process.env.PORT ?? 3000;
export const VERSION = process.env.VERSION ?? 'v1';
export const HOST = process.env.HOST ?? `http://localhost:${PORT}/`;

export const CONTAINER_ID = process.env.CONTAINER_ID ?? 1;
export const NODE_ID = process.env.NODE_ID ?? 1;
export const START_DATE: number = process.env.START_DATE
  ? parseInt(process.env.START_DATE)
  : new Date('2015-01-01T00:00:00Z').valueOf();
