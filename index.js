const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());

const uri =
  "mongodb+srv://rubel:5QsNjZfNrr4vuNtQ@cluster0.vb3lh.mongodb.net/ErosUpdate?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client.connect((err) => {
  const collection = client.db("ErosUpdate").collection("tapu");
  const collections = client.db("ErosUpdate").collection("TapuImg");
  const ImageCollection = client.db("ErosUpdate").collection("tapuNewImg");

  app.post("/email", (req, res) => {
    const user = req.body;
    collection.insertOne(user).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/images", (req, res) => {
    const user = req.body;
    collections.insertOne(user).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/newImage", (req, res) => {
    const img1 = req.files.img1;
    const img2 = req.files.img2;
    const img3 = req.files.img3;
    const img4 = req.files.img4;

    const pic = img1.data;
    const pic1 = img2.data;
    const pic2 = img3.data;
    const pic3 = img4.data;

    const unPic = pic.toString("base64");
    const unPic1 = pic1.toString("base64");
    const unPic2 = pic2.toString("base64");
    const unPic3 = pic3.toString("base64");

    const image = Buffer.from(unPic, "base64");
    const image1 = Buffer.from(unPic1, "base64");
    const image2 = Buffer.from(unPic2, "base64");
    const image3 = Buffer.from(unPic3, "base64");

    const AllPic = {
      img1: image,
      img2: image1,
      img3: image2,
      img4: image3,
    };

    ImageCollection.insertOne(AllPic).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/newImages", (req, res) => {
    ImageCollection.find().toArray((err, result) => {
      res.send(result);
    });
  });

  app.get("/emails", (req, res) => {
    collection.find().toArray((err, result) => {
      res.send(result);
    });
  });

  app.get("/image", (req, res) => {
    collections.find().toArray((err, result) => {
      res.send(result);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    collection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
