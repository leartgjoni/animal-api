const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const mongoose_delete = require('mongoose-delete');

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, default: '' },
    name: { type: String, required: true },
    image: { type: String, default: 'user.png' },
}, { timestamps: true });

userSchema.plugin(mongoose_delete, { deletedAt: true, overrideMethods: true });

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password );
};

userSchema.pre('delete', function(next){
    const Report = mongoose.model('report');
    Report.delete({ user: this})
        .then(() => {
            Report.update({ "rescue.user": this  }, { "rescue.deleted": true, "rescue.deletedAt": new Date() })
                .then(() => next())
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

module.exports = mongoose.model('user', userSchema);