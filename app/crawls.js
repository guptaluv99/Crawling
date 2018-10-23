var express = require('express');
var router = express.Router();
var crawl = require('./models/crawl');

router.post('/go', function (req, res)   {
    var url = req.body;
    
    
    
    
    
    
    
    var data = new view({user: data.user});
    data.save(function (err, data) {
        console.log('Saving')
        if (err) return console.error(err);
        
        res.json(data);
    });
});

module.exports = router;