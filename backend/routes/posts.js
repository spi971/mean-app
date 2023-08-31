const express = require("express");
const multer = require("multer");
const Post = require("../models/post");
const router = express.Router();

const MINE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MINE_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mimetype.");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (res, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MINE_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extension);
  },
});

const buitldQuery = (pageSize, currentPage) => {
  let postQuery = Post.find().sort("-_id");

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    console.log("postQuery avec param");
  }

  return postQuery;
};

const urlBuilder = (protocol, host, filename) => {
  const url = protocol + "://" + host;
  return url + "/images/" + filename;
};

router.get("", (req, res, next) => {
  const { pagesize, page } = req.query;
  //the + signe is to convert into number
  const postQuery = buitldQuery(+pagesize, +page);
  let fetchedPost;

  postQuery
    .then((documents) => {
      fetchedPost = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched!",
        posts: fetchedPost,
        postsCount: count,
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById({ _id: req.params.id }).then((document) => {
    if (document) {
      res.status(200).json({
        message: "Post fetched!",
        post: document,
      });
    } else {
      res.status(400).json({
        message: "No Post found with id : " + req.params.id,
      });
    }
  });
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: urlBuilder(req.protocol, req.get("host"), req.file.filename),
    });

    post.save().then((createdPostId) => {
      res.status(201).json({
        message: "Post created!",
        post: {
          ...createdPostId,
          imagePath: createdPostId.imagePath,
        },
      });
    });
  }
);

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      imagePath = urlBuilder(req.protocol, req.get("host"), req.file.filename);
    }

    const updatedPost = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });

    Post.updateOne({ _id: req.params.id }, updatedPost).then((result) => {
      res
        .status(200)
        .json({ message: "Post updated!", imagePath: result.imagePath });
    });
  }
);

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({
      message: "Post deleted!",
    });
  });
});

module.exports = router;
