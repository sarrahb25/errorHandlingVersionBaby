const express = require('express');
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    })
})

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message: 'Order were created',
        order: order
    })
})

router.get('/:oerderId', (req, res, next) => {

    res.status(200).json({
        message: 'Order details',
        orderId: req.params.oerderId
    })
})

router.patch('/:oerderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order updated'
    })
})

router.delete('/:oerderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted'
    })
})
module.exports = router;