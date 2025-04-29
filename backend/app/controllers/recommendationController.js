// backend/app/controllers/recommendationController.js
import { fetchRecommendations } from '../utils/ai';
import User from '../models/User';

const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const recommendations = await fetchRecommendations(user.healthData);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getRecommendations };
