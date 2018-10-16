import * as mongoose from 'mongoose';
// import * as cacheServer from './core/cache';

export function connect(uri: string, options?: any, next?: (err?: any) => void): void {
  mongoose.connect(uri, options, (err) => {
    if (err) {
      console.error(`Could not connect to - ${uri}`);
      return next(err);
    }

    console.log(`Connected to - ${uri}`);
    (<any>mongoose).Promise = global.Promise;

    // TODO: add cache server; disabled because of pagination query duplicate issue
    // cacheServer.init(cache);

    if (next) return next();
  });
}

export function disconnect(next?: (err?: any) => void): void {
  return mongoose.disconnect((err) => {
    console.info('Disconnected from mongodb');

    if (next) return next();
  });
}

export * from './models/all.model';

export * from './core/pagination-request';
export * from './lib/mongoose-pagination';
