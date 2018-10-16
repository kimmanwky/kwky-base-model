export default function mongoosePreSave(schema) {

  schema.pre('find', function (next) {
    this.where({ deleted: { $ne: true } });
    return next();
  });

  schema.pre('findOne', function (next) {
    this.where({ deleted: { $ne: true } });
    return next();
  });

  // schema.pre('save', function (next) {
  //   const now = new Date();
  //   this.update({}, { $set: { createdUtcDate: now, updatedUtcDate: now } });
  //   return next();
  // });

  schema.pre('update', function (next) {
    const now = new Date();
    if (this._update.deleted) this.update({}, { $set: { deletedUtcDate: now } });
    // else this.update({}, { $set: { updatedUtcDate: now } });
    this.where({ deleted: { $ne: true } });
    return next();
  });

  schema.pre('findOneAndUpdate', function (next) {
    const now = new Date();
    if (this._update.deleted) this.update({}, { $set: { deletedUtcDate: now } });
    // else this.update({}, { $set: { updatedUtcDate: now } });
    this.where({ deleted: { $ne: true } });
    this.options.new = true;
    return next();
  });

  // tslint:disable-next-line:ter-prefer-arrow-callback
  schema.pre('remove', function (next) {
    return next('Remove document is not allowed; use findOneAndUpdate to soft delete the record');
  });

  // tslint:disable-next-line:ter-prefer-arrow-callback
  schema.pre('findOneAndRemove', function (next) {
    return next('Remove document is not allowed; use findOneAndUpdate to soft delete the record');
  });

  // tslint:disable-next-line:ter-prefer-arrow-callback
  schema.pre('findByIdAndRemove', function (next) {
    return next('Remove document is not allowed; use findOneAndUpdate to soft delete the record');
  });
}
