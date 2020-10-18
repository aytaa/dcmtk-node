const Product = require('../models/product');
const mongoose = require('mongoose');
const User = require('../models/user');
const axios = require('axios');
 
 
exports.getIndex = (req, res, next) => {
    
    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.SuccessMessage;
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;

    res.render('admin/admin-index', {
        title: 'Wado Panel',
        page_name: 'panel',
        userInfo : req.user,
        SuccessMessage : SuccessMessage,
        errorMessage : errorMessage
    });     
}

exports.getProducts = (req, res, next) => {

    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.SuccessMessage;
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;
    
    axios.get('https://api.trendyol.com/sapigw/suppliers/206008/products?size=100', {
        auth: {
            username: 'u0jI578KDj8auvxePqgP',
            password: 'YvKeb2MrHQU8PxEmw1ep'
          }
      })
        .then(data => {
            res.render('admin/products', {
                title: 'Trendyol Ürünlerim',
                products : data.data.content,
                page_name: 'pages',
                userInfo : req.user,
                SuccessMessage : SuccessMessage,
                errorMessage : errorMessage
            });
        }).catch(err => next(err));
}

exports.getAddProduct = (req, res, next) => {

    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.SuccessMessage;
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;

    res.render('admin/add-product', {
        title: 'Yeni Ürün Ekle',
        page_name: 'add-product',
        path: '/admin/add-product',
        userInfo : req.user,
        errorMessage : errorMessage,
        SuccessMessage : SuccessMessage,
    });

} 

exports.postAddProduct = (req, res, next) => {

  
    const label = req.body.label;
    const brand = req.body.brand;
    const price3 = req.body.price3;
    const barcode = req.body.barcode;
    const isActive = req.body.isActive;
    const stockType = req.body.stockType;
    const buyingPrice = req.body.buyingPrice;
    const tax = req.body.tax;
    const details = req.body.details;
    const stockCode = req.body.stockCode;
    const stockAmount = req.body.stockAmount;
    const color = req.body.color; 
    const metaDescription = req.body.metaDescription;
    const description = req.body.description;
    const ids = req.body.categoryid; 

    axios.post('https://api.trendyol.com/sapigw/suppliers/206008/products', {
        barcode: barcode,
        title : title,
        description: description,
        listPrice : listPrice ,
        salePrice : salePrice,
        vatRate : vatRate,
        quantity : quantity,
        stockCode : stockCode,
        auth: {
            username: 'u0jI578KDj8auvxePqgP',
            password: 'YvKeb2MrHQU8PxEmw1ep'
          }
      })
      .then((response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      });
}

exports.getEditProduct = (req, res, next) => {

    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.SuccessMessage;
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;

    axios.get('https://api.trendyol.com/sapigw/suppliers/206008/products?barcode', {
        auth: {
            username: 'u0jI578KDj8auvxePqgP',
            password: 'YvKeb2MrHQU8PxEmw1ep'
          },
      })
        .then(data => {
            console.log(data.data.content);
            res.render('admin/edit-product', {
                title: data.data.title,
                product : data.data.content,
                page_name: 'pages',
                userInfo : req.user,
                SuccessMessage : SuccessMessage,
                errorMessage : errorMessage
            });
        }).catch(err => next(err));
}

exports.postEditProduct = (req, res, next) => {

    const id = req.body.id;
    const label = req.body.label;
    const brand = req.body.brand;
    const price3 = req.body.price3;
    const barcode = req.body.barcode;
    const isActive = req.body.isActive;
    const stockType = req.body.stockType;
    const buyingPrice = req.body.buyingPrice;
    const tax = req.body.tax;
    const details = req.body.details;
    const stockCode = req.body.stockCode;
    const stockAmount = req.body.stockAmount;
    const color = req.body.color;
    const metaDescription = req.body.metaDescription;
    const description = req.body.description;
    const ids = req.body.categoryids;

    Product.update({ _id: id }, {
        $set: {
            label: label,
            price3: price3,
            brand: brand,
            barcode : barcode,
            isActive : isActive,
            stockType :stockType,
            buyingPrice : buyingPrice,
            tax : tax,
            details: details,
            stockCode : stockCode,
            metaDescription: metaDescription,
            stockAmount : stockAmount,
            color : color,
            description: description,
            categories: ids
        }
    }).then(() => {
        res.redirect('/admin/products?action=edit');
    }).catch(err => next(err));
}

exports.postDeleteProduct = (req, res, next) => {

    const id = req.body.productid;

    Product.deleteOne({ _id: id, userId: req.user._id })
        .then((result) => {
            if (result.deletedCount === 0) {
                return res.redirect('/');
            }
            res.redirect('/admin/products?action=delete');
        })
        .catch(err => {
            next(err);
        });
}


exports.getAddCategory = (req, res, next) => {

    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.SuccessMessage;
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;

    res.render('admin/add-category', {
        title: 'New Category',
        path: '/admin/add-category',
        page_name: 'add-categories',
        SuccessMessage : SuccessMessage,
        errorMessage : errorMessage
    }); 
}

exports.postAddCategory = (req, res, next) => {

    const name = req.body.name;
    const description = req.body.description;

    const category = new Category({
        name: name,
        description: description
    });

    category.save()
        .then(result => {
            res.redirect('/admin/categories?action=create');
        })
        .catch(err => next(err));
}

