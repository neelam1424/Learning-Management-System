import User from "../models/User.js"

// Get User Data
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth; // ✅ correct usage
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: 'User Not Found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Users Enrolled Courses with Lecture Links
export const userEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.auth; // ✅ correct usage
    const user = await User.findById(userId).populate({
      path: "enrolledCourses",
      populate: { path: "lectures" }
    });

    if (!user) {
      return res.json({ success: false, message: 'User Not Found' });
    }

    res.json({ success: true, enrolledCourses: user.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
