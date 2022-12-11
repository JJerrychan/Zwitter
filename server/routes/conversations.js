const router = require("express").Router();
const { Router } = require("express");
const Conversation = require("../models/Conversation")

//new conv

router.post("/", async (req, res) => {
    const newConversation = new Conversation({
        members:[req.body.senderId, req.body.revceiverId],
    });

    try {
        const savedConversation = await new Conversation.save();
        res.status(200).json(savedConversation);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;