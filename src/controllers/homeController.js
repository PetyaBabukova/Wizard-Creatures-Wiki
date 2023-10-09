const router = require('express').Router();
const creaturesManager = require('../managers/creaturesManager')

router.get('/', async (req, res) => {

    await creaturesManager.getAll()
        .then((animals) => {

            
            res.render('home', {animals: animals.slice(-3)});
            
        }).catch(err=> console.log(err))



    });

    router.get('/404', (req, res)=>{
        res.render('home/404')
    })
    
    module.exports = router;

