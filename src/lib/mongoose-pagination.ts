import * as mongoosePaginate from 'mongoose-paginate';

export enum ENUM_PAGING_MODE {
  nopaging = 'nopaging',
  page = 'page',
  next = 'next',
  all = 'all'
}

const modes: ENUM_PAGING_MODE[] = [ENUM_PAGING_MODE.nopaging, ENUM_PAGING_MODE.next, ENUM_PAGING_MODE.page, ENUM_PAGING_MODE.all];

function getPagingObject(token) {
  const buffer = Buffer.from(token, 'hex');
  const bufferString = buffer.toString();
  const parsed = JSON.parse(bufferString);

  return {
    limit: parsed.l,
    position: parsed.p,
    time: parsed.t
  };
}

function getPagingToken(limit, position, time) {
  const data = {
    l: limit,
    p: position,
    t: time
  };

  const buffer = Buffer.from(JSON.stringify(data));

  return buffer.toString('hex');
}

function continuous(model, query, options): Promise<any> {
  const opts = options || {};
  const q = query || {};
  const next = options.nextToken;

  if (next) {
    const pagingData = getPagingObject(next);
    opts.limit = opts.limit || pagingData.limit;
    opts.offset = pagingData.position;

    // to restrict data query only up to the token datetime (will not retrieve new created data)
    q.createdUtcDate = {
      $lte: new Date(pagingData.time)
    };
  }

  return model.paginate(q, opts).then((data) => {
    const result: any = {};

    if (data) {
      result.results = data.docs;
      result.paging = {
        mode: ENUM_PAGING_MODE.next,
        totalCount: data.total,
        limit: opts.limit
      };

      if (!next) {
        if (data.total > data.docs.length) {
          const nextToken = getPagingToken(options.limit, options.limit, new Date().getTime());
          result.paging.nextToken = nextToken;
        }
      } else {
        const pagingData = getPagingObject(next);
        if (data.total > pagingData.position + data.docs.length) {
          const nextToken = getPagingToken(options.limit, pagingData.position + options.limit, pagingData.time);
          result.paging.nextToken = nextToken;
        }
      }
    }

    return Promise.resolve(result);
  }, (err) => {
    return Promise.reject(err);
  });
}

function page(model, query, options): Promise<any> {
  const opts = options || {};
  const q = query || {};
  opts.page = !opts.page || opts.page <= 0 ? 1 : opts.page;

  return model.paginate(q, opts).then((data) => {
    const result: any = {};
    result.results = data.docs;
    result.paging = {
      mode: ENUM_PAGING_MODE.page,
      current: parseInt(data.page, 10),
      totalCount: data.total,
      totalPage: data.pages,
      limit: opts.limit
    };

    return Promise.resolve(result);
  }, (err) => {
    return Promise.reject(err);
  });
}

function noPaging(model, query, options): Promise<any> {
  const opts = options || {};
  const q = query || {};
  opts.page = 1;

  return model.paginate(q, opts).then((data) => {
    const result: any = {};
    result.results = data.docs;
    result.paging = {
      mode: ENUM_PAGING_MODE.nopaging,
      limit: opts.limit,
      totalCount: data.total
    };

    return Promise.resolve(result);
  }, (err) => {
    return Promise.reject(err);
  });
}

function all(model, query, options): Promise<any> {
  const q = model.find();
  // tslint:disable-next-line:no-parameter-reassignment
  query = query || {};
  // tslint:disable-next-line:no-parameter-reassignment
  options = options || {};

  q.where(query).select(options.select).sort(options.sort).limit(500);    // make a maximum limit of 500 ONLY
  return q.exec().then((data) => {
    const result: any = {};
    result.results = data;
    result.paging = {
      totalCount: data ? data.length : 0,
      mode: ENUM_PAGING_MODE.all
    };

    return Promise.resolve(result);
  }, (err) => {
    return Promise.reject(err);
  });
}

function customPagination(query: any = {}, options?: any): Promise<any> {
  let mode = options ? options.mode : undefined;
  if (mode && modes.indexOf(mode) === -1) mode = ENUM_PAGING_MODE.nopaging;

  // only query not deleted data
  query.deleted = { $ne: true };

  switch (mode) {
    case ENUM_PAGING_MODE.all:
      return all(this, query, options);
    case ENUM_PAGING_MODE.next:
      return continuous(this, query, options);
    case ENUM_PAGING_MODE.page:
      return page(this, query, options);
    default:
      return noPaging(this, query, options);
  }
}

export default function customPaginationPlugin(schema) {
  schema.plugin(mongoosePaginate);
  schema.statics.findWithPaging = customPagination;
}
