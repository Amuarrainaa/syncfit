// backend/app/controllers/healthDataController.js
import User from '../models/User';

const updateHealthData = async (req, res) => {
  const userId = req.user.id;
  const { healthData } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { healthData }, { new: true });
    res.json({ message: 'Health data updated', healthData: user.healthData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { updateHealthData };
