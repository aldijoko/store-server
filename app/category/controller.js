const categoryModel = require('./models');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMsg = req.flash('alertMsg')
            const alertStatus = req.flash('alertStatus')

            const alert = { msg: alertMsg, status: alertStatus }
            const categoryData = await categoryModel.find()

            res.render('admin/category/view_category', {
                categoryData,
                alert,
                name: req.session.user.name,
                title: 'Store GG - Category Page'
            })
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    viewCreate: async (req, res) => {
        try {
            res.render('admin/category/create', {
                name: req.session.user.name,
                title: 'Store GG - Add Category Page'
            })
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { name } = req.body;
            let result = await categoryModel({ name })
            await result.save()

            req.flash('alertMsg', 'Success Add category')
            req.flash('alertStatus', 'success')

            res.redirect('/category')
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const categoryData = await categoryModel.findOne({ _id: id })
            res.render('admin/category/edit', {
                categoryData,
                name: req.session.user.name,
                title: 'Store GG - Edit Category Page'
            })
        } catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    actionEdit: async (req, res) => {
        try{
            const { id } = req.params;
            const { name } = req.body;
            await categoryModel.findOneAndUpdate({ _id: id }, { name })

            req.flash('alertMsg', 'Success edit category')
            req.flash('alertStatus', 'success')

            res.redirect('/category')

        } catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
            await categoryModel.findOneAndRemove({ _id: id })

            req.flash('alertMsg', 'Success Delete category')
            req.flash('alertStatus', 'success')

            res.redirect('/category')
        }
        catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    }
}