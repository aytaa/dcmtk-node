const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const crypto = require('crypto');
/* Transporter Nodemailer. */

const transporter = nodemailer.createTransport({
    direct:true,
      host: 'smtp.yandex.com.tr',
      port: 465,
      auth: {
          user: 'info@selimkozmetik.com',
          pass: 'Odak1098!&' 
        },
      secure: true
  });
  
  /* Verify mail settings. */
transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

   /* Verify mail themes. */
  transporter.use('compile', hbs({
    viewEngine: 'express-handlebars',
    viewPath: './views/'
  }));

exports.getLogin = (req, res, next) => {
    
    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.errorMessage;
    
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;

    res.render('account/login', 
      { 
        title: 'Marjinal Panel | Giriş Yap' ,
        errorMessage : errorMessage,
        SuccessMessage : SuccessMessage,
        userInfo : req.session.user
      });
} 

exports.postLogin = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
  
    User.findOne({ email: email , status : true })
        .then(user => {
            if (!user) {
                req.session.errorMessage = 'Bu mail adresi ile bir kayıt bulunamamıştır.';
                req.session.save(function (err) {
                    console.log(err);
                    return res.redirect('/login');
                })
            }
            bcrypt.compare(password, user.password)
                .then(isSuccess => {
                    if (isSuccess) {
                        req.session.user = user;
                        req.session.isAuthenticated = true;
                        req.session.SuccessMessage = 'Hoşgeldin ! ' + user.name;
                        req.session.save(function (err) {
                            console.log(err);
                        })
                        return req.session.save(function (err) {
                            var url = req.session.redirectTo || '/';
                            delete req.session.redirectTo;
                            return res.redirect(url);
                        });
                    }
                    res.redirect('/login');
                    req.session.errorMessage = 'Hatalı E-posta yada şifre';
                    req.session.save(function (err) {
                        console.log(err);
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => console.log(err));
}

exports.getRegister = (req, res, next) => {
    
    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.errorMessage;
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;

    res.render('account/register', {
        path: '/register',
        title: 'Marjinals | Kayıt Ol',
        errorMessage: errorMessage,
        SuccessMessage : SuccessMessage
    });
}

exports.postRegister = (req, res, next) => {
    
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                req.session.errorMessage = 'Bu mail adresi ile daha önce kayıt olunmuş.';
                req.session.save(function (err) {
                    console.log(err);
                    return res.redirect('/register');
                })
            }

            return bcrypt.hash(password, 10);
        })
        .then(hashedPassword => {
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return newUser.save();
        })
        .then(() => {
            res.redirect('/login');

            const msg = {
                to: email,
                from: 'info@sadikturan.com',
                subject: 'Hesap Oluşturuldu.',
                html: '<h1>Hesabınız başarılı bir şekilde oluşturuldu.</h1>',
            };

            sgMail.send(msg);

        }).catch(err => {
            if (err.name == 'ValidationError') {
                let message = '';
                for (field in err.errors) {
                    message += err.errors[field].message + '<br>';
                }
                res.render('account/register', {
                    path: '/register',
                    title: 'Register',
                    errorMessage: message
                });
            } else {
                next(err);
            }
        })
}


exports.postNewUser= (req, res, next) => {
    
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                req.session.errorMessage = 'Bu mail adresi ile daha önce kayıt olunmuş.';
                req.session.save(function (err) {
                    console.log(err);
                    return res.redirect('/');
                })
            }

            return bcrypt.hash(password, 10);
        })
        .then(hashedPassword => {
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword,
            });
            return newUser.save();
        })
        .then(() => {
            res.redirect('/accounts');
            let mailOptions = {
                from: 'info@marjinals.com', // TODO: email sender
                to: email , // TODO: email receiver
                subject: 'Üyeliğiniz başarılı bir şekilde oluşturuldu',
                html: 'Üyeliğiniz başarılı bir şekilde oluşturuldu.Size verilen şifre ile giriş yapabilirsiniz'
            };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
        }).catch(err => {
            if (err.name == 'ValidationError') {
                let message = '';
                for (field in err.errors) {
                    message += err.errors[field].message + '<br>';
                }
                res.render('account/register', {
                    path: '/',
                    title: 'Marjinal Marketplace',
                    errorMessage: message
                });
            } else {
                next(err);
            }
        })
}


exports.getReset = (req, res, next) => { 

    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.errorMessage;
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;
  
    res.render('account/reset-password' , 
    {
      title : 'Marjinal Panel | Şifremi Unuttum',
      errorMessage : errorMessage,
      SuccessMessage : SuccessMessage
    });
}

exports.postReset = (req, res, next) => {

    const email = req.body.email;

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.redirect('/reset-password');
        }
        const token = buffer.toString('hex');

        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.session.errorMessage = 'Böyle bir kullanıcı bulunamadı !.';
                    req.session.save(function (err) {
                        return res.redirect('/reset-password');
                    })
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;

                return user.save();
            }).then(result => {
                req.session.SuccessMessage = 'Şifre yenileme bağlantısı ' + email +' adresine başarıyla gönderildi.';
                req.session.save(function (err) {
                    return res.redirect('/login');
                })
                let mailOptions = {
                    from: 'info@marjinals.com', // TODO: email sender
                    to: email , // TODO: email receiver
                    subject: 'Şifre yenileme talebi',
                    template: 'reset-password',
                    context: {
                      token: token
                  }
                };
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
            }).catch(err => { next(err); });
    });

}

exports.getNewPassword = (req, res, next) => {

    var SuccessMessage = req.session.SuccessMessage;
    var errorMessage = req.session.errorMessage;

    delete req.session.SuccessMessage;
    delete req.session.errorMessage;
 
    const token = req.params.token;

    User.findOne({
        resetToken: token, resetTokenExpiration: {
            $gt: Date.now()
        }
    }).then(user => {
        res.render('account/new-password', {
            path: '/new-password',
            title: 'Marjinals | Yeni Şifre',
            errorMessage: errorMessage,
            SuccessMessage :SuccessMessage,
            userId: user._id.toString(),
            passwordToken: token
        });
    }).catch(err => {
        next(err);
    })
}

exports.postNewPassword = (req, res, next) => {

    const newPassword = req.body.password;
    const userId = req.body.userId;
    const token = req.body.passwordToken;
    let _user;

    User.findOne({
        resetToken: token,
        resetTokenExpiration: {
            $gt: Date.now()
        },
        _id: userId
    }).then(user => {
        _user = user;
        return bcrypt.hash(newPassword, 10);
    }).then(hashedPassword => {
        _user.password = hashedPassword;
        _user.resetToken = undefined;
        _user.resetTokenExpiration = undefined;
        return _user.save();
    }).then(() => {
        res.redirect('/login');
    }).catch(err => { next(err); });
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}

