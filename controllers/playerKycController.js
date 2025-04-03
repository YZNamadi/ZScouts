const Player = require('../models/player');
const playerKyc = require('../models/playerkyc');
const cloudinary = require('../config/cloudinary');


exports.playerInfo = async(req, res)=>{
    try {
       const {id:playerId} = req.params
        const {age,nationality,height,weight,preferredFoot,playingPosition,
            phoneNumber,homeAddress,primaryPosition,secondaryPosition,currentClub,
            strengths,coachesWorkedWith,openToTrails, followDiet,willingToRelocate} = req.body

            if (!req.file) {
                return res.status(400).json({
                    message: "Verification document required"
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
            strengths,coachesWorkedWith:coachesWorkedWith || [
                {
                    coachName: "john doe",
                    coachNumber:"+2349057",
                    coachEmail: "johndoe@gmail.com"
                }
            ],openToTrails,media:result.secure_url,followDiet,willingToRelocate
        });
    const playerDetails = await playerKyc.create(data);
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