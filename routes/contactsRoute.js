const express = require("express")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const router = express.Router()
const { Contact } = require("../models/contactSchema")
const body_parser = require("body-parser")
router.use(body_parser.json());

// Importing contacts

router.post("/import", async (req, res) => {
    try {
        const contacts1 = await Contact.find({
            // user: "63a17e5922073a1c560fb40b"
            user: req.user
        })
        console.log(contacts1)
        let myset = new Set()
        contacts1.forEach((item) => {
            myset.add(item.Email)
        })


        const data = req.body.importedData
        // console.log(data)
        // const data = req.body
        const result = data.filter((item) => {
            if (item.Name.length != 0 && !myset.has(item.Email))
                return item
        })

        console.log(myset)
        result.forEach((item) => {
            item.user = req.user;
        })
        console.log(result)
        const contacts = await Contact.create(result)
        res.json(contacts)
    } catch (error) {
        res.json({
            status: "Failed",
            message: error.message
        })
    }
})


//search a contact using email

router.get("/:email", async (req, res) => {
    console.log(req.params.email);
    try {
      await Contact.find({ Email: req.params.email })
        .then((user) => {
          res.status(200).json({
            status: "Success",
            message: user,
          });
        })
        .catch((err) => {
          res.status(404).json({
            status: "Failed",
            message: "User does not Exists",
          });
        });
    } catch (err) {
      res.status(400).json({
        status: "Failed",
        message: err.message,
      });
    }
  });
  

// Deleting the selected contacts

router.delete("/delete", async (req, res) => {
    const selectedIDs = req.body.source
// console.log(res.body) // ["63aeb62d50bc537f77529980","63aeb62e50bc537f77529982","63aeb62e50bc537f77529981"]
    try {
        if (selectedIDs.length != 0) {
            selectedIDs.forEach(async (item) => {
                const post = await Contact.find({ _id: item })
                await Contact.deleteOne({ _id: item })
            })
            res.json("deleted successfully")
        } else {
            res.json({
                message: "please select ids and delete"
            })
        }
    } catch (error) {
        res.json({
            data: req.body,
            message: error.message
        })
    }

})


router.get("/", async (req, res) => {
    try {
        const contacts = await Contact.find({
            // user: "63a17e5922073a1c560fb40b"
            user: req.user
        })
        res.status(200).json({
            status: "Fetched",
            contacts: contacts
        })
    } catch (e) {
        res.status(401).json({
            status: "Failed to fetch",
            message: e.message
        })
    }
})

module.exports = router