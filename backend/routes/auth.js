const express = require('express');

const router = express.Router();
const User = require('../models/User')

const { body, validationResult } = require('express-validator'); // using express-validator for validation
const bcrypt = require('bcryptjs'); // using bcrypt for hashing passwords
const jwt = require('jsonwebtoken') // using jwt for authetication

const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Ankitisthebestpersonever#bor$n';

// ROUTE 1 : Create a user using POST "/api/auth/createuser". No Login Required

router.post('/createuser', [ // validation via express-validator (docs)
    body('name', 'Enter a valid Name').isLength({ min: 2 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be atleast 6 characters').isLength({ min: 6 }),
], async (req, res) => {

    let success=false;

    // if there is any error in validation then show bad request along with the errors (docs)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }
    try {
        // check for unique username
        // let user = await User.findOne({ username: req.body.username })
        // if (user) {
        //     return res.status(400).json({ success,error: 'A user with this email already exists' });
        // }
        // check for unique email
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success,error: 'A user with this email already exists' })
        }
        // if none of the above is true, then create a new user

        const salt = await bcrypt.genSalt(10);

        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            // username: req.body.username,
            email: req.body.email,
            password: secPass,
        })

        // using JWT

        // using the id of the user as a data to generate a token for signing the jwt
        const data = {
            user: {
                id: user.id
            }
        }

        // using sign function of jwt which takes in data and the secret string
        const authToken = jwt.sign(data, JWT_SECRET); // sign is a synchronous function, so no awaits
        success = true;
        res.json({ success, authToken }); // similar : res.json({authToken: authToken});



    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})


// ROUTE 2 : Autheticate a User using POST "/api/auth/login". No Login Required

router.post('/login', [ // validation via express-validator (docs)
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

    let success = false;

    // if there is any error in validation then show bad request along with the errors (docs)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Please login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }

        // using sign function of jwt which takes in data and the secret string
        const authToken = jwt.sign(data, JWT_SECRET); // sign is a synchronous function, so no awaits
        success = true;
        res.json({ success, authToken }); // similar : res.json({authToken: authToken});


    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})

// ROUTE 3 : Get logged in User Details using POST "/api/auth/getuser". Login Required

router.post('/getuser', fetchuser, async (req, res) => { // passing the fetchuser middleware which runs before the actual function below
    try {
        userid = req.user.id;
        const user = await User.findById(userid).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})
module.exports = router;