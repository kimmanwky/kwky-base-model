import * as mongoose from 'mongoose';

const Types = mongoose.Schema.Types;

export default function mongooseDefaultSchema(schema: mongoose.Schema) {
  // Default schema
  schema.add({
    createdUtcDate: { type: Types.Date, default: Date.now, select: false },
    createdBy: { type: Types.String, select: false },
    updatedUtcDate: { type: Types.Date, default: Date.now, select: false },
    updatedBy: { type: Types.String, select: false },
    deleted: { type: Types.Boolean, select: false },
    deletedBy: { type: Types.String, select: false },
    deletedUtcDate: { type: Types.Date, select: false },

    __schemaVer: { type: Types.Number, select: false, default: 1 },
    __v: { type: Types.Number, select: false }
  });
}
