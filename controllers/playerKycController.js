'use strict';

const {Player} = require('../models');
const {PlayerKyc} = require('../models');
const cloudinary = require('../config/cloudinary');
const fs = require('fs')


exports.playerInfo = async(req, res)=>{
    try {
       const {id:playerId} = req.params
        const {age,nationality,height,weight,preferredFoot,playingPosition,
            phoneNumber,homeAddress,primaryPosition,secondaryPosition,currentClub,
            strengths,contactInfoOfCoaches,openToTrials, followDiet,willingToRelocate} = req.body

            if (!req.file) {
                return res.status(400).json({
                    message: "Please upload a short vidoe showing your skills"
                });
            };

        const player = await Player.findByPk(playerId);
        if(!player){
            fs.unlinkSync(req.file.path)
            return res.status(404).json({
                message:"Player not found"
            })
        };

        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error, data) => {
            if (error) {
                return res.status(400).json({
                    message: error.message
                })
            } else {
                return data
            }
        });
        // Unlink the file from our local storage
        fs.unlinkSync(req.file.path);
        const data =({
            age,nationality,height,weight,preferredFoot,playingPosition,
            phoneNumber,homeAddress,primaryPosition,secondaryPosition,currentClub,
            strengths,contactInfoOfCoaches,openToTrials,media:result.secure_url,followDiet,willingToRelocate,playerId
        });
        if (!player.profileCompletion) {  
            player.profileCompletion = true
             
        }
        await player.save() 
        
    const playerDetails = await PlayerKyc.create(data);
            res.status(201).json({
                message: "KYC completed successfully",
                data: playerDetails
            })
    } catch (error) {
        console.log(error.message)
           if (req.file.path) {
                    // Unlink the file from our local storage
                    fs.unlinkSync(req.file.path)
                }
        res.status(500).json({

            message:"Unable to complete KYC" + error.message
        })
    }
};