exports.getCategories = (req, res, next) => {

    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.SuccessMessage;
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;

    Category.find()
        .then(categories => {
            res.render('admin/categories', {
                title: 'Categories',
                path: '/admin/categories',
                categories: categories,
                page_name: 'categories',
                userInfo : req.user,
                SuccessMessage : SuccessMessage,
                errorMessage : errorMessage
            });
        }).catch(err => next(err));
} 
 

exports.getEditCategory = (req, res, next) => {

    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.SuccessMessage;
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;

    Category.findById(req.params.categoryid)
        .then(category => {
            res.render('admin/edit-category', {
                title: 'Edit Category',
                path: '/admin/categories',
                category: category,
                page_name: 'edit-categories',
                userInfo : req.user,
                SuccessMessage : SuccessMessage,
                errorMessage : errorMessage
            })
        })
        .catch(err => next(err));
}
 
exports.postEditCategory = (req, res, next) => {

    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;

    Category.findById(id)
        .then(category => {
            category.name = name;
            category.description = description;
            return category.save();
        }).then(() => {
            res.redirect('/admin/categories');
        })
        .catch(err => next(err));

}

exports.postDeleteCategory = (req, res, next) => {
    const id = req.body.categoryid;

    Category.findByIdAndRemove(id)
        .then(() => {
            res.redirect('/admin/categories?action=delete');
        })
        .catch(err => {
            next(err);
        })
}

exports.getPages = (req, res, next) => {

    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.SuccessMessage;
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;

    Page.find()
        .then(pages => {
            res.render('admin/pages', {
                title: 'Sayfa İşlemleri',
                path: '/admin/pages',
                pages: pages,
                page_name: 'pages',
                userInfo : req.user,
                SuccessMessage : SuccessMessage,
                errorMessage : errorMessage
            });
        }).catch(err => next(err));
} 

exports.getOrders = (req, res, next) => {

    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.SuccessMessage;
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;
    
    axios.get('https://api.trendyol.com/sapigw/suppliers/206008/orders', {
        auth: {
            username: 'u0jI578KDj8auvxePqgP',
            password: 'YvKeb2MrHQU8PxEmw1ep'
          }
      })
        .then(data => {
            console.log(data.data.content);
            res.render('admin/orders', {
                title: 'Trendyol Siparişlerim',
                orders : data.data.content,
                page_name: 'pages',
                userInfo : req.user,
                SuccessMessage : SuccessMessage,
                errorMessage : errorMessage
            });
        }).catch(err => next(err));

}

exports.getCanceledOrders = (req, res, next) => {

    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.SuccessMessage;
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;

    
    
    axios.get('https://api.trendyol.com/sapigw/suppliers/206008/claims', {
        auth: {
            username: 'u0jI578KDj8auvxePqgP',
            password: 'YvKeb2MrHQU8PxEmw1ep'
          }
      })
        .then(data => {
            console.log(data.data.content.items);
            res.render('admin/canceled', {
                title: 'Trendyol İadelerim',
                orders : data.data.content,
                page_name: 'pages',
                userInfo : req.user,
                SuccessMessage : SuccessMessage,
                errorMessage : errorMessage
            });
        }).catch(err => next(err));

}

exports.getQuestions = (req, res, next) => {

    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.SuccessMessage;
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;
    
    axios.get('https://api.trendyol.com/sapigw/suppliers/206008/questions/filter', {
        auth: {
            username: 'u0jI578KDj8auvxePqgP',
            password: 'YvKeb2MrHQU8PxEmw1ep'
          }
      })
        .then(data => {
            console.log(data.data.content);
            res.render('admin/questions', {
                title: 'Trendyol Sorularım',
                questions : data.data.content,
                page_name: 'questions',
                userInfo : req.user,
                SuccessMessage : SuccessMessage,
                errorMessage : errorMessage
            });
        }).catch(err => next(err));

}


exports.getEditPage = (req, res, next) => {

    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.SuccessMessage;
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;

    Page.findById(req.params.pageid)
        .then(page => {
            res.render('admin/edit-page', {
                title: 'Sayfa Düzenle',
                path: '/admin/pages',
                page: page,
                page_name: 'edit-page',
                userInfo : req.user,
                SuccessMessage : SuccessMessage,
                errorMessage : errorMessage
            })
        })
        .catch(err => next(err));
}

exports.postAddPage = (req, res, next) => {

    const name = req.body.name;
    const description = req.body.description;

    const page = new Page({
        name: name,
        description: description
    });

    page.save()
        .then(result => {
            console.log(result)
            res.redirect('/admin/pages?action=create');
        })
        .catch(err => next(err));
}

exports.postEditPage = (req, res, next) => {

    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;

    Page.findById(id)
        .then(page => {
            page.name = name;
            page.description = description;
            return page.save();
        }).then(() => {
            res.redirect('/admin/pages');
        })
        .catch(err => next(err));
 
}

exports.getAccounts = (req, res, next) => {
    
    const SuccessMessage = req.session.SuccessMessage;
    const errorMessage = req.session.SuccessMessage;
    delete req.session.SuccessMessage;
    delete req.session.errorMessage;

    User.find()
    .then(accounts =>{
    console.log(accounts);
    res.render('admin/accounts', {
        title: 'Marjinals Kullanıcı Listesi',
        page_name: 'accounts',
        accounts: accounts,
        userInfo : req.user,
        SuccessMessage : SuccessMessage,
        errorMessage : errorMessage
    });     
})

}