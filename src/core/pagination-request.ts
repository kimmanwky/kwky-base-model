
import { ENUM_PAGING_MODE } from './../lib/mongoose-pagination';

export interface IPaginationOptions {
  mode?: ENUM_PAGING_MODE;
  limit?: number;
  sortDir?: string;
  sortBy?: string;
  page?: number;
  nextToken?: string;
  sort?: {
    [sortby: string]: string
  };
}
