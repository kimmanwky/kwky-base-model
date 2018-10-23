import * as mongoose from 'mongoose';
import { IPaginationOptions } from '../core/pagination-request';

export abstract class BaseModel {
  protected abstract model: mongoose.PaginateModel<mongoose.Document>;

  abstract create(body: any, by: string): Promise<any>;

  count(filter?: object): Promise<any> {
    return this.model.countDocuments({ ...filter }).exec();
  }

  find(filter?: object, pagination?: IPaginationOptions, select?: any): Promise<any> {
    return this.model['findWithPaging']({ ...filter }, { ...pagination, select });
  }

  findOne(_id: string, select?: any): Promise<any> {
    return this.model.findOne({ _id }).select(select).exec();
  }

  findOneBy(filter: object, select?: any): Promise<any> {
    return this.model.findOne({ ...filter }).select(select).exec();
  }

  findOneAndUpdate(_id: string, body: any, by: string, select?: any): Promise<any> {
    return this.model.findOneAndUpdate({ _id }, { ...body, updatedBy: by }).select(select).exec();
  }

  findOneAndUpdateBy(filter: object, body: any, by: string, select?: any): Promise<any> {
    return this.model.findOneAndUpdate({ ...filter }, { ...body, updatedBy: by }).select(select).exec();
  }

  updateBy(filter: object, body: any, by: string): Promise<any> {
    return this.model.updateMany({ ...filter }, { ...body, updatedBy: by }).exec();
  }

  remove(_id: string, by: string): Promise<any> {
    return this.model.findOneAndUpdate({ _id }, { deleted: true, deletedBy: by }).exec();
  }

  removeBy(filter: object, by: string): Promise<any> {
    return this.model.updateMany({ ...filter }, { deleted: true, deletedBy: by }).exec();
  }
}
