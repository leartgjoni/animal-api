const Report = require("../../models/report");
const lang = require('../../config/lang/report');

module.exports = {
    index(req, res, next) {
        const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        Report.find({$or:[ {'rescue': null}, {'rescue.deleted': true}]})
            .populate("user")
            .skip((page-1)*pagination)
            .limit(pagination)
            .sort({ createdAt: -1})
            .then(reports => {
                return res.send({ reports, page, pagination });
            })
            .catch(err => { console.log(err); return res.status(500).send({error: lang.error})});
    },
    indexRescued(req, res, next) {
        const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        Report.find({ rescue: { $ne: null}, "rescue.deleted": false })
            .populate(["user", "rescue.user"])
            .skip((page-1)*pagination)
            .limit(pagination)
            .sort({ updatedAt: -1})
            .then(reports => {
                return res.send({ reports, page, pagination });
            })
            .catch(err => { return res.status(500).send({error: lang.error})});
    },
    store(req, res, next) {
        req.checkBody('description', lang.description_required).notEmpty();
        req.checkBody('address', lang.address_required).notEmpty();
        req.checkBody('latitude', lang.latitude_required).notEmpty();
        req.checkBody('longitude', lang.longitude_required).notEmpty();

        var errors = req.validationErrors();
        if(!req.file){
            if(!errors)
                errors = [];
            errors.push({param: "image", msg: lang.image_required});
        }
        if(errors) {
            return res.status(400).send({errors});
        }

        const newReport = new Report();
        newReport.user = req.user.id;
        newReport.image = req.file.filename;
        newReport.description = req.body.description;
        newReport.address = req.body.address;
        newReport.geometry = { type: 'Point', coordinates: [req.body.longitude, req.body.latitude]};

        newReport.save()
                .then(newReport => {
                    return res.send({ _id: newReport._id });
                })
                .catch( err => { return res.status(500).send({ error: lang.error }) });
    },
    show(req, res, next){
        req.checkParams('id', 'Report id is required').notEmpty();
        var errors = req.validationErrors();

        if(errors) {
            return res.status(400).send({errors});
        }

        Report.findById(req.params.id)
            .populate([
                'user', 'rescue.user'
            ])
            .then(report => {
                res.send({ report });
            })
            .catch(err => { return res.status(500).send({ error: lang.error }) });
    },
    destroy(req, res, next) {
        Report.findById(req.params.id)
            .then(report => {
                if(report.user.equals(req.user.id)){
                    report.delete()
                        .then( () => {
                            return res.send({ msg: lang.report_deleted_successfully })
                        })
                        .catch(err => { return res.status(500).send({ error: lang.error })});
                } else {
                    return res.status(401).send({ error: lang.no_permission_for_action});
                }
            })
            .catch(err => { return res.status(500).send({ error: lang.error })});
    }
};