const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const nodemailer = require("nodemailer");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
var jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
const stripe = require("stripe")(process.env.PAYMENT_KEY);

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
// app.use(cors());

// console.log(process.env.Sending_API_Key)

// CRSWebsite
// OeJDkYxtKe4CKQiE

// payroll
// jtNyh3mXohIlorwR

let varifyToken = (req, res, next) => {
  // console.log("middleware running")

  let token = req.cookies?.token;
  // console.log(token)
  // console.log(token)

  if (!token) {
    return res.status(401).send({ message: "unauthorized token" });
  }

  jwt.verify(token, process.env.JWT_Secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized token" });
    }

    req.user = decoded;
    next();
  });
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER || 'cluster0.5hwdyi3.mongodb.net'}/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("CRMDB");
    const userCollection = database.collection("users");
    const taskCollection = database.collection("task");
    const leadCollection = database.collection("leads");
    const followUpCollection = database.collection("followup");
    const ticketCollection = database.collection("ticket");
    const reviewCollection = database.collection("reviews");
    const activityLogsCollection = database.collection("activityLogs");
    const alertCollection = database.collection("alerts");
    

    // Middleware to verify admin role
    const verifyAdmin = async (req, res, next) => {
      const email = req.user?.email;
      const user = await userCollection.findOne({ email });
      if (user?.role !== "admin") {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    // Middleware to verify executive role
    const verifyExecutive = async (req, res, next) => {
      const email = req.user?.email;
      const user = await userCollection.findOne({ email });
      if (user?.role !== "executives") {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    // Helper function for logging activities
    const logActivity = async (userEmail, action, details = {}) => {
      try {
        await activityLogsCollection.insertOne({
          timestamp: new Date(),
          userEmail,
          action,
          details,
        });
      } catch (error) {
        console.error("Error logging activity:", error);
      }
    };

    // Helper function for sending alerts
    const sendAlert = async (userEmail, type, message, details = {}) => {
      try {
        await alertCollection.insertOne({
          timestamp: new Date(),
          userEmail,
          type,
          message,
          details,
          read: false,
        });
      } catch (error) {
        console.error("Error sending alert:", error);
      }
    };

    app.post("/jwt", async (req, res) => {
      let userData = req.body;

      let token = jwt.sign(userData, process.env.JWT_Secret, {
        expiresIn: "1h",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          // secure:false  ,    // Prevent JavaScript access to the cookie
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Send cookie over HTTPS only
        })
        .send({ success: true });
      await logActivity(userData.email, "User Login", { ipAddress: req.ip });
    });

    app.post("/logout", (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          // secure:false,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Use true in production with HTTPS
        })
        .send({ success: true });
      logActivity(req.user?.email, "User Logout");
    });

    app.get("/adminCount", varifyToken, verifyAdmin, async(req,res)=>{

      let query={role:"admin"}
      let result=await userCollection.find(query).toArray()
      res.send(result)
    })
    app.get("/employeeCount", varifyToken, verifyAdmin, async(req,res)=>{

      let query={role:"executives"}
      let result=await userCollection.find(query).toArray()
      res.send(result)
    })
    app.get("/userCount", varifyToken, verifyAdmin, async(req,res)=>{

      
      let result=await userCollection.find().toArray()
      res.send(result)
    })

    app.get("/api/review",async(req,res)=>{

     let result=await reviewCollection.find().toArray()
     res.send(result)
    })


    app.post("/api/reviews",async(req,res)=>{


      let formData=req.body

      //  console.log(formData)
      let result= await reviewCollection.insertOne(formData)

      res.send(result)



    })

     app.get("/alltickets", varifyToken, verifyAdmin, async(req,res)=>{

    let result=await ticketCollection.find().toArray()
    res.send(result)
  })

  app.patch("/api/tickets/:id", varifyToken, verifyAdmin, async (req, res) => {
    try {
      const ticketId = req.params.id;
      const { status } = req.body;
      const validStatuses = ['Open', 'In Progress', 'Resolved'];
      if (!validStatuses.includes(status)) {
        return res.status(400).send({ error: "Invalid status value" });
      }

      const result = await ticketCollection.updateOne(
        { _id: new ObjectId(ticketId) },
        { $set: { status } }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).send({ message: "Task not found or already has this status" });
      }

      res.send({ message: "Status updated successfully", result });
      await logActivity(req.user.email, "Ticket Status Updated", { ticketId: ticketId, newStatus: status });

      // Alert for ticket status changes
      await sendAlert(req.user.email, "Ticket Status Change", `Ticket (${ticketId}) status changed to ${status}.`, { ticketId: ticketId, newStatus: status });

      // Check for overdue tickets (this would need more complex logic, e.g., a scheduled job)
      // For now, let's add a placeholder for an alert if a ticket is marked as overdue manually
      if (status === "Overdue") { // Assuming you might have an 'Overdue' status
        await sendAlert(req.user.email, "Overdue Ticket", `Ticket (${ticketId}) is now overdue.`, { ticketId: ticketId });
      }

    } catch (error) {
      console.error("Error updating status:", error);
      res.status(500).send({ error: "Something went wrong" });
    }
  });

  // Add response to ticket
  app.patch("/api/tickets/:id/response", varifyToken, verifyAdmin, async (req, res) => {
    try {
      const ticketId = req.params.id;
      const { response, respondedBy, respondedAt } = req.body;

      if (!response || !respondedBy) {
        return res.status(400).send({ error: "Response and responder are required" });
      }

      const newResponse = {
        response,
        respondedBy,
        respondedAt: respondedAt || new Date(),
      };

      const result = await ticketCollection.updateOne(
        { _id: new ObjectId(ticketId) },
        { $push: { responses: newResponse } }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).send({ message: "Ticket not found" });
      }

      res.send({ message: "Response added successfully", result });
      await logActivity(req.user.email, "Ticket Response Added", { ticketId: ticketId, response: response });

    } catch (error) {
      console.error("Error adding response:", error);
      res.status(500).send({ error: "Failed to add response" });
    }
  });

    app.get("/manageFollowup", varifyToken, verifyAdmin, async(req,res)=>{

    let result=await followUpCollection.find().toArray()
    res.send(result)
  })




  app.get("/manageLead", varifyToken, verifyAdmin, async(req,res)=>{

    let result=await leadCollection.find().toArray()
    res.send(result)
  })

    app.delete("/api/tasks/:id", async (req, res) => {
      let idx = req.params.id;

      let filter = { _id: new ObjectId(idx) };

      const result = await taskCollection.deleteOne(filter);
      res.send(result);
    });

    app.get("/mytask/:email", async (req, res) => {
      let email = req.params.email;

      let filter = { email };

      let result = await taskCollection.find(filter).toArray();
      res.send(result);
    });

    app.patch("/api/tasks/:id", async (req, res) => {
      const { status } = req.body;
      const result = await taskCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status } }
      );
      res.send(result);
    });

      app.get("/myaddedticket/:email", async (req, res) => {
      let executiveEmail = req.params.email;

      let filter = { executiveEmail };

      let result = await ticketCollection.find(filter).toArray();
      res.send(result);
    });

     app.delete("/api/tickets/:id", varifyToken, verifyAdmin, async (req, res) => {
      try {
        const ticketId = req.params.id;
        const query = { _id: new ObjectId(ticketId) };
        const result = await ticketCollection.deleteOne(query);
        res.send(result);
        await logActivity(req.user.email, "Ticket Deleted", { ticketId: ticketId });
      } catch (error) {
        console.error("Error deleting ticket:", error);
        res.status(500).send({ error: "Failed to delete ticket" });
      }
    });

     app.post("/api/tickets", varifyToken, verifyExecutive, async(req,res)=>{
      let data = req.body;
      let result = await ticketCollection.insertOne(data);
      res.send(result);
      await logActivity(req.user.email, "Ticket Added", { ticketId: result.insertedId, ticketData: data });
    });
   
    app.patch("/api/followups/:id", varifyToken, async (req, res) => {
      const { id } = req.params;
      const { status, dueDate } = req.body; // Added dueDate to check for overdue

      try {
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { status },
        };
        if (dueDate) updateDoc.$set.dueDate = new Date(dueDate);

        const result = await followUpCollection.updateOne(filter, updateDoc);
        res.send(result);
        await logActivity(req.user.email, "Follow-up Status Updated", { followUpId: id, newStatus: status });

        // Alert for overdue follow-ups (requires comparing with current date)
        if (dueDate && new Date(dueDate) < new Date()) {
          await sendAlert(req.user.email, "Overdue Follow-up", `Follow-up for lead (${id}) is overdue.`, { followUpId: id });
        }

      } catch (error) {
        console.error("Error updating follow-up status:", error);
        res.status(500).send({ error: "Failed to update status" });
      }
    });

   
    app.delete("/api/followups/:id", varifyToken, verifyAdmin, async (req, res) => {
      const { id } = req.params;

      try {
        const query = { _id: new ObjectId(id) };
        const result = await followUpCollection.deleteOne(query);
        res.send(result);
        await logActivity(req.user.email, "Follow-up Deleted", { followUpId: id });
      } catch (error) {
        console.error("Error deleting follow-up:", error);
        res.status(500).send({ error: "Failed to delete follow-up" });
      }
    });

    app.get("/myfollowUp/:email", varifyToken, verifyExecutive, async (req, res) => {
      let myEmail = req.params.email;

      let filter = { myEmail };

      let result = await followUpCollection.find(filter).toArray();
      res.send(result);
    });

    app.post("/api/followups", varifyToken, verifyExecutive, async (req, res) => {
      let data = req.body;

      let result = await followUpCollection.insertOne(data);
      res.send(result);
      await logActivity(req.user.email, "Follow-up Added", { followUpId: result.insertedId, followUpData: data });
      await sendAlert(req.user.email, "New Follow-up", `A new follow-up has been scheduled for ${data.leadName || 'a lead'} on ${new Date(data.date).toLocaleDateString()}.`, { followUpId: result.insertedId });
    });

    app.patch("/api/leads/:id", varifyToken, async (req, res) => {
      const id = req.params.id;
      const { status, priority, lastActivityDate } = req.body;

      const updateFields = { $set: { status } };
      if (priority) updateFields.$set.priority = priority;
      if (lastActivityDate) updateFields.$set.lastActivityDate = new Date(lastActivityDate);

      const result = await leadCollection.updateOne(
        { _id: new ObjectId(id) },
        updateFields
      );
      res.send(result);
      await logActivity(req.user.email, "Lead Updated", { leadId: id, newStatus: status, newPriority: priority });

      // Alert for high priority leads being updated or becoming high priority
      if (priority === "High") {
        await sendAlert(req.user.email, "High Priority Lead Update", `Lead (${id}) status updated to High Priority.`, { leadId: id });
      }
    });

    app.delete("/api/leads/:id", varifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const result = await leadCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
      await logActivity(req.user.email, "Lead Deleted", { leadId: id });
    });

    app.get("/myleads/:email", varifyToken, verifyExecutive, async (req, res) => {
      let myEmail = req.params.email;

      let filter = { myEmail };

      let result = await leadCollection.find(filter).toArray();
      res.send(result);
    });

    app.put("/api/tasks/:id", async (req, res) => {
      let idx = req.params.id;

      let updateData = req.body;

      email = updateData.email;
      title = updateData.title;
      description = updateData.description;
      deadline = updateData.deadline;

      let filter = { _id: new ObjectId(idx) };

      const update = {
        $set: { email, title, description, deadline },
      };
      const options = { upsert: true };

      let result = await taskCollection.updateOne(filter, update, options);

      res.send(result);
    });

    app.get("/specificTask/:id", async (req, res) => {
      let idx = req.params.id;

      let filter = { _id: new ObjectId(idx) };

      let result = await taskCollection.findOne(filter);
      res.send(result);
    });

    app.get("/api/tasks", async (req, res) => {
      let result = await taskCollection.find().toArray();
      res.send(result);
    });

    app.post("/api/leads", varifyToken, verifyExecutive, async (req, res) => {
      let data = req.body;

      let result = await leadCollection.insertOne(data);
      res.send(result);
      await logActivity(req.user.email, "Lead Added", { leadId: result.insertedId, leadData: data });
      if (data.priority === "High") {
        await sendAlert(req.user.email, "High Priority Lead", `A new high priority lead (${data.name}) has been added.`, { leadId: result.insertedId });
      }
    });

    app.post("/api/tasks", async (req, res) => {
      let data = req.body;

      let result = await taskCollection.insertOne(data);
      res.send(result);
    });

    app.get("/users/employee/:email", async (req, res) => {
      let email = req.params.email;

      let query = { email };
      let user = await userCollection.findOne(query);

      let executives = false;
      if (user) {
        executives = user?.role === "executives";
      }

      res.send({ executives });
    });

    app.get("/users/admin/:email", async (req, res) => {
      let email = req.params.email;

      let query = { email };
      let user = await userCollection.findOne(query);

      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }

      res.send({ admin });
    });

    app.get("/users", varifyToken, verifyAdmin, async(req,res)=>{

      let result=await userCollection.find().toArray()

      res.send(result)
    })

    
