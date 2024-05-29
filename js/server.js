/*const express = require("express");
const mongoose = require("mongoose");
const io = require("socket.io")(3001, {
    cors: {origin: "*"}
});

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/prism")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => {
        console.log("MongoDB connection error", err);
    });

const playerSchema = new mongoose.Schema({
    username: String,
    scores: { type: Map, of: Number },
    levelsCompleted: [Number]
});

const Player = mongoose.model("Player", playerSchema);
module.exports = { Player };

const feedbackSchema = new mongoose.Schema({
    type: String,
    message: String
})

const Feedback = mongoose.model("Feedback", feedbackSchema);

io.on("connection", (socket) => {
    console.log("New player connected");

    socket.on("get-scores", async (username) => {
        try {
            const player = await Player.findOne({ username: username });
            if (player) {
                socket.emit("send-scores", player.scores);
            } else {
                socket.emit("send-scores", {});
            }
        } catch (err) {
            console.error("Error fetching scores:", err);
            socket.emit("send-scores", {});
        }
    });
    
    
    socket.on("update-score", async ({username, level, score }) => {
        console.log(`Updating score [${username}, level ${level}, ${score}]`);
        try {
            let player = await Player.findOne({ username: username });
    
            if (!player) {
                player = new Player({
                    username,
                    scores: new Map(),
                    levelsCompleted: []
                });
            }
    
            const previousScore = player.scores.get(String(level)) || 0;
            if (score > previousScore) {
                player.scores.set(String(level), score);
                await player.save();
                console.log(`Score updated for [${username}, level ${level}]`);
            } else {
                console.log(`New score (${score}) is not greater than previous score (${previousScore}).`);
            }
        } catch (err) {
            console.log("Error updating score", err);
        }
    });

    socket.on("update-progress", async ({ username, level }) => {
        console.log(`Updating progress [${username}, level ${level}]`);
        try {
            let player = await Player.findOne({ username: username });

            if (!player) {
                player = new Player({
                    username,
                    scores: new Map(),
                    levelsCompleted: []
                });
            }

            if (!player.levelsCompleted.includes(String(level))) {
                player.levelsCompleted.push(String(level));
            }

            await player.save();
        } catch (err) {
            console.log("Error updating levels completed", err);
        }
    });

    socket.on("submit-feedback", async (feedback) => {
        try {
            const newFeedback = new Feedback({
                type: "feedback",
                message: feedback
            });
            await newFeedback.save();
            console.log("Feedback saved successfully.");
        } catch (err) {
            console.error("Error saving feedback:", err);
        }
    });
    
    socket.on("reset-account", async (username) => {
        try {
            await Player.deleteOne({ username: username });
            console.log(`Account ${username} has been reset.`);
        } catch (err) {
            console.error("Error resetting account:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected");
    });
});

app.listen(3000, () => {
    console.log("Server is running");
});*/
