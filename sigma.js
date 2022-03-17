  // Chat App
    app.post("/conversation", async (req, res) => {
      const aaa = {
        member: [req.body.member[0], req.body.member[1]],
      };
      const result = await converssationCollection.insertOne(aaa);
      res.send(result);
    });
    app.get("/conversation/:id", async (req, res) => {
      const result = await converssationCollection
        .find({
          member: { $in: [req.params.id] },
        })
        .toArray();
      res.send(result);
    });
    app.get("/onlineFridGet/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await userCollection.findOne(query);
      res.send(cursor);
    });
    app.get("/conversatio/:acc", async (req, res) => {
      const id = req.params.acc;
      const query = { _id: ObjectId(id) };
      const result = await converssationCollection.findOne(query);
      res.send(result);
    });
    app.delete("/conversationDelete/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await converssationCollection.deleteOne(query);
      res.send(result);
    });
    app.delete("/messageDelete/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await messageCollection.deleteOne(query);
      res.send(result);
    });
    // message
    app.post("/messages", async (req, res) => {
      const aaa = {
        converssationId: req.body.converssationId,
        senderId: req.body.senderId,
        text: req.body.text,
        time: req.body.time,
      };
      const result = await messageCollection.insertOne(aaa);
      res.send(result);
    });

    app.get("/messages/:Id", async (req, res) => {
      const result = await messageCollection
        .find({ converssationId: req.params.Id })
        .toArray();
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      const cursor = userCollection.findOne({ email: req.params.email });
      const users = await cursor;
      res.send(users);
    });
    app.get("/getUsers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await userCollection.findOne(query);
      res.send(cursor);
    });

   // blog post api Farid
    app.post("/addBlog", async (req, res) => {
      const {
        title,
        description,
        subtitle1,
        subDescription1,
        subtitle2,
        subDescription2,
        subtitle3,
        subDescription3,
        subtitle4,
        subDescription4,
        blogType,
        date,
      } = req.body;
      const image = req.files?.image?.data;
      const encodedImg = image.toString("base64");
      const imageBuffer = Buffer.from(encodedImg, "base64");
      const blogInfo = {
        title,
        description,
        subtitle1,
        subDescription1,
        subtitle2,
        subDescription2,
        subtitle3,
        subDescription3,
        subtitle4,
        subDescription4,
        blogType,
        date,
        likes: [],
        comments: [],
        liked: false,
        photo: imageBuffer,
      };
      const result = await blogCollection.insertOne(blogInfo);
      console.log(result);
      res.send(result);
    });
    // get all doctor
    app.get("/Blog", async (req, res) => {
      const blog = blogCollection.find({});
      const result = await blog.toArray();
      res.send(result);
    });
    app.put("/updateBlogUnlike/:id", async (req, res) => {
      const id = req.params.id;
      console.log("updateBlogUnlike");
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const blog = blogCollection.findOneAndUpdate(
        query,
        {
          $pull: {
            likes: req.body?.likes,
          },
        },
        options
      );
      const result = await blog;
      console.log("updateBlogUnlike");
      res.send(result);
    });
    app.put("/updateBloglike/:id", async (req, res) => {
      const id = req.params.id;
      console.log("updateBloglike");
      const options = { upsert: true };
      const query = { _id: ObjectId(id) };
      const blog = blogCollection.findOneAndUpdate(
        query,
        {
          $push: {
            likes: req.body?.likes,
          },
        },
        options
      );
      const result = await blog;
      res.send(result);
    });

    app.delete("/Blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/Blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogCollection.findOne(query);
      res.send(result);
    });
    app.get("/Blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogCollection.findOne(query);
      res.send(result);
    });
    /*======================================================
                          blog Section End
          ========================================================*/