app.patch("/api/users/:id", varifyToken, verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const result = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role } }
    );

    res.send(result);
    await logActivity(req.user.email, "User Role Changed", { userId: userId, newRole: role });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).send({ error: "Something went wrong" });
  }
});


    app.post("/users", async (req, res) => {
      let users = req.body;
      let email = users?.email;
      let query = { email };

      let existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.status(404).send({ message: "Users already existed" });
      }

      // Assign a default role if not provided (e.g., 'executives')
      const userWithRole = { ...users, role: users.role || "executives" };

      const result = await userCollection.insertOne(userWithRole);
      res.send(result);
    });

    app.get("/performance/leads-by-executive", varifyToken, verifyAdmin, async (req, res) => {
      try {
        const leadsByExecutive = await leadCollection.aggregate([
          { $group: { _id: "$myEmail", totalLeads: { $sum: 1 } } },
          { $lookup: { from: "users", localField: "_id", foreignField: "email", as: "executiveInfo" } },
          { $unwind: "$executiveInfo" },
          { $project: { _id: 0, executiveEmail: "$_id", executiveName: "$executiveInfo.name", totalLeads: 1 } }
        ]).toArray();
        res.send(leadsByExecutive);
      } catch (error) {
        console.error("Error fetching leads by executive:", error);
        res.status(500).send({ error: "Failed to fetch leads by executive" });
      }
    });

    app.get("/performance/followups-completed", varifyToken, verifyAdmin, async (req, res) => {
      try {
        const followupsCompleted = await followUpCollection.aggregate([
          { $match: { status: "completed" } }, // Assuming a 'status' field for follow-ups
          { $group: { _id: "$myEmail", completedFollowups: { $sum: 1 } } },
          { $lookup: { from: "users", localField: "_id", foreignField: "email", as: "executiveInfo" } },
          { $unwind: "$executiveInfo" },
          { $project: { _id: 0, executiveEmail: "$_id", executiveName: "$executiveInfo.name", completedFollowups: 1 } }
        ]).toArray();
        res.send(followupsCompleted);
      } catch (error) {
        console.error("Error fetching completed follow-ups:", error);
        res.status(500).send({ error: "Failed to fetch completed follow-ups" });
      }
    });

    app.get("/performance/closure-rates", varifyToken, verifyAdmin, async (req, res) => {
      try {
        const closureRates = await leadCollection.aggregate([
          { $group: { 
              _id: "$myEmail", 
              totalLeads: { $sum: 1 }, 
              closedLeads: { $sum: { $cond: [{ $eq: ["$status", "Closed"] }, 1, 0] } } 
          } },
          { $addFields: { closureRate: { $cond: [{ $eq: ["$totalLeads", 0] }, 0, { $multiply: [{ $divide: ["$closedLeads", "$totalLeads"] }, 100] }] } } },
          { $lookup: { from: "users", localField: "_id", foreignField: "email", as: "executiveInfo" } },
          { $unwind: "$executiveInfo" },
          { $project: { _id: 0, executiveEmail: "$_id", executiveName: "$executiveInfo.name", totalLeads: 1, closedLeads: 1, closureRate: 1 } }
        ]).toArray();
        res.send(closureRates);
      } catch (error) {
        console.error("Error fetching closure rates:", error);
        res.status(500).send({ error: "Failed to fetch closure rates" });
      }
    });

    app.get("/performance/lead-conversion-trends", varifyToken, verifyAdmin, async (req, res) => {
      try {
        const leadConversionTrends = await leadCollection.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ]).toArray();
        res.send(leadConversionTrends);
      } catch (error) {
        console.error("Error fetching lead conversion trends:", error);
        res.status(500).send({ error: "Failed to fetch lead conversion trends" });
      }
    });

    app.get("/admin/activity-logs", varifyToken, verifyAdmin, async (req, res) => {
      try {
        const activityLogs = await activityLogsCollection.find({}).sort({ timestamp: -1 }).toArray();
        res.send(activityLogs);
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        res.status(500).send({ error: "Failed to fetch activity logs" });
      }
    });

    app.get("/api/alerts/:email", varifyToken, async (req, res) => {
      try {
        const userEmail = req.params.email;
        const alerts = await alertCollection.find({ userEmail, read: false }).sort({ timestamp: -1 }).toArray();
        res.send(alerts);
      } catch (error) {
        console.error("Error fetching alerts:", error);
        res.status(500).send({ error: "Failed to fetch alerts" });
      }
    });

    app.patch("/api/alerts/mark-read/:id", varifyToken, async (req, res) => {
      try {
        const alertId = req.params.id;
        const result = await alertCollection.updateOne(
          { _id: new ObjectId(alertId) },
          { $set: { read: true } }
        );
        res.send(result);
      } catch (error) {
        console.error("Error marking alert as read:", error);
        res.status(500).send({ error: "Failed to mark alert as read" });
      }
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});