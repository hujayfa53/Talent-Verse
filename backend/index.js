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

    // save contests in db
    app.post("/contests", async (req, res) => {
      const contestData = req.body;
      const result = await contestsCollection.insertOne(contestData);
      res.send(result);
    });

    // --get all contests from db

    app.get("/contests", async (req, res) => {
      const result = await contestsCollection.find().toArray();
      res.send(result);
    });

    // ---get single contest fro

    app.get("/contests/:id", async (req, res) => {
      const id = req.params.id;
      const result = await contestsCollection.findOne({
        _id: new ObjectId(id),
      });
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
          registerId: register._id,
        });
      }
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

    app.get('/my-participate',verifyJWT, async (req,res) => {
      const result = await registerCollection.find({customer:req.tokenEmail}).toArray()
      res.send(result)
    })

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
