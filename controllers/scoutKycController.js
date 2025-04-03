const Scout = require('../models/scout');
const ScoutKyc = require('../models/scoutkyc');
const cloudinary = require('../config/cloudinary');
const fs = require('fs')

exports.scoutInfo = async(req, res)=>{
    try {
        console.log(req.params)
        console.log("Incoming file:", req.file); 
        console.log("Request body:", req.body);

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
            preferredAge,socialMediaProfile
        });
    const scoutDetails = await ScoutKyc.create(data);
            res.status(201).json({
                message: "KYC completed successfully",
                data: scoutDetails
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