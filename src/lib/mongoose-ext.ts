import * as mongoose from 'mongoose';
import * as mongooseAutopopulate from 'mongoose-autopopulate';
import mongooseDefaultSchema from './mongoose-default-schema';
import mongoosePreAction from './mongoose-pre-action';
import mongoosePagination from './mongoose-pagination';

export function mongooseDefaultPlugins(schema: mongoose.Schema, options?: any) {
  mongooseAutopopulate(schema);
  mongoosePreAction(schema);
  mongoosePagination(schema);
  mongooseDefaultSchema(schema);
}

export function mongooseReferencePlugins(schema: mongoose.Schema, options?: any) {
  mongooseAutopopulate(schema);
  mongooseDefaultSchema(schema);
}

export const mongooseDefaultSchemaOptions = {
  timestamps: {
    createdAt: 'createdUtcDate',
    updatedAt: 'updatedUtcDate',
  }
};
