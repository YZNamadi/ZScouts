'use strict';

const {Scout} = require('../models');
const {ScoutKyc }= require('../models');
const cloudinary = require('../config/cloudinary');
const fs = require('fs')

exports.scoutInfo = async(req, res)=>{
    try {

        const {id: scoutId} = req.params;
        const {nationality, phoneNumber,clubName,scoutingRole,league,preferredPosition,
            preferredAge,socialMediaProfile} = req.body

            // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                message: "Verification document required"
            });
        };

        const scout = await Scout.findByPk(scoutId);
        if(!scout){
            fs.unlinkSync(req.file.path)
            return res.status(404).json({
                message:"Scout not found"
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
                fs.unlinkSync(req.file.path);


        const data = ({
            nationality, phoneNumber, verificationDocument:result.secure_url,clubName,scoutingRole,league,preferredPosition,
            preferredAge,socialMediaProfile,scoutId
        });
        if (!scout.profileCompletion) {  
            scout.profileCompletion = true
        }
        await scout.save() 
    const scoutDetails = await ScoutKyc.create(data);
            res.status(201).json({
                message: "KYC completed successfully",
                data: scoutDetails
            })
    } catch (error) {
        if (req.file.path) {
            // Unlink the file from our local storage
            fs.unlinkSync(req.file.path)
        }
        res.status(500).json({
            message:"Unable to complete KYC" + error.message
        })
    }
};


exports.updateScoutInfo = async(req, res) => {
    try {
        const {id: scoutId} = req.params;
        const {
            nationality, phoneNumber, clubName, scoutingRole, league, preferredPosition,
            preferredAge, socialMediaProfile} = req.body;

    
        const scout = await Scout.findByPk(scoutId);
        if (!scout) {
            if (req.file && req.file.path) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({
                message: "Scout not found"
            });
        }

        // Find existing scout KYC data
        const existingScoutKyc = await ScoutKyc.findOne({where: { scoutId }});
        
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

        // If file is uploaded, process it and update the verification document
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
                
            
                updateData.verificationDocument = result.secure_url;
                
            
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
        await existingScoutKyc.update(updateData);

        res.status(200).json({
            message: "Scout profile updated successfully",
            data: existingScoutKyc
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
            message: "Unable to update scout profile: " + error.message
        });
    }
};

exports.deleteScoutInfo = async(req, res) => {
    try {
        const { id: scoutId } = req.params;

        const scout = await Scout.findByPk(scoutId);
        if (!scout) {
            return res.status(404).json({
                message: "Scout not found"
            });
        }

        const scoutKyc = await ScoutKyc.findOne({where:{ scoutId }});

        if (!scoutKyc) {
            return res.status(404).json({
                message: "Scout profile not found"
            });
        }

        const documentUrl = scoutKyc.verificationDocument;
        await scoutKyc.destroy();

        if (documentUrl) {
            try {
                const publicId = documentUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudinaryError) {
                console.log("Error deleting document from Cloudinary:", cloudinaryError.message)
            }
        }

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