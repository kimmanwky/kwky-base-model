import * as mongoose from 'mongoose';
import { mongooseDefaultPlugins, mongooseDefaultSchemaOptions } from '../lib/mongoose-ext';
import { IPaginationOptions } from '../core/pagination-request';

const Schema = mongoose.Schema;
const Types = mongoose.Schema.Types;

export const enum ENUM_USER_STATUS {
  active = 'active',
  deactivate = 'deactivate',
  blocked = 'blocked'
}

const modelSchema = new Schema({
  email: { type: Types.String, required: true, unique: true },
  firstName: { type: Types.String, required: true },
  lastName: { type: Types.String, required: true },
  status: { type: Types.String, enum: this.ENUM_USER_STATUS, default: ENUM_USER_STATUS.active },
}, mongooseDefaultSchemaOptions);

modelSchema.plugin(mongooseDefaultPlugins);

const model = mongoose.model('User', modelSchema, 'user');

export namespace UserModel {
  export function create(
    body: {
      email: string,
      firstName: string,
      lastName: string,
    }, by: string): Promise<any> {

    const newBody: any = body;
    const n = new model({ ...newBody, createdBy: by, updatedBy: by, });
    return n.save();
  }

  export function count(filter?: object): Promise<any> {
    return model.countDocuments({ ...filter }).exec();
  }

  export function find(filter?: object, pagination?: IPaginationOptions, select?: any): Promise<any> {
    return model['findWithPaging']({ ...filter }, { ...pagination, select });
  }

  export function findOne(_id: string, select?: any): Promise<any> {
    return model.findOne({ _id }).select(select).exec();
  }

  export function findOneBy(filter: object, select?: any): Promise<any> {
    return model.findOne({ ...filter }).select(select).exec();
  }

  export function findOneAndUpdate(_id: string, body: any, by: string, select?: any): Promise<any> {
    return model.findOneAndUpdate({ _id }, { ...body, updatedBy: by }).select(select).exec();
  }

  export function findOneAndUpdateBy(filter: object, body: any, by: string, select?: any): Promise<any> {
    return model.findOneAndUpdate({ ...filter }, { ...body, updatedBy: by }).select(select).exec();
  }

  export function updateBy(filter: object, body: any, by: string): Promise<any> {
    return model.updateMany({ ...filter }, { ...body, updatedBy: by }).exec();
  }

  export function remove(_id: string, by: string): Promise<any> {
    return model.findOneAndUpdate({ _id }, { deleted: true, deletedBy: by }).exec();
  }

  export function removeBy(filter: object, by: string): Promise<any> {
    return model.updateMany({ ...filter }, { deleted: true, deletedBy: by }).exec();
  }
}
