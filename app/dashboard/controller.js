const transactionModel = require('../transaction/models')
const voucherModel = require('../voucher/models')
const playerModel = require('../player/models')
const categoryModel = require('../category/models')

module.exports = {
    index: async (req, res, next) => {
        try {
            const transaction = await transactionModel.countDocuments()
            const voucher = await voucherModel.countDocuments()
            const player = await playerModel.countDocuments()
            const category = await categoryModel.countDocuments()
            res.render('admin/dashboard/view_dashboard', {
                name: req.session.user.name,
                title: 'Store GG - Dashboard',
                count: {
                    transaction,
                    voucher,
                    player,
                    category
                }
            })
            next()
        }catch(err){
            console.log(err);
        }
    }
}