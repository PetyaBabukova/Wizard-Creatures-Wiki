const router = require('express').Router();
const creaturesManager = require('../managers/creaturesManager');

router.get('/', async (req, res) => {
    try {
        const creatures = await creaturesManager.getAll();
        res.render('creatures', { creatures });
    } catch (error) {
        res.status(404).render('home', { error: 'Failed to fetch creatures.' });
    }
});

router.get('/create', (req, res) => {
    try {
        res.render('creatures/create');
        
    } catch (error) {
        res.status(404).render('home', { error: 'Failed to get Add creature page.' });
    }
});

router.post('/create', async (req, res) => {
    const creatureData = {
        ...req.body,
        owner: req.user._id
    }

    try {
        await creaturesManager.create(creatureData)
        res.redirect('/creatures')

    } catch (error) {

        res.render('creatures/create', {
            error: 'creature creation failed',
            data: creatureData
        });
    }
});

router.get('/:creatureId/details', async (req, res) => {
    try {
        const creatureId = req.params.creatureId;
        const creature = await creaturesManager.getOne(creatureId).lean();

        if (!creature) {
            res.status(404).send("creature not found");
            return;
        }

        let hasVoted = creature.votes.toString().includes(req.user?._id.toString());
        const isOwner = req.user?._id.toString() === creature.owner._id.toString();
        const isLogged = Boolean(req.user);

        res.render('creatures/details', { ...creature, isOwner, isLogged, hasVoted });
        
    } catch (error) {
        res.status(500).send('An error occurred while retrieving creature details.');
        console.log(error);
    }
});


router.get('/:creatureId/edit', async (req, res) => {
    const creatureId = req.params.creatureId;

    try {
        const creature = await creaturesManager.getOne(creatureId).lean();
        res.render('creatures/edit', { ...creature })

    } catch (error) {
        res.render('home', {error: 'Edit creature Edit page failed'})
    }
});

router.post('/:creatureId/edit', async (req, res) => {
    const creatureId = req.params.creatureId;
    const creatureData = req.body

    try {
        const creature = await creaturesManager.edit(creatureId, creatureData);
        res.redirect('/creatures');
    } catch (error) {
        res.render('creatures/edit', { error: 'Unable to update creature', ...creatureData })
    }

});

router.get('/:creatureId/delete', async (req, res) => {

    try {
        const creatureId = req.params.creatureId;
        await creaturesManager.delete(creatureId);
        res.redirect('/creatures')

    } catch (error) {
        res.redirect(`/creatures/${creatureId}/details`, { error: 'Unsuccessful deletion' })
    }

})

router.get('/:creatureId/vote', async (req, res) => {
    const creatureId = req.params.creatureId;
    const user = req.user;
    const creature = await creaturesManager.getOne(creatureId).lean();

    const isOwner = req.user?._id.toString() === creature.owner._id.toString();
    const isLogged = Boolean(req.user);
    // console.log(isLogged);

    if (isLogged && !isOwner) {
        try {
            await creaturesManager.vote(creatureId, user._id);
            res.redirect(`/creatures/${creatureId}/details`);
        } catch (err) {

            console.log(err);
            res.render('creatures/details', {...creature,
                error: 'You cannot vote',
                isOwner,
                isLogged,
            });
        }
    } else {
        res.redirect(`/creatures/${creatureId}/details`);
    }
});

module.exports = router;