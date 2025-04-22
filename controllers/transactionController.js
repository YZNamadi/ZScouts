'use strict';

require('dotenv').config();
const { Transaction } = require('../models');
const axios = require('axios');
const otpGenerator = require('otp-generator');
const { Scout, Player } = require('../models');


exports.initializePayment = async (req, res) => {
  try {
    const SECRET_KEY = process.env.KORA_SECRET_KEY;
    console.log("Process Value: ",process.env.KORA_SECRET_KEY);
    console.log("Secret Value: ",SECRET_KEY);
    const { userId, role } = req.user; 
    const otp = otpGenerator.generate(12, { specialChars: false });
    const ref = `TCA-AF-${otp}`;
    const formattedDate = new Date().toLocaleString();
  
    const normalizedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

    let user;
    
    if (normalizedRole === 'Scout') {
      user = await Scout.findByPk(userId);
    } else if (normalizedRole === 'Player') {
      user = await Player.findByPk(userId);
    } else {
      return res.status(400).json({ message: 'Invalid role' });  
    }

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    let paymentData;
    if (normalizedRole === 'Player') {
      paymentData = {
        amount: 3000,
        customer: {
          name: user.fullname,
          email: user.email,
        },
        currency: 'NGN',
        reference: ref,
      };
    } else {
      paymentData = {
        amount: 15000,
        customer: {
          name: user.fullname,
          email: user.email,
        },
        currency: 'NGN',
        reference: ref,
      };
    }

    const response = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', paymentData, {
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
      },
    });

    const { data } = response?.data; 
    console.log('Korapay Response:', data);  
    
    // Create a new transaction record
    await Transaction.create({
      scoutId: normalizedRole === 'Scout' ? user.id : null,
      playerId: normalizedRole === 'Player' ? user.id : null,
      name: user.fullname,
      email: user.email,
      amount: paymentData.amount,
      reference: paymentData.reference,
      paymentDate: formattedDate,
    });
    console.log(SECRET_KEY)
    res.status(200).json({
      message: 'Payment Initialized Successfully',
      data: {
        reference: data?.reference,
        checkout_url: data?.checkout_url,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const SECRET_KEY = process.env.KORA_SECRET_KEY;
    const { reference } = req.query;
    const transaction = await Transaction.findOne({ where: { reference: reference } });

    const response = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
      headers: { Authorization: `Bearer ${SECRET_KEY}` },
    });

    const { data } = response;

    if (data?.status && data?.data?.status === 'success') {
      await Transaction.update(
        { status: 'success', upgradeToPremium: true },
        { where: { id: transaction.id } }
      );
      return res.status(200).json({ message: 'Payment Verified Successfully' });
    } else {
      await Transaction.update(
        { status: 'failed', upgradeToPremium: false },
        { where: { id: transaction.id } }
      );
      return res.status(400).json({ message: 'Payment Verification Failed' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error,
    });
  }
};
