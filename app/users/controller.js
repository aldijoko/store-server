const usersModel = require('./models')
const bcrypt = require('bcryptjs')

module.exports = {
    viewSignin: async (req, res) => {
        try {
            const alertMsg = req.flash('alertMsg')
            const alertStatus = req.flash('alertStatus')

            const alert = { msg: alertMsg, status: alertStatus }
            if(req.session.user === null || req.session.user === undefined){
                res.render('admin/users/view_signin', {
                    alert,
                    title: 'Store GG - Sign In Page'
                })
            }else {
                res.redirect('/dashboard')
            }
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/')
        }
    },
    actionSignin: async (req, res) => {
        try {
            const {email, password} = req.body
            const usersData = await usersModel.findOne({email: email})
            if(usersData){
                if(usersData.status === 'Y'){
                    const checkPassword = await bcrypt.compare(password, usersData.password)
                    if(checkPassword){
                        req.session.user = {
                            id: usersData._id,
                            email: usersData.email,
                            status: usersData.status,
                            name: usersData.name,
                        }
                        res.redirect('/dashboard')
                    }else {
                        req.flash('alertMsg', 'Password yang anda masukkan salah')
                        req.flash('alertStatus', 'danger')
                        res.redirect('/')
                    }
                }else {
                    req.flash('alertMsg', 'Akun anda belum aktif')
                    req.flash('alertStatus', 'danger')
                    res.redirect('/')
                }
            }else {
                req.flash('alertMsg', 'Email dan Password yang anda masukkan salah')
                req.flash('alertStatus', 'danger')
                res.redirect('/')
            }
        }catch(err){
            req.flash('alertMsg', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/')
        }
    },
    actionLogout: async (req, res) => {
        req.session.destroy()
        res.redirect('/')
    }
}