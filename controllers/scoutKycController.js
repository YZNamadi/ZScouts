'use strict';

const {Scout} = require('../models');
const {ScoutKyc }= require('../models');
const cloudinary = require('../config/cloudinary');
const fs = require('fs')

exports.scoutInfo = async(req, res) => {
    try {
        const {id} = req.params;
        const { gender, nationality, phoneNumber, clubName, scoutingRole, league, preferredPosition,
            age} = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "Verification document required"
            });
        }

        const scout = await Scout.findByPk(id);
        if (!scout) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({
                message: "Scout not found"
            });
        }
        
        const existingKyc = await ScoutKyc.findOne({where:{id:id}});
        if (existingKyc || scout.profileCompletion) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: "Scout KYC already captured"
            });
        }
        let result;
        try {
            result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
            fs.unlinkSync(req.file.path);
          } catch (uploadError) {
            console.error("Cloudinary Upload Error:", uploadError); // Log the full error
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
              message: "Error uploading document: " + (uploadError.message || "Unknown error")
            });
          }
          

        const data = {
            gender,
            nationality, 
            phoneNumber, 
            verificationDocument: result.secure_url,
            clubName,
            scoutingRole,
            league,
            preferredPosition,
            age,
            scoutId: id
        };
        const scoutDetails = await ScoutKyc.create(data);
        
        scout.profileCompletion = true;
        await scout.save();

        return res.status(201).json({
            message: "KYC completed successfully",
            data: scoutDetails
        });
    } catch (error) {
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.log("Error cleaning up file:", unlinkError.message);
            }
        }
        
        return res.status(500).json({
            message: "Unable to complete KYC: " + error.message
        });
    }
};

exports.updateScoutInfo = async(req, res) => {
    try {
        const {id} = req.params;
        const {
            nationality, phoneNumber, clubName, scoutingRole, league, preferredPosition,
            preferredAge, socialMediaProfile} = req.body;

        const scout = await Scout.findByPk(id);
        if (!scout) {
            if (req.file && req.file.path) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({
                message: "Scout not found"
            });
        }

        const existingScoutKyc = await ScoutKyc.findOne({where: { id:id }});
        
        if (!existingScoutKyc) {
            if (req.file && req.file.path) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({
                message: "Scout profile not found. Please create a profile first."
            });
        }

        let updateData = {
            nationality: nationality,
            phoneNumber: phoneNumber,
            clubName: clubName,
            scoutingRole: scoutingRole,
            league: league,
            preferredPosition: preferredPosition,
            preferredAge: preferredAge,
            socialMediaProfile: socialMediaProfile
        };

        
        if (req.file) {
            try {
                const existingDocumentUrl = existingScoutKyc.verificationDocument;
                if (existingDocumentUrl) {
     const fileExtension = existingDocumentUrl.split('.').pop();
 const resourceType = fileExtension === 'video/' || fileExtension === 'application/' || fileExtension === 'image/' 
                    const publicId = existingDocumentUrl.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
                }

                const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
                updateData.verificationDocument = result.secure_url;
                
                
                fs.unlinkSync(req.file.path);
            } catch (uploadError) {
                // if (req.file && req.file.path) {
                //     fs.unlinkSync(req.file.path);
                // }
                return res.status(400).json({
                    message: "Error uploading document: " + uploadError.message
                });
            }
        }
        
        await existingScoutKyc.update(updateData);

        res.status(200).json({
            message: "Scout profile updated successfully",
            data: existingScoutKyc
        });
    } catch (error) {
        console.log(error.message);
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.log("Error deleting file:", unlinkError.message);
            }
        }
        
        res.status(500).json({
            message: "Unable to update scout profile: " + error.message
        });
    }
};

exports.deleteScoutInfo = async(req, res) => {
    try {
        const { id} = req.params;

        const scout = await Scout.findByPk(id);
        if (!scout) {
            return res.status(404).json({
                message: "Scout not found"
            });
        }

        const scoutKyc = await ScoutKyc.findOne({where:{ id }});

        if (!scoutKyc) {
            return res.status(404).json({
                message: "Scout profile not found"
            });
        }
        const documentUrl = scoutKyc.verificationDocument;
        if (documentUrl) {
            const fileExtension = documentUrl.split('.').pop();

 const resourceType = fileExtension === 'video/' || fileExtension === 'application/' || fileExtension === 'image/';
 const publicId = documentUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        }
        await scoutKyc.destroy();

        res.status(200).json({
            message: "Scout profile deleted successfully"
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Unable to delete scout profile: " + error.message
        });
    }
};



exports.profilePic = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const scout = await Scout.findByPk(id);
    if (!scout) {
      await fs.unlink(req.file.path);
      return res.status(404).json({ message: "Scout not found" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'image',
      folder: 'scouts/profilePics',
      transformation: [{ width: 400, height: 400, crop: "limit" }]
    });

    await fs.unlink(req.file.path); // Non-blocking delete

    scout.profilePic = result.secure_url;
    await scout.save();

    res.status(200).json({
      message: "Profile picture successfully uploaded",
      data: { profilePic: result.secure_url }
    });

  } catch (error) {
    console.error("Profile Pic Upload Error:", error.message);
    res.status(500).json({
      message: "Unable to upload scout profile picture: " + error.message
    });
  }
};

  
  exports.deleteScoutProfilePic = async (req, res) => {
    try {
      const { id: scoutId } = req.params;
      const scout = await Scout.findByPk(scoutId);
  
      if (!scout) {
        return res.status(404).json({
          message: "Scout not found"
        });
      }
  
      if (!scout.profilePic) {
        return res.status(400).json({
          message: "No profile picture to delete"
        });
      }
  
      const fileName = scout.profilePic.split('/').pop();
      const publicId = fileName?.split('.')[0]; 
  
      if (!publicId) {
        return res.status(400).json({
          message: "Unable to determine image ID from URL"
        });
      }
  
      await cloudinary.uploader.destroy(publicId);
  
      scout.profilePic = null;
      await scout.save();
  
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
  
  