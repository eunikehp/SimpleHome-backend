const express = require('express');
const Product = require('../models/product');

const productRouter = express.Router();

productRouter.route('/')
.get((req, res, next) => {
    Product.find()
    .then(products => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(products);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Product.create(req.body)
    .then(product => {
        console.log('product Created ', product);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /products');
})
.delete((req, res, next) => {
    Product.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

productRouter.route('/:productId')
.get((req, res, next) => {
    Product.findById(req.params.productId)
    .then(product => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /products/${req.params.productId}`);
})
.put((req, res, next) => {
    Product.findByIdAndUpdate(req.params.productId, {
        $set: req.body
    }, { new: true })
    .then(product => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Product.findByIdAndDelete(req.params.productId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

productRouter.route('/:productId/reviews')
.get((req, res, next) => {
    Product.findById(req.params.productId)
    .then(product => {
        if (product) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(product.reviews);
        } else {
            err = new Error(`product ${req.params.productId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Product.findById(req.params.productId)
    .then(product => {
        if (product) {
            product.reviews.push(req.body);
            product.save()
            .then(product => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(product);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Product ${req.params.productId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /products/${req.params.productId}/reviews`);
})
.delete((req, res, next) => {
    Product.findById(req.params.productId)
    .then(product => {
        if (product) {
            for (let i = (product.reviews.length-1); i >= 0; i--) {
                product.reviews.id(product.reviews[i]._id).remove();
            }
            product.save()
            .then(product => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(product);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Product ${req.params.productId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

productRouter.route('/:productId/reviews/:reviewId')
.get((req, res, next) => {
    Product.findById(req.params.productId)
    .then(product => {
        if (product && product.reviews.id(req.params.reviewId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(product.reviews.id(req.params.reviewId));
        } else if (!product) {
            err = new Error(`Product ${req.params.productId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Review ${req.params.reviewId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /products/${req.params.productId}/reviews/${req.params.reviewId}`);
})
.put((req, res, next) => {
    Product.findById(req.params.productId)
    .then(product => {
        if (product && product.reviews.id(req.params.reviewId)) {
            if (req.body.rating) {
                product.reviews.id(req.params.reviewId).rating = req.body.rating;
            }
            if (req.body.text) {
                product.reviews.id(req.params.reviewId).text = req.body.text;
            }
            product.save()
            .then(product => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(product);
            })
            .catch(err => next(err));
        } else if (!product) {
            err = new Error(`Product ${req.params.productId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Review ${req.params.reviewId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Product.findById(req.params.productId)
    .then(product => {
        if (product && product.reviews.id(req.params.reviewId)) {
            product.reviews.id(req.params.reviewId).remove();
            product.save()
            .then(product => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(product);
            })
            .catch(err => next(err));
        } else if (!product) {
            err = new Error(`Product ${req.params.productId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Review ${req.params.reviewId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = productRouter;