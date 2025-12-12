require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const admin = require("firebase-admin");
const port = process.env.PORT || 3000;
const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString(
  "utf-8"
);
const serviceAccount = JSON.parse(decoded);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
// middleware
app.use(
  cors({
    origin: [process.env.CLIENT_DOMAIN],
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(express.json());

// jwt middlewares
const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  console.log(token);
  if (!token) return res.status(401).send({ message: "Unauthorized Access!" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.tokenEmail = decoded.email;
    console.log(decoded);
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({ message: "Unauthorized Access!", err });
  }
};

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// -------------------------------
// -------------------------------
async function run() {
  try {
    const db = client.db("talentVerseDB");
    const contestsCollection = db.collection("contests");
    const registerCollection = db.collection("register");
    const submissionCollection = db.collection("submissions");
    const usersCollection = db.collection("users");
    const creatorRequestsCollection = db.collection("creator-requests");

    // role middlewares
    const verifyAdmin = async (req, res, next) => {
      const email = req.tokenEmail;
      const user = await usersCollection.findOne({ email });
      if (user?.role !== "admin")
        return res
          .status(403)
          .send({ message: "Admin Only Actions!", role: user?.role });
      next();
    };

    // creator
    const verifyCreator = async (req, res, next) => {
      const email = req.tokenEmail;
      const user = await usersCollection.findOne({ email });
      if (user?.role !== "creator")
        return res
          .status(403)
          .send({ message: "Creator only Actions!", role: user?.role });
      next();
    };

    // save contests in db
    app.post("/contests", verifyJWT, verifyCreator, async (req, res) => {
      const contestData = req.body;
      const result = await contestsCollection.insertOne(contestData);
      res.send(result);
    });

    // --get all contests from db

    app.get("/contests", async (req, res) => {
      const result = await contestsCollection.find().toArray();
      res.send(result);
    });

    // ---get single contest from db

    app.get("/contests/:id", async (req, res) => {
      const id = req.params.id;
      const result = await contestsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // popular contests
    app.get("/popular-contests", async (req, res) => {
      const result = await contestsCollection
        .find()
        .sort({ participate: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    // payments end point
    app.post("/create-checkout-session", async (req, res) => {
      const paymentInfo = req.body;
      console.log(paymentInfo);
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: paymentInfo?.name,
                description: paymentInfo?.description,
                images: [paymentInfo?.image],
              },
              unit_amount: paymentInfo?.fee * 100,
            },
            quantity: 1,
          },
        ],
        customer_email: paymentInfo?.customer?.email,
        mode: "payment",
        metadata: {
          contestId: paymentInfo?.contestId,
          customer: paymentInfo?.customer.email,
        },
        success_url: `${process.env.CLIENT_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_DOMAIN}/plant/${paymentInfo?.contestId}`,
      });
      console.log(session);
      res.send({ url: session.url });
    });

    app.post("/payment-success", async (req, res) => {
      const { sessionId } = req.body;
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      const contest = await contestsCollection.findOne({
        _id: new ObjectId(session.metadata.contestId),
      });
      const register = await registerCollection.findOne({
        transactionId: session.payment_intent,
      });
      console.log(register);

      if (session.status === "complete" && contest && !register) {
        // save data in db
        const registerInfo = {
          contestId: session.metadata.contestId,
          deadline: new Date(contest.deadline).toISOString(),
          transactionId: session.payment_intent,
          customer: session.metadata.customer,
          status: "paid",
          creator: contest.creator,
          name: contest.name,
          category: contest.category,
          image: contest?.image,
        };
        const result = await registerCollection.insertOne(registerInfo);
        // update participate
        await contestsCollection.updateOne(
          {
            _id: new ObjectId(session.metadata.contestId),
          },
          { $inc: { participate: +1 } }
        );

        return res.send({
          transactionId: session.payment_intent,
          registerId: result.insertedId,
        });
      }
      res.send(
        res.send({
          transactionId: session.payment_intent,
          registerId: register._id,
        })
      );
    });

    // --purchase check
    app.get("/purchase-check/:contestId/:email", async (req, res) => {
      const contestId = req.params.contestId;
      const email = req.params.email;

      const query = {
        contestId: contestId,
        customer: email,
      };
      const result = await registerCollection.findOne(query);

      res.send({ purchased: !!result });
    });

    // --------save user submission
    app.post("/submissions", async (req, res) => {
      const submissionData = req.body;

      const query = {
        contestId: submissionData.contestId,
        participantEmail: submissionData.participantEmail,
      };

      const existingSubmission = await submissionCollection.findOne(query);

      if (existingSubmission) {
        return res
          .status(400)
          .send({ message: "You have already submitted for this contest." });
      }

      // save new submission

      const result = await submissionCollection.insertOne(submissionData);
      res.send(result);
    });

    // get all submission

    app.get("/submissions/contest/:contestId", async (req, res) => {
      const contestId = req.params.contestId;
      const query = { contestId: contestId };
      const result = await submissionCollection.find(query).toArray();
      res.send(result);
    });

    // get single submission
    app.get("/submissions/:id", async (req, res) => {
      const id = req.params.id;
      const result = await submissionCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // declare a winner
    app.patch("/contests/winner", async (req, res) => {
      const { submissionId, contestId, winnerName, winnerEmail, winnerImage } =
        req.body;

      // update the submissions status to winner
      const submissionFilter = { _id: new ObjectId(submissionId) };
      const submissionUpdate = { $set: { status: "winner" } };

      const submissionResult = await submissionCollection.updateOne(
        submissionFilter,
        submissionUpdate
      );

      // update the contest to store the winner info and mark as closed

      const contestFilter = { _id: new ObjectId(contestId) };
      const contestUpdate = {
        $set: {
          winnerName: winnerName,
          winnerEmail: winnerEmail,
          winnerImage: winnerImage,
          status: "closed",
        },
      };
      const contestResult = await contestsCollection.updateOne(
        contestFilter,
        contestUpdate
      );
      res.send({ submissionResult, contestResult });
    });

    // get all participate contest for a user

    app.get("/my-participate", verifyJWT, async (req, res) => {
      const result = await registerCollection
        .find({ customer: req.tokenEmail })
        .toArray();
      res.send(result);
    });

    // get all contests for a creator made
    app.get("/my-created-contests/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const result = await contestsCollection
        .find({ "creator.email": email })
        .toArray();
      res.send(result);
    });

    // get all contest for admin
    app.get("/manage-contests", async (req, res) => {
      const result = await contestsCollection.find().toArray();
      res.send(result);
    });

    app.delete("/contests/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await contestsCollection.deleteOne(query);
      res.send(result);
    });

    // save or update user in db
    app.post("/user", async (req, res) => {
      const userData = req.body;
      userData.created_at = new Date().toISOString();
      userData.last_loggedIn = new Date().toISOString();
      userData.role = "participant";

      const query = {
        email: userData.email,
      };

      const alreadyExists = await usersCollection.findOne(query);

      if (alreadyExists) {
        const result = await usersCollection.updateOne(query, {
          $set: { last_loggedIn: new Date().toISOString() },
        });
        return res.send(result);
      }

      const result = await usersCollection.insertOne(userData);
      res.send(result);
    });

    // get a user role
    app.get("/user/role", verifyJWT, async (req, res) => {
      const result = await usersCollection.findOne({ email: req.tokenEmail });
      res.send({ role: result?.role });
    });

    // save become -creator request
    app.post("/become-creator", verifyJWT, async (req, res) => {
      const email = req.tokenEmail;
      const alreadyExists = await creatorRequestsCollection.findOne({ email });
      if (alreadyExists)
        return res
          .status(409)
          .send({ message: "Already Requested Send,Wait For Admin Approved" });
      const result = await creatorRequestsCollection.insertOne({ email });
      res.send(result);
    });

    // get all creator request for admin
    app.get("/creator-requests", verifyJWT, verifyAdmin, async (req, res) => {
      const result = await creatorRequestsCollection.find().toArray();
      res.send(result);
    });

    // update a user role
    app.patch("/update-role", verifyJWT, verifyAdmin, async (req, res) => {
      const { email, role } = req.body;
      const result = await usersCollection.updateOne(
        { email },
        { $set: { role } }
      );
      await creatorRequestsCollection.deleteOne({ email });
      res.send(result);
    });

    // get all users for admin
    app.get("/users", verifyJWT, verifyAdmin, async (req, res) => {
      const adminEmail = req.tokenEmail;
      const result = await usersCollection
        .find({ email: { $ne: adminEmail } })
        .toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from Server..");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
