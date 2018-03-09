const Report = require('../../models/report');

module.exports = {
    async index(req, res, next){
        const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const total = await Report.find({}).count();
        Report.find({})
            .populate(["user", "rescue.user"])
            .skip((page-1)*pagination)
            .limit(pagination)
            .sort({ createdAt: -1})
            .then(reports => {
                return res.render('admin/report/index', { reports, page, pagination, total });
            })
            .catch(err => next(err));
    },
    destroy(req, res, next) {
        Report.findById(req.params.id)
            .then(report => {
                    report.delete()
                        .then( () => {
                            req.flash('messages', ['Report deleted successfully']);
                            res.redirect("back");
                        })
                        .catch(err => next(err));
            })
            .catch(err => next(err));
    },
    destroyRescue(req, res, next){
        Report.findByIdAndUpdate(req.params.id, { "rescue.deleted": true, "rescue.deletedAt": new Date()})
            .then(() => {
                req.flash('messages', ['Rescue deleted successfully']);
                res.redirect("back");
            })
            .catch(err => next(err));
    }
};