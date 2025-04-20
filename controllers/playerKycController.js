'use strict';

const {Player} = require('../models');
const {PlayerKyc} = require('../models');
const cloudinary = require('../config/cloudinary');
const fs = require('fs')


exports.playerInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
          age,
          gender,
          nationality,
          height,
          weight,
          preferredFoot,
          phoneNumber,
          homeAddress,
          primaryPosition,
          secondaryPosition,
          currentClub,
          ability,
          contactInfoOfCoaches,
          openToTrials,
          followDiet,
          willingToRelocate
        } = req.body;
        console.log('Received KYC data:', req.body)

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a short video showing your skills"
            });
        }
        const player = await Player.findByPk(id);
        if (!player) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({
                message: "Player not found"
            });
        }

        const existingKyc = await PlayerKyc.findOne({ where: { id: id} });
        if (existingKyc || player.profileCompletion) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: "Player KYC already captured"
            });
        }

        let cloudinaryResult;
        try {
            cloudinaryResult = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
            fs.unlinkSync(req.file.path); 
        } catch (uploadError) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: `Error uploading video: ${uploadError.message}`
            });
        }

        const playerKycData = {
    age,gender,nationality,height,weight,preferredFoot,phoneNumber,homeAddress,primaryPosition,secondaryPosition,
    currentClub,ability, contactInfoOfCoaches,openToTrials,followDiet,willingToRelocate,media: cloudinaryResult.secure_url,
      playerId: id
        };

        const playerDetails = await PlayerKyc.create(playerKycData);

        player.profileCompletion = true;
        await player.save();

        return res.status(201).json({
            message: "KYC completed successfully",
            data: playerDetails
        });

    } catch (error) {
      console.log(error.message)
        console.error(error.message);

        return res.status(500).json({
            message: `Unable to complete KYC: ${error.message}`
        });
    }
};


exports.updatePlayerInfo = async(req, res) => {
    try {
        const {id} = req.params;
        const {
          age,gender,nationality,height,weight,preferredFoot,phoneNumber,homeAddress,primaryPosition,secondaryPosition,
          currentClub,ability, contactInfoOfCoaches,openToTrials,followDiet,willingToRelocate} = req.body;

        const player = await Player.findByPk(id);
        if (!player) {
            if (req.file && req.file.path) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({
                message: "Player not found"
            });
        }

        const existingPlayerKyc = await PlayerKyc.findOne({where: { id:id }});
        
        if (!existingPlayerKyc) {
            if (req.file && req.file.path) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({
                message: "Player profile not found. Please create a profile first."
            });
        }

        let updateData = {
          age,gender,nationality,height,weight,preferredFoot,phoneNumber,homeAddress,primaryPosition,secondaryPosition,
          currentClub,ability, contactInfoOfCoaches,openToTrials,followDiet,willingToRelocate,media: cloudinaryResult.secure_url,
            playerId: id
        };

        if (req.file) {
            try {
                const existingDocumentUrl = existingPlayerKyc.media;
                if (existingDocumentUrl) {
                    const fileExtension = existingDocumentUrl.split('.').pop();
                    const resourceType = fileExtension === 'video/' || fileExtension === 'application/' || fileExtension === 'image/' ? 
                                        fileExtension.replace('/', '') : 'image';
                    const publicId = existingDocumentUrl.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
                }

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

exports.deletePlayerInfo = async (req, res) => {
    try {
      const { id} = req.params;
  
      const player = await Player.findByPk(id);
      if (!player) {
        return res.status(404).json({
          message: "Player not found"
        });
      }
  
      const playerKyc = await PlayerKyc.findOne({ where: { id:id } });
      if (!playerKyc) {
        return res.status(404).json({
          message: "Player profile not found"
        });
      }
  
      const documentUrl = playerKyc.media;
      if (documentUrl) {
        const fileName = documentUrl.split('/').pop();
        const fileExtension = fileName.split('.').pop().toLowerCase();
        const publicId = fileName.split('.')[0];
  
        let resourceType = 'image'; // Default
        if (['mp4', 'mov', 'avi'].includes(fileExtension)) {
          resourceType = 'video';
        } else if (['pdf', 'docx'].includes(fileExtension)) {
          resourceType = 'raw';
        }
  
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      }
  
      await playerKyc.destroy();
  
      res.status(200).json({
        message: "Player profile deleted successfully"
      });
    } catch (error) {
      console.error("Delete Player Info Error:", error.message);
      res.status(500).json({
        message: "Unable to delete player profile: " + error.message
      });
    }
  };
  
  
  exports.profilePic = async (req, res) => {
    try {
      const { id } = req.params;
  
      const player = await PlayerKyc.findOne({ where: { id:id } });
      if (!player) {
        if (req.file.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({
          message: "Player not found"
        });
      }

      const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
  
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

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
  
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
  
      res.status(500).json({
        message: "Unable to upload player profile picture: " + error.message
      });
    }
  };
  

exports.deleteProfilePic = async (req, res) => {
    try {
      const { id } = req.params;
  
      const player = await PlayerKyc.findOne({ where: { id:id } });
  
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
  

  

exports.videoUpload = async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { id } = req.params;
    const player = await PlayerKyc.findOne({ where: { id: id } });

    if (!player) {
      
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        message: "Player not found"
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'video' });

    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    player.videoUpload = result.secure_url;
    await player.save();

    res.status(200).json({
      message: "Video successfully uploaded",
      data: {
        videoUpload: result.secure_url
      }
    });

  } catch (error) {
    console.error("Video Upload Error:", error.message);

  
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: "Unable to upload player video: " + error.message
    });
  }
};
