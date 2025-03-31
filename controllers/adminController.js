const Player = require("../models/player");
const Scout = require("../models/scout");


exports.deletePlayerAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findByPk(id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    await player.destroy();
    return res.status(200).json({ message: "Player account deleted successfully" });
  } catch (error) {
    console.error("Error deleting player:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.deleteScoutAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const scout = await Scout.findByPk(id);
    if (!scout) {
      return res.status(404).json({ message: "Scout not found" });
    }

    await scout.destroy();
    return res.status(200).json({ message: "Scout account deleted successfully" });
  } catch (error) {
    console.error("Error deleting scout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.verifyScout = async (req, res) => {
  try {
    const { id } = req.params;
    const scout = await Scout.findByPk(id);
    if (!scout) {
      return res.status(404).json({ message: "Scout not found" });
    }

    scout.isVerified = true;
    await scout.save();

    return res.status(200).json({ message: "Scout verified successfully" });
  } catch (error) {
    console.error("Error verifying scout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.promoteToAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findByPk(id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    player.role = "admin";
    await player.save();

    return res.status(200).json({ message: "Player promoted to admin successfully" });
  } catch (error) {
    console.error("Error promoting player:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
