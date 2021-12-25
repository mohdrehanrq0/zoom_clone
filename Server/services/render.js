const { v4: uuidv4 } = require('uuid');



exports.room = (req, res) => {
        res.redirect(`/${uuidv4()}`);
    }

exports.roomId = (req, res) => {
    res.render('rooms',{ roomId: req.params.roomId });
}

exports.thanks = (req, res) => {
    res.send("Thanks For Joining the meeting.");
}