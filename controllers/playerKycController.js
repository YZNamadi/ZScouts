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

        const existingKyc = await PlayerKyc.findOne({where:{playerId}})
        if (existingKyc || player.profileCompletion){
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: "Player KYC already captured"
            });
        }

        let result;
        try{
            result = await cloudinary.uploader.upload(req.file.path, {resource_type: 'auto'})
            fs.unlinkSync(req.file.path)
        }catch(uploadError){
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: "error uploading video: " + uploadError.message
            });
        }
        const data =({
            age,nationality,height,weight,preferredFoot,playingPosition,
            phoneNumber,homeAddress,primaryPosition,secondaryPosition,currentClub,
            strengths,contactInfoOfCoaches,openToTrials,media:result.secure_url,followDiet,willingToRelocate,playerId
        });
        const playerDetails = await PlayerKyc.create(data);
        player.profileCompletion = true;
        await player.save();

         return res.status(201).json({
                message: "KYC completed successfully",
                data: playerDetails
            })
    } catch (error) {
        console.log(error.message)
        //    if (req.file.path) {
        //             // Unlink the file from our local storage
        //             fs.unlinkSync(req.file.path)
        //         }
        res.status(500).json({
        
            message:"Unable to complete KYC" + error.message
        })
    }
};


exports.updatePlayerInfo = async(req, res) => {
    try {
        const {id: playerId} = req.params;
        const {
            age,nationality,height,weight,preferredFoot,playingPosition,
            phoneNumber,homeAddress,primaryPosition,secondaryPosition,currentClub,
            strengths,contactInfoOfCoaches,openToTrials, followDiet,willingToRelocate} = req.body;

        const player = await Player.findByPk(playerId);
        if (!player) {
            if (req.file && req.file.path) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({
                message: "Player not found"
            });
        }

        // Find existing player KYC data
        const existingPlayerKyc = await PlayerKyc.findOne({where: { playerId }});
        
        if (!existingPlayerKyc) {
            if (req.file && req.file.path) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({
                message: "Player profile not found. Please create a profile first."
            });
        }

        let updateData = {
            age,nationality,height,weight,preferredFoot,playingPosition,
            phoneNumber,homeAddress,primaryPosition,secondaryPosition,currentClub,
            strengths,contactInfoOfCoaches,openToTrials, followDiet,willingToRelocate
        };

        // If file is uploaded, process it and update the verification document
        if (req.file) {
            try {
                // First, delete the existing document from Cloudinary if it exists
                const existingDocumentUrl = existingPlayerKyc.media;
                if (existingDocumentUrl) {
                    const fileExtension = existingDocumentUrl.split('.').pop();
                    const resourceType = fileExtension === 'video/' || fileExtension === 'application/' || fileExtension === 'image/' ? 
                                        fileExtension.replace('/', '') : 'image';
                    const publicId = existingDocumentUrl.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
                }

                // Upload the new document
                const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
                updateData.media = result.secure_url;
                
                // Clean up local file
                fs.unlinkSync(req.file.path);
            } catch (uploadError) {
                if (req.file && req.file.path) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    message: "Error uploading document: " + uploadError.message
                });
            }
        }
        
        await existingPlayerKyc.update(updateData);

        res.status(200).json({
            message: "Scout profile updated successfully",
            data: existingPlayerKyc
        });
    } catch (error) {
        console.log(error.message);
        // Only try to delete the file if it exists
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.log("Error deleting file:", unlinkError.message);
            }
        }
        res.status(500).json({
            message: "Unable to update player profile: " + error.message
        });
    }
};

exports.deletePlayerInfo = async(req, res) => {
    try {
        const { id:playerId} = req.params;

        const player = await Player.findByPk(playerId);
        if (!player) {
            return res.status(404).json({
                message: "Player not found"
            });
        }

        const playerKyc = await PlayerKyc.findOne({where:{ playerId }});

        if (!PlayerKyc) {
            return res.status(404).json({
                message: "Player profile not found"
            });
        }
        const documentUrl = playerKyc.media;
        if (documentUrl) {
            const fileExtension = documentUrl.split('.').pop();

            const resourceType = fileExtension === 'video/' || fileExtension === 'application/' || fileExtension === 'image/';
            const publicId = documentUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        }

        await playerKyc.destroy();

        res.status(200).json({
            message: "Player profile deleted successfully"
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Unable to delete player profile: " + error.message
        });
    }
};


exports.profilePic = async (req, res) => {
  try {
    const { id: playerId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a profile picture"
      });
    }

    const player = await PlayerKyc.findOne({ where: { playerId } });
    if (!player) {
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        message: "Player not found"
      });
    }
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image'});

    fs.unlinkSync(req.file.path);

    player.profilePic = result.secure_url;
    await player.save();

    res.status(200).json({
      message: "Profile picture successfully uploaded",
      data: {
        profilePic: result.secure_url
      }
    });

  } catch (error) {
    console.error("Profile Pic Upload Error:", error.message);
    res.status(500).json({
      message: "Unable to upload player profile picture: " + error.message
    });
  }
};


exports.deleteProfilePic = async (req, res) => {
    try {
      const { id: playerId } = req.params;
  
      const player = await PlayerKyc.findOne({ where: { playerId } });
  
      if (!player) {
        return res.status(404).json({
          message: "Player not found"
        });
      }
  
      if (!player.profilePic) {
        return res.status(400).json({
          message: "No profile picture to delete"
        });
      }
  
      const fileName = player.profilePic.split('/').pop();
      const publicId = fileName.split('.')[0]; 
  
      if (!publicId) {
        return res.status(400).json({
          message: "Unable to determine image ID from URL"
        });
      }
  
      await cloudinary.uploader.destroy(publicId);
      
      scout.profilePic = null;
      await player.save();
  
      res.status(200).json({
        message: "Profile picture successfully deleted"
      });
  
    } catch (error) {
      console.error("Delete Profile Pic Error:", error.message);
      res.status(500).json({
        message: "Unable to delete profile picture: " + error.message
      });
    }
  };
  

