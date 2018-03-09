const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const mongoose_delete = require('mongoose-delete');
const User = require('./user');

const PointSchema = new Schema({
    type: { type: String, default: 'Point' },
    coordinates: {type: [Number], index: '2dsphere'}
});

const RescueSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    image: { type: String, required: true },
    description: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    createdAt: { type: Date }
});

const reportSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    image: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    geometry: PointSchema,
    rescue: RescueSchema,
}, { timestamps: true });

reportSchema.plugin(mongoose_delete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model('report', reportSchema);