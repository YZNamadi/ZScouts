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
            console.log(req.body.openToTrials)
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
        const data ={
            age,nationality,height,weight,preferredFoot,playingPosition,
            phoneNumber,homeAddress,primaryPosition,secondaryPosition,currentClub,
            strengths,contactInfoOfCoaches,openToTrials,media:result.secure_url,followDiet,willingToRelocate,playerId
        };
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

        res.status(500).json({

            message:"Unable to complete KYC" + error.message
        })
    }
};

exports.updatePlayerInfo = async (req, res) => {
    try {
        const { playerId } = req.params;
        const {age,nationality,height,weight,preferredFoot,playingPosition,
            phoneNumber,homeAddress,primaryPosition,secondaryPosition,currentClub,
            strengths,contactInfoOfCoaches,openToTrials, followDiet,willingToRelocate} = req.body
 
        const player = await playerModel.findByPk({ where: { playerId } });
       
        if (!player) {
            if (req.file && req.file.path) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({
                
                message: 'Player Not Found'
            });
        }

        const data ={
            age,nationality,height,weight,preferredFoot,playingPosition,
            phoneNumber,homeAddress,primaryPosition,secondaryPosition,currentClub,
            strengths,contactInfoOfCoaches,openToTrials,media:result.secure_url,followDiet,willingToRelocate,playerId
        };


        const updatedPlayerInfo = await playerkycModel.findByPk(data,{ where: { playerId } });
        
        res.status(200).json({
            message: 'player updated successfully',
            data: updatedPlayerInfo
        });


    } catch (error) {
       if (req.file && req.file.path) {
           try {
               fs.unlinkSync(req.file.path);
           } catch (unlinkError) {
             console.log("Error deleting file:", unlinkError.message);
           }
       }
        res.status(500).json({
            message:"Unable to update KYC" + error.message
        })
    }
}

exports.deletePlayerInfo = async (req, res) => {
    try {
        const {playerId} = req.params
       
        const playerInfo = await playerModel.findByPk({ where: { playerId } });
        if (!playerInfo) {
            return res.status(404).json({ message: 'player info not found' });
        }


        // await playerInfo.destroy();

        res.status(200).json({ message: 'player info deleted successfully' });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: 'Error deleting player info',error: error.message });
    }
};

