"use strict";

var express = require('express'),
    Item = require('../src/Item'),
    router = express.Router();

// Get Item By ID
router.get('/item/:item_id', function (req, res) {
    console.log("Get Item " + req.params.item_id);
    var item_id = Number(req.params.item_id);
    var item = new Item();
    item.fetchItem(item_id, function (err, post) {
        if (err) return res.status(403).send(err).end();
        return res.json(post);
    });
});

// Create New Item
router.post('/item/create', function (req, res) {
    var item = new Item();
    item.setNewValues(req.body.item);
    item.createNewItem(function (err, result) {
        if (err) return res.status(403).send(err).end();
        return res.status(200).json({ "item": item.toJSON() }).end();
    });
});

// Update Item By ID
router.put('/item/:item_id', function (req, res) {
    console.log("Update Item " + req.params.item_id);
    res.json({"message": "UPDATE ITEM " + req.params.item_id + " success"});
});

// Delete Item By ID
router.delete('/item/:item_id', function (req, res) {
    console.log("Delete Item " + req.params.item_id);
    res.json({"message": "DELETE ITEM " + req.params.item_id + " success"});
});

module.exports = router;