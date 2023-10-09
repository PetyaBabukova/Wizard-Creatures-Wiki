const router = require('express').Router();
const userManager = require('../managers/userManager');
const creaturesManager = require('../managers/creaturesManager');
const { TOKEN_KEY } = require('../config/config');
const { getErrorMessage } = require('../utils/errorHelpers');
const Creature = require('../models/Creature')


router.get('/login', (req, res) => {
    res.render('users/login')
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const token = await userManager.login(email, password);

        res.cookie(TOKEN_KEY, token);

        res.redirect('/');

    } catch (err) {
        res.render('users/login', { error: getErrorMessage(err) });
    }
});

router.get('/register', (req, res) => {
    res.render('users/register')
});

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, repeatPassword } = req.body;


    try {
        const token = await userManager.register({ firstName, lastName, email, password, repeatPassword });
        res.cookie(TOKEN_KEY, token); 
        res.redirect('/');

    } catch (err) {
        res.render('users/register', { error: getErrorMessage(err), email });
        console.log(err);
    }

});

router.get('/logout', (req, res) => {
    res.clearCookie('token');

    res.redirect('/');
});

router.get('/profile', async (req, res) =>{

    await creaturesManager.getAllOwnCreatures(req.user._id)
    .then(ownCreatures => {

        res.render('users/profile', { ownCreatures: ownCreatures });
    })
    .catch(err => console.log(err));

        
    
})






module.exports = router;