import User from "../models/User.js";
import Purchase from "../models/Purchase.js";  // ✅ use default import
import Stripe from "stripe";
import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";

// Get User Data
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Users Enrolled Courses with Lecture Links
export const userEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId).populate({
      path: "enrolledCourses",
      populate: { path: "lectures" },
    });

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    res.json({ success: true, enrolledCourses: user.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Purchase Course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const {userId} = req.auth();

    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: "User or Course Not Found" });
    }

    // ✅ Calculate final amount
    const amount =
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100;

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: Number(amount.toFixed(2)), // store as Number, not string
    };

    const newPurchase = await Purchase.create(purchaseData);

    // ✅ Initialize Stripe
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY?.toLowerCase() || "usd";

    // ✅ Stripe requires integer cents
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.round(newPurchase.amount * 100),
        },
        quantity: 1,
      },
    ];

    // ✅ Safe fallback for origin
    const baseUrl = origin || process.env.CLIENT_URL || "http://localhost:5173";

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${baseUrl}/loading/my-enrollments`,
      cancel_url: `${baseUrl}/`,
      line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};







//Update User Course Progress
export const updateUserCourseProgress = async (req,res)=>{
  try{
    const {userId} = req.auth();
    const { courseId,lectureId } = req.body;
     const progressData = await CourseProgress.findByOne({userId,courseId});

     if(progressData){
      if(progressData.lectureCompleted.includes()){
        return res.json({success: true, message:'Lecture Already Completed'})
      }
      progressData.lectureCompleted.push(lectureId)
      await progressData.save()
     }else{
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted:[lectureId]
      })
     }
     res.json({success:true,message:'Progress Updated'})
    
  }catch(error){
 res.json({success:false,message: error.message})
  }
}






//Get User Course Progress
export const getUserCourseProgress = async (req,res)=>{
  try{
    const {userId} = req.auth();
    const { courseId,lectureId } = req.body;
     const progressData = await CourseProgress.findByOne({userId,courseId});

     
     res.json({success:true,progressData})
    
  }catch(error){
 res.json({success:false,message: error.message})
  }
}




//Add User Ratings to Course
export const addUserRating = async (req,res)=>{
  
    const {userId} = req.auth();
    const { courseId,rating } = req.body;
     
    if(!courseId||!userId||!rating||rating<1||rating>5){
      return res.json({success:false,message:'Invalid Details'})
    }

    try {
      const course= await Course.findById(courseId);
      if(!course){
         res.json({success:false,message:'Course not found'});
      }
    const user = await User.findById(userId);

    if(!user || !user.enrolledCourses.includes(courseId)){
return res.json({success:false,message:'User has not purchased this course.'})
    }
    const existingRatingIndex = course.courseRatings.findIndex(r=> r.userId===userId)

    if(existingRatingIndex>-1){
      course.courseRatings[existingRatingIndex].rating = rating;
    }else{
      course.courseRatings.push({userId,rating});
    }
    await course.save();

    return res.json({success:true,message:'rating added'})
    
    
  }catch(error){
 res.json({success:false,message: error.message})
  }
  }

