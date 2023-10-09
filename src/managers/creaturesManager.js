const Creature = require('../models/Creature');
const { login } = require('./userManager');

exports.create = (creatureData) => Creature.create(creatureData);

exports.getAll = () => Creature.find().lean();

exports.getOne = (creatureId) => Creature.findById(creatureId).populate('owner').populate('votes');

exports.edit = (creatureId, creatureData) => Creature.findByIdAndUpdate(creatureId, creatureData);

exports.delete = (creatureId,) => Creature.findByIdAndDelete(creatureId);

exports.vote = async (creatureId, userId) => {
    const creature = await Creature.findById(creatureId);

    if (!creature.votes.includes(userId.toString())) {
        creature.votes.push(userId);
        await creature.save();
    }
    return creature;
};