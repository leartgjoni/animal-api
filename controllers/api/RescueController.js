const Report = require("../../models/report");
const lang = require("../../config/lang/rescue");

module.exports = {
    store(req, res, next) {
        req.checkBody('description', lang.description_required).notEmpty();
        req.checkParams('id', lang.report_id_required).notEmpty();

        var errors = req.validationErrors();
        if(!req.file){
            if(!errors)
                errors = [];
            errors.push({param: "image", msg: lang.image_required});
        }
        if(errors) {
            return res.status(400).send({errors});
        }

        Report.findOneAndUpdate(
            { _id: req.params.id, $or:[ { rescue: null }, { "rescue.deleted": true }] },
            { "rescue": {
                user: req.user.id,
                image: req.file.filename,
                description: req.body.description,
                deleted: false,
                deletedAt: null,
                createdAt: new Date()
            }})
            .then(report => {return res.send({ _id: report._id })})
            .catch(err => { console.log(err); return res.status(500).send({ error: lang.error }) });
    },
    destroy(req, res, next) {
        Report.findById(req.params.id)
            .then(report => {
                if(report.rescue && report.rescue.deleted === false){
                    if(report.rescue.user.equals(req.user.id)){
                        report.rescue.deleted = true;
                        report.rescue.deletedAt = new Date();
                        report.save()
                            .then(() => {
                                return res.send({ msg: lang.rescue_deleted_successfully })
                            })
                            .catch(err => { return res.status(500).send({ error: lang.error })});
                    } else {
                        return res.status(401).send({ error: lang.no_permission_for_action});
                    }
                } else {
                    return res.status(400).send({ error: lang.no_rescue_to_delete });
                }
            })
            .catch(err => { return res.status(500).send({ error: lang.error })});
    }
};