import * as mongoose from 'mongoose';
import { mongooseDefaultPlugins, mongooseDefaultSchemaOptions } from '../lib/mongoose-ext';
import { BaseModel } from './_base.model';

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

export default class UserModel extends BaseModel {
  protected model = mongoose.model('User', modelSchema, 'user');

  create(
    body: {
      email: string,
      firstName: string,
      lastName: string,
    }, by: string): Promise<any> {

    const newBody: any = body;
    const n = new this.model({ ...newBody, createdBy: by, updatedBy: by, });
    return n.save();
  }
}
