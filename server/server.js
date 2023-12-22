const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

//DB Connection

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('DB is Connected');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

//DB Schema

const BarkSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        tags: [String],
    },
    { timestamps: true }
);

//creates a Mongoose model named "Bark" that will be used to 
//interact with MongoDB documents that follow the structure defined in the BarkSchema

const Bark = mongoose.model("Bark", BarkSchema);


function isValidBark(body) {
    return (
        body.name &&
        body.name.trim() != "" &&
        body.content &&
        body.content.trim() != ""
    );
}

function tagParser(text) {
    return text.match(/#([a-z0-9]{1,30})/gi)
}


app.get("/", (req, res) => {
    res.json({ message: "Hi, there" });
});

app.post("/bark", async (req, res) => {
    if (isValidBark(req.body)) {
        let name = req.body.name.toString();
        let content = req.body.content.toString();
        let tags = tagParser(content);


        try {
            let bark = await Bark.create({
                name,
                content,
                tags,
            });
            res.json(bark);
        } catch (err) {
            res.jason({ err });
        }
    }
    else {
        res.status(400);
        res.json({ mesage: "Invalid Request" });
    }
});

app.get("/bark", async (req, res) => {
    let tag = req.query.tags ? "#" + req.query.tags : undefined;
    let name = req.query.name;
    let barks;

    try {
        if (tag) {
            barks = await Bark.find({ tags: tag }).sort({ createdAt: -1 }).exec();
        }
        else if (name) {
            barks = await Bark.find({ name: name }).sort({ createdAt: -1 }).exec();
        }
        else {
            barks = await Bark.find({}).sort({ createdAt: -1 }).exec();
        }
        res.json({ barks, count: barks.length });
    }
    catch (err) {
        res.json({ err });

    }
});

app.listen(PORT, () => console.log('listening on port ${PORT}...'));