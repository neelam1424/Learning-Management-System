import { clerkClient } from '@clerk/express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from '../models/Purchase.js';

// Update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const { userId } = req.auth(); // ✅ correct usage
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: 'educator' },
    });
    res.json({ success: true, message: 'You can publish a course now' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add New Course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const { userId: educatorId } = req.auth(); // ✅ correct usage

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail Not Attached" });
    }

    // Upload image first
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    const newCourse = await Course.create(parsedCourseData);

    res.json({ success: true, message: 'Course Added', course: newCourse });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const { userId: educator } = req.auth();
    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Dashboard Data (Total Earnings, Enrolled Students, No. of Courses)
export const educatorDashboardData = async (req, res) => {
  try {
    const { userId: educator } = req.auth();
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    const courseIds = courses.map(course => course._id);

    // Total earnings
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed',
    });
    const totalEarnings = purchases.reduce((sum, p) => sum + p.amount, 0);

    // Unique student IDs
    const allStudentIds = [...new Set(courses.flatMap(c => c.enrolledStudents))];
    const students = await User.find({ _id: { $in: allStudentIds } }, 'name imageUrl');

    // Map students to courses
    const enrolledStudentsData = [];
    courses.forEach(course => {
      course.enrolledStudents.forEach(studentId => {
        const student = students.find(s => s._id.toString() === studentId.toString());
        if (student) {
          enrolledStudentsData.push({ courseTitle: course.courseTitle, student });
        }
      });
    });

    res.json({
      success: true,
      dashboardData: { totalEarnings, totalCourses, enrolledStudentsData },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



//Get Enrolled Students Data with Purchase Data

export const getEnrolledStudentsData= async(req,res)=>{
    try{
        const { userId: educator } = req.auth();
    const courses = await Course.find({ educator });
    const courseIds = courses.map(course => course._id);

    const purchases=await Purchase.find({
        courseId:{$in:courseIds},
        status:'completed'
    }).populate('userId','name imageUrl').populate('courseId','courseTitle')

    const enrolledStudents=purchases.map(purchase =>({
        student:purchase.userId,
        courseTitle:purchase.courseId.courseTitle,
        purchaseData: purchase.createdAt
    }));


     res.json({
      success: true,
      enrolledStudents 
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}