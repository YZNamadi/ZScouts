'use strict';
require('dotenv').config();
const { Transaction } = require('../models');
const axios = require('axios');

// Use a proper Date object (not a string)
const getFormattedDate = () => new Date();

exports.initializePayment = async (req, res) => {
  try {
    const { email, name, amount } = req.body;

    if (!email || !name || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const reference = `TCA-AF-${Date.now()}`;
    const paymentData = {
      amount,
      customer: {
        name,
        email,
      },
      currency: "NGN",
      reference,
    };

    const response = await axios.post(
      'https://api.korapay.com/merchant/api/v1/charges/initialize',
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
        },
      }
    );

    const { data } = response?.data;

    // Save to Sequelize database
    const payment = await Transaction.create({
      email,
      name,
      amount,
      reference,
      paymentDate: getFormattedDate().toLocaleString()

    });

    res.status(200).json({
      message: "Payment initialized successfully",
      data: {
        reference: data?.reference,
        checkout_url: data?.checkout_url,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({ message: "Reference is required" });
    }

    const response = await axios.get(
      `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
        },
      }
    );

    const { data } = response?.data;

    const payment = await Transaction.findOne({ where: { reference } });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    if (data.status === "success") {
      payment.status = "success";
      await payment.save();
      return res.status(200).json({
        message: "Payment Verified Successfully",
        data: payment,
      });
    } else {
      return res.status(400).json({
        message: "Payment Verification Failed",
        data: payment,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
