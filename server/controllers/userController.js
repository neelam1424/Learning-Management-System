import User from "../models/User.js";
import Purchase from "../models/Purchase.js";  // ✅ use default import
import Stripe from "stripe";
import Course from "../models/Course.js";

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
