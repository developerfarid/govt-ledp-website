const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretPass = "SfrgiefeGefgMewtA";
const SSLCommerzPayment = require("sslcommerz");
require("dotenv").config();

const { v4: uuidv4 } = require("uuid");

const app = express();
const port = process.env.PORT || 7050;
const fileUpload = require("express-fileupload");

//Middle Ware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mvbo5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// SSLCommerz payment

async function run() {
  try {
    await client.connect();
    const database = client.db("sigma_central");
    const commonityCollection = database.collection("commonity");
    const patientsCollection = database.collection("patients");
    const blogCollection = database.collection("blog");
    const userCollection = database.collection("users");
    const adminCollection = database.collection("admin_panel");
    const doctorCollection = database.collection("doctors");
    const medicineCollection = database.collection("medicine");
    const nurseCollection = database.collection("nurses");
    const prescriptionCollection = database.collection("prescriptions");
    const appointmentCollection = database.collection("appointments");
    const converssationCollection = database.collection("converssation");
    const messageCollection = database.collection("message");
    const orderCollection = database.collection("order");
    const bloodRequestsCollection = database.collection("bloodRequests");
    const bloodDonationCollection = database.collection("bloodDonations");
    const donorsCollection = database.collection("donors");

    //Costomer Order get api///
    app.get("/order", async (req, res) => {
      const order = orderCollection.find({});
      const result = await order.toArray();
      res.send(result);
    });
    //SSLCommerz Payment initialization Api
    app.post("/init", async (req, res) => {
      const item = req.body.item;
      const data = {
        total_amount: req.body.Total,
        cusName: req.body.cus_name,
        cusNumber: req.body.cus_number,
        cusAddress: req.body.cus_address,
        currency: "BDT",
        tran_id: uuidv4(),
        paymentStatus: "successful",
        success_url: "http://localhost:7050/success",
        fail_url: "http://localhost:7050/fail",
        cancel_url: "http://localhost:7050/cancel",
        ipn_url: "http://localhost:7050/ipn",
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: "Customer Name",
        cus_email: "cust@yahoo.com",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
        multi_card_name: "mastercard",
        value_a: "ref001_A",
        value_b: "ref002_B",
        value_c: "ref003_C",
        value_d: "ref004_D",
      };

      const order = {
        item,
        data,
      };
      const result = await orderCollection.insertOne(order);

      const sslcommer = new SSLCommerzPayment(
        process.env.STORE_ID,
        process.env.STORE_PASSWORD,
        false
      ); //
      sslcommer.init(data).then((data) => {
        if (data.GatewayPageURL) {
          res.json(data.GatewayPageURL);
        } else {
          return res.status(400).json({
            message: "SSL session was not successful",
          });
        }
      });
    });

    app.post("/success", async (req, res) => {
      console.log(req.body);
      res.status(200).redirect(`http://localhost:3000`);
    });
    app.post("/fail", async (req, res) => {
      res.status(400).redirect(`http://localhost:3000/order`);
    });

    app.post("/cancel", async (req, res) => {
      res.status(200).redirect(`http://localhost:3000/home`);
    });

    /*======================================================
                    Doctors Section Starts
    ========================================================*/
    // post doctor api
    app.post("/addDoctor", async (req, res) => {
      const {
        name,
        experience,
        birthday,
        gender,
        phone,
        speciality,
        email,
        twitter,
        facebook,
        linkedin,
        address,
        eduLine1,
        eduLine2,
        eduLine3,
        awardFirst,
        awardSecond,
        awardThird,
      } = req.body;
      const image = req.files.image.data;
      const encodedImg = image.toString("base64");
      const imageBuffer = Buffer.from(encodedImg, "base64");
      const doctorInfo = {
        name,
        experience,
        birthday,
        gender,
        phone,
        speciality,
        email,
        twitter,
        facebook,
        linkedin,
        address,
        eduLine1,
        eduLine2,
        eduLine3,
        awardFirst,
        awardSecond,
        awardThird,
        photo: imageBuffer,
      };
      const result = await doctorCollection.insertOne(doctorInfo);
      res.send(result);
    });

    // get all doctor
    app.get("/doctors", async (req, res) => {
      const doctor = doctorCollection.find({});
      const result = await doctor.toArray();
      res.send(result);
    });

    // delete a single doctor
    app.delete("/doctors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await doctorCollection.deleteOne(query);
      res.send(result);
    });

    // update doctor api
    app.put("/updateDoctor/:id", async (req, res) => {
      console.log("body", req.body);
      const id = req.params.id;
      const {
        name,
        experience,
        birthday,
        gender,
        phone,
        speciality,
        email,
        twitter,
        linkedin,
        facebook,
        address,
        eduLine1,
        eduLine2,
        eduLine3,
        awardFirst,
        awardSecond,
        awardThird,
        title,
        description,
        day,
        time,
        shift,
        skill1,
        skill2,
        skill3,
        percent1,
        percent2,
        percent3,
        moto,
      } = req.body;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateFile = {
        $set: {
          name: name,
          experience: experience,
          birthday: birthday,
          gender: gender,
          phone: phone,
          speciality: speciality,
          email: email,
          twitter: twitter,
          linkedin: linkedin,
          facebook: facebook,
          address: address,
          eduLine1: eduLine1,
          eduLine2: eduLine2,
          eduLine3: eduLine3,
          awardFirst: awardFirst,
          awardSecond: awardSecond,
          awardThird: awardThird,
          title: title,
          description: description,
          day: day,
          time: time,
          shift: shift,
          skill1: skill1,
          skill2: skill2,
          skill3: skill3,
          percent1: percent1,
          percent2: percent2,
          percent3: percent3,
          moto: moto,
        },
      };
      const result = await doctorCollection.updateOne(
        filter,
        updateFile,
        options
      );
      res.send(result);
    });
    /*======================================================
                    Doctors Section Ends
    ========================================================*/
    /*======================================================
                        Prescription Section starts
        ========================================================*/

    // get single appointments using doctor's email
    app.get("/appointments/:email", async (req, res) => {
      const email = req.params.email;
      const query = { doctorEmail: email };
      const patientsInfo = appointmentCollection.find(query);
      const result = await patientsInfo.toArray();
      res.send(result);
    });

    // post prescription data into database
    app.post("/prescriptions", async (req, res) => {
      const prescription = req.body;
      console.log(prescription);
      const {
        inputFields,
        doctorName,
        patientFirstName,
        patientLastName,
        patientAge,
        patientGender,
      } = req.body;
      const patientPrescription = {
        inputFields: inputFields,
        doctorName: doctorName,
        patientFirstName: patientFirstName,
        patientLastName: patientLastName,
        patientAge: patientAge,
        patientGender: patientGender,
      };
      const result = await prescriptionCollection.insertOne(
        patientPrescription
      );
      res.send(result);
    });

    // update prescription data
    app.put("/prescriptions/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const prescription = req.body;
      console.log(prescription);
      const { inputFields } = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateFile = {
        $set: {
          inputFields: inputFields,
        },
      };
      const result = await prescriptionCollection.updateOne(
        filter,
        updateFile,
        options
      );
      res.send(result);
    });

    // added nurse data to appointed for a patient
    app.put("/appointNurse/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const nurseData = req.body;
      console.log("nurseData", nurseData);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateFile = {
        $set: {
          appointNurse: nurseData
        },
      };
      const result = await prescriptionCollection.updateOne(
        filter,
        updateFile,
        options
      );
      res.send(result);
    });

    // get all prescription data
    app.get("/prescriptions", async (req, res) => {
      const allprescription = prescriptionCollection.find({});
      const result = await allprescription.toArray();
      res.send(result);
    });
    /*======================================================
                        Prescription Section Ends
        ========================================================*/
    /*======================================================
                        Nurse Section Starts
        ========================================================*/
    // nurse section start
    app.post("/addNurse", async (req, res) => {
      console.log(req.body);
      console.log(req.files);
      const { name, description, day, time, shift, email, phone, gender } =
        req.body;
      const image = req.files.image.data;
      const encodedImg = image.toString("base64");
      const imageBuffer = Buffer.from(encodedImg, "base64");

      const doctorInfo = {
        name,
        description,
        day,
        time,
        shift,
        email,
        phone,
        gender,
        photo: imageBuffer,
      };
      const result = await nurseCollection.insertOne(doctorInfo);
      res.send(result);
    });
    app.get("/nurses", async (req, res) => {
      const nurse = nurseCollection.find({});
      const result = await nurse.toArray();
      res.send(result);
    });
    app.delete("/nurses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await nurseCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/updateNurse/:id", async (req, res) => {
      console.log("body", req.body);
      const id = req.params.id;
      const { name, description, day, time, shift, email, phone, gender } =
        req.body;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateFile = {
        $set: {
          name: name,
          description: description,
          day: day,
          time: time,
          shift: shift,
          email: email,
          phone: phone,
          gender: gender,
        },
      };
      const result = await nurseCollection.updateOne(
        filter,
        updateFile,
        options
      );
      res.send(result);
    });

    // get all prescription data
    app.get("/prescription", async (req, res) => {
      const allprescription = prescriptionCollection.find({});
      const result = await allprescription.toArray();
      res.send(result);
    });
    /*======================================================
                    Medicine Section Ends
    ========================================================*/
    /*======================================================
                  Blog Section starts
  ========================================================*/
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
    /*======================================================
                  Chat Section starts
  ========================================================*/
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
    /*======================================================
                    Nurse Section Ends
    ========================================================*/
    /*======================================================
                    Medicine Section Starts
    ========================================================*/
    // post medicine api
    app.post("/medicine", async (req, res) => {
      const medicine = req.body;
      const result = await medicineCollection.insertOne(medicine);
      res.send(result);
    });

    // Medicine Api
    app.get("/medicine", async (req, res) => {
      const medicine = medicineCollection.find({});
      const result = await medicine.toArray();
      res.send(result);
    });

    // post prescription api
    app.post("/prescription", async (req, res) => {
      const prescription = req.body;
      const result = await prescriptionCollection.insertOne(prescription);
      res.send(result);
    });

    // get all prescription data
    app.get("/prescription", async (req, res) => {
      const allprescription = prescriptionCollection.find({});
      const result = await allprescription.toArray();
      res.send(result);
    });
    /*======================================================
                    Medicine Section Ends
    ========================================================*/
    /*======================================================
                  Blog Section starts
  ========================================================*/
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
        likes,
        comments,
      } = req.body;
      const image = req.files.image.data;
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
        likes,
        comments,
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
    /*======================================================
                          blog Section End
          ========================================================*/
    /*======================================================
                  Chat Section starts
  ========================================================*/
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

    /*======================================================
                  Chat Section starts
  ========================================================*/
    /*======================================================
                    Appointment Section starts
    ========================================================*/
    app.post("/appointments", async (req, res) => {
      const appointments = req.body;
      const result = await appointmentCollection.insertOne(appointments);
      res.send(result);
      console.log(appointments);
    });
    app.get("/appointments", async (req, res) => {
      const appointments = appointmentCollection.find({});
      const result = await appointments.toArray();
      res.send(result);
    });
    /*======================================================
                    Appointment Section ends
    ========================================================*/
    /*======================================================
                    Admin Panel Section Starts
    ========================================================*/
    // Doctor Account Created By Admin
    app.post("/adminRegistar", async (req, res) => {
      const { adminName, photoURL, email, passWord, role } = req.body;
      if (!email || !passWord || !adminName || !role) {
        return res.status(422).json({ error: "All Input Fields Are Reqired" });
      }
      const adminEmail = await adminCollection.findOne({ email: email });
      if (adminEmail) {
        return res
          .status(422)
          .json({ error: "This Admin Panel Member Already Exists" });
      }
      const securePassWord = await bcrypt.hash(passWord, 12);
      const data = {
        adminName: adminName,
        email: email,
        passWord: securePassWord,
        photoURL: photoURL,
        role: role,
      };
      const adminMember = await adminCollection.insertOne(data);
      res.send(adminMember);
      res.status(200).json({
        message:
          "Hay Admin! New Admin Panel Member Successfully Added! Please Login",
      });
    });
    // Doctor login Api
    app.post("/adminLogin", async (req, res) => {
      console.log(req.body);
      const { email, passWord } = req.body;
      if (!email || !passWord) {
        return res.status(422).json({ error: "All Input Fields Are Reqired" });
      }
      const admin = await adminCollection.findOne({ email: email });
      if (!admin) {
        return res
          .status(422)
          .json({ error: "Sorry! This Doctor Doesn't Exists." });
      }
      const match = await bcrypt.compare(passWord, admin.passWord);
      if (match) {
        const token = jwt.sign({ admin: admin._id }, secretPass);
        return res.status(201).json({
          token: token,
          role: admin.role,
          displayName: admin.adminName,
          adminEmail: admin.email,
          photoURL: admin.photoURL,
        });
      } else {
        return res.status(401).json({ error: "Email Or Password is Invalid." });
      }
    });
    // Login Require
    const requireLogin = (req, res, next) => {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({ error: "Sorry! You must be logged in" });
      }
      const { role } = jwt.verify(authorization, secretPass);
      req.user = role;
      next();
    };

    /*======================================================
                    Admin Panel Section Ends
    ========================================================*/
    /*======================================================
                    User Section Starts
    ========================================================*/
    // Get patients From Database
    app.get("/patients", async (req, res) => {
      const cursor = patientsCollection.find({});
      const patients = await cursor.toArray();
      res.send(patients);
    });

    // Get Users From Database
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });
    // Create Users By Email PassWord [Firebase]
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
    // Create And Update Users by Google Login [Firebase]
    app.put("/users", async (req, res) => {
      const user = req.body;
      const find = { email: user.email };
      const option = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(find, updateDoc, option);
      res.json(result);
    });
    /*======================================================
                    Users Section Ends
    ========================================================*/
    //***************** Update ApI Stock medicine Code************************************** *********************/

    app.put("/medicine/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result1 = await medicineCollection.findOne(query);
      const stock = Number(result1.stock);

      const updatedData = Number(req.body.stock.data);
      const updateStock = stock + updatedData;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          stock: updateStock,
        },
      };
      const result = await medicineCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.json(result);
    });

    //***************** Update ApI Code End  ************************************** */
    // updata Stock data  Decrease////
    app.put("/medicine/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updatequantity = await medicineCollection.findOne(query);
      const oldStock = Number(updatequantity.stock);

      const updatedData = req.body.stock.data.quantity;
      const saleStock = Number(updatedData);
      const updateNewStock = oldStock - saleStock;

      const options = { upsert: true };
      const updateDoc = {
        $set: {
          stock: updateNewStock,
        },
      };
      const result = await medicineCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.json(result);
    });

    // updata Stock data  Decrease////

    // ****** Update delete data add cart ******//
    app.put("/medicine", async (req, res) => {
      const id = req.body.item.cartItems._id;
      const query = { _id: ObjectId(id) };
      const updatequantity = await medicineCollection.findOne(query);
      const oldStock = Number(updatequantity.stock);

      const updatedData = req.body.item.cartItems.quantity;
      const deleteStock = Number(updatedData);
      const updateNewStock = oldStock + deleteStock;

      const options = { upsert: true };
      const updateDoc = {
        $set: {
          stock: updateNewStock,
        },
      };
      const result = await medicineCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.json(result);
    });

    // ****** Update  cart******//
    //********************************************** Update ApI Stock medicine Code***********************************************************/

    /*======================================================
                    blood bank starts
    ========================================================*/
    //  post blood request
    app.post("/bloodRequest", async (req, res) => {
      const blood = req.body;
      const result = await bloodRequestsCollection.insertOne(blood);
      res.json(result);
    });

    // get all blood request
    app.get("/bloodRequest", async (req, res) => {
      const cursor = bloodRequestsCollection.find({});
      const requests = await cursor.toArray();
      res.json(requests);
    });

    // get filtered blood request
    app.get("/bloodRequest/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = bloodRequestsCollection.find(query);
      const users = await cursor.toArray();
      res.json(users);
    });

    //  blood donation post api
    app.post("/bloodDonation", async (req, res) => {
      const bloodDonation = req.body;
      const result = await bloodDonationCollection.insertOne(bloodDonation);
      res.json(result);
    });

    // blood donation get api
    app.get("/bloodDonation", async (req, res) => {
      const cursor = bloodDonationCollection.find({});
      const bloodDonation = await cursor.toArray();
      res.json(bloodDonation);
    });

    // get filtered donation
    app.get("/bloodDonation/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = bloodDonationCollection.find(query);
      const bloodDonation = await cursor.toArray();
      res.json(bloodDonation);
    });

    // donors post api
    app.post("/donors", async (req, res) => {
      const donor = req.body;
      const result = await donorsCollection.insertOne(donor);
      res.json(result);
    });

    //  donors get api
    app.get("/donors", async (req, res) => {
      const cursor = donorsCollection.find({});
      const donors = await cursor.toArray();
      res.json(donors);
    });

    /*======================================================
                    blood bank ends
    ========================================================*/
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Sigma Central Hospital Server Running");
});

app.listen(port, () => {
  console.log("Sigma Central Hospital Server Port", port);
});
