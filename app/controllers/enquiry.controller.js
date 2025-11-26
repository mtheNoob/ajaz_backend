const express = require("express");
const apiRoutes = express.Router();
const Enquiry = require("../models/enquiry.model");
module.exports = function (app) {
apiRoutes.post("/enquiry", async (req, res) => {
  try {
    const { email, name, reason, phone, message } = req.body;

    // Validate required fields
    if (!email || !name || !reason || !message) {
      return res.status(400).json({
        message: "email, name, reason, and message are required fields.",
      });
    }

    // Check if enquiry already exists by email
    const existing = await Enquiry.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "An enquiry with this email already exists!",
      });
    }

    // Generate unique enquiry ID (E.G. ENQ-4829)
    const enquiryId = "ENQ-" + Math.floor(1000 + Math.random() * 9000);

    // Create new enquiry object
    const newEnquiry = new Enquiry({
      enquiryId,
      email,
      name,
      reason,
      phone: phone || "",
      message,
    });

    // Save to database
    await newEnquiry.save();

    return res.status(200).json({
      message: "Enquiry submitted successfully.",
      enquiryId,
    });

  } catch (error) {
    console.error("Error saving enquiry:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

apiRoutes.get("/get-enquiry", async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Enquiries fetched successfully.",
      data: enquiries,
    });

  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

apiRoutes.post("/delete-enquiry", async (req, res) => {
  try {
    const { enquiryId } = req.body;

    const existing = await Enquiry.findOne({ enquiryId });

    if (!existing) {
      return res.status(404).json({
        message: "No enquiry found with the provided enquiryId.",
      });
    }

    await Enquiry.deleteOne({ enquiryId });

    return res.status(200).json({
      message: "Enquiry deleted successfully.",
      deletedEnquiryId: enquiryId,
    });

  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return res.status(500).json({
      message: "Internal Server Error.",
      error: error.message,
    });
  }
});

  app.use("/", apiRoutes);


}