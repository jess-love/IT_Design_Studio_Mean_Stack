const express = require('express');
const router = express.Router();
const Assignment = require('./assignment');

// GET all assignments
router.get('/', async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);
    } catch (error) {
        res.status(500).send(error);
    }
});

// POST create assignment
router.post('/', async (req, res) => {
    try {
        const newAssignment = new Assignment(req.body);
        await newAssignment.save();
        res.json(newAssignment);
    } catch (error) {
        res.status(500).send(error);
    }
});

// DELETE one assignment by ID
router.delete('/:id', (req, res) => {
    Assignment.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(200).json({ message: 'Deleted' });
        })
        .catch(err => {
            res.status(500).json({ error: 'Delete failed' });
        });
});
// UPDATE an assignment by ID
router.put('/:id', (req, res) => {
    Assignment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // return updated document
    )
    .then(updated => {
        res.status(200).json(updated);
    })
    .catch(err => {
        console.error("Update failed:", err);
        res.status(500).json({ error: 'Update failed' });
    });
});



module.exports = router;
