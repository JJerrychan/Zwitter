const router = require("express").Router();
const { Router } = require("express");
const Message = require("../data/messages")

router.post("/", async (req, res) => {
    const newMessage = new Message(req.body)

    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (error) {
        res.status.json(error)
    }
})

router.get("/:conversationId", async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        })
        res.status(200).json(messages);
    } catch (error) {
        res.status.json(error)
    }
})