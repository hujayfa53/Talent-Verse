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
          transactionId:session.payment_intent,
          customer:session.metadata.customer,
          status: 'paid',
          creator: contest.creator,
          name:contest.name,
          category:contest.category,
          image:contest?.image,
      }
      const result = await registerCollection.insertOne(registerInfo)
      // update participate
      await contestsCollection.updateOne({
        _id:new ObjectId(session.metadata.contestId)
      },
    {$inc: {participate: +1}})

    return res.send(res.send({
      transactionId:session.payment_intent,
      registerId: register._id
    }))

    }});

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
