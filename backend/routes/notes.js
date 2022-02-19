const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes')
const fetchuser = require('../middleware/fetchuser'); // using fetchuser middleware
const { body, validationResult } = require('express-validator'); // using express-validator for validation

// ROUTE 1 : Get all the notes using GET "/api/notes/fetchallnotes". Login Required
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        // find the note from the database
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})

// ROUTE 2 : Add a new note using POST "/api/notes/addnote". Login Required
router.post('/addnote', fetchuser, [
    body('title', 'Title must be atleast 3 characters long').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters long').isLength({ min: 5 }),
], async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // if there is any error in validation then show bad request along with the errors (docs)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // create a the note in a variable called note and then save it to the database
        const note = new Notes({
            title, description, tag, user: req.user.id
        })

        const savedNote = await note.save()

        res.json(savedNote)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }

})


// ROUTE 3 : Update an existing note using PUT "/api/notes/updatenote/:id". Login Required
// for updating use put method
router.put('/updatenote/:id', fetchuser, [
    body('title', 'Title must be atleast 3 characters long').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters long').isLength({ min: 5 }),
], async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        // create a newNote object
        const newNote = {};
        if (title) { newNote.title = title }; // if title from the req.body exists then put it in newNote;
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // firstly check if the id in the params (/updatenote/:id wali id) actually exists
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Now check if the user logged in (found using middleware) and the user id associated with the fetched note is the same or not
        if (note.user.toString() !== req.user.id) {
            return res.send(401).send('Not Allowed');
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }

})

// ROUTE 4 : Delete an existing note using DELETE "/api/notes/updatenote/:id". Login Required
// for deleting use delete method
router.delete('/deletenote/:id', fetchuser, [
    body('title', 'Title must be atleast 3 characters long').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters long').isLength({ min: 5 }),
], async (req, res) => {
    try {
        // firstly check if the id in the params (/deletenote/:id wali id) actually exists
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }
        // Now check if the user logged in (found using middleware) and the user id associated with the fetched note is the same or not (basically if the user owns the note, then only delete it)
        if (note.user.toString() !== req.user.id) {
            return res.send(401).send('Not Allowed');
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }

})
module.exports = router;