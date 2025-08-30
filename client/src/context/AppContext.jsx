// import { createContext, useEffect, useState } from "react";
// import { dummyCourses } from "../assets/assets";
// import { useNavigate } from "react-router-dom";
// import humanizeDuration from 'humanize-duration'
// import {useAuth,useUser} from '@clerk/clerk-react'
// import axios from 'axios'
// import { toast } from "react-toastify";

// export const AppContext = createContext();

// export const AppContextProvider =(props)=>{

//     const backendUrl = import.meta.env.VITE_BACKEND_URL.trim()
    

//     const currency =import.meta.env.VITE_CURRENCY
//     const navigate =useNavigate()

//     const{getToken}= useAuth()
//     const {user} =useUser()


//     const [allCourses,setAllCourses]= useState([])
//     const [isEducator,setIsEducator]= useState(false)
//     const [enrolledCourses,setEnrolledCourses]= useState([])
//     const [userData,setUserData]= useState(null)

//     //Fetch all courses

//     const fetchAllCourses = async()=>{
//         try {
//             const {data}=await axios.get(backendUrl+'/api/course/all');

//             if(data.success){
//                 setAllCourses(data.courses)
//             }else{
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     //Fetch UserData
//     const fetchUserData = async()=>{

//         if(user.publicMetadata.role==='educator'){
//             setIsEducator(true)
//         }



//         try {

//             const token= await getToken();

//             const {data}=await axios.get(backendUrl + '/api/user/data',{headers:{Authorization:`Bearer ${token}`}});

//             if(data.success){
//                 setUserData(data.user)
//             }else{
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             toast.error(error.message)
//         }
//     }






















//     //Function to calculate average rating of course
//     const calculateRating =(course)=>{
//         if(course.courseRatings.length ===0){
//             return 0;
//         }
//         let totalRating=0
//         course.courseRatings.forEach(rating =>{
//             totalRating += rating.rating
//         })
//         return Math.floor(totalRating / course.courseRatings.length
// )
//     }










    
//     // function to calculate course chapter time
//     const calculateChapterTime =(chapter) =>{
//         let time =0
//         chapter.chapterContent.map((lecture)=> time += lecture.lectureDuration)
//         return humanizeDuration(time * 60 *1000,{unit:["h","m"]})
//     }

//     //Function to calculate course duration
//     const calculateCourseDuration =(course)=>{
//         let time=0
//         course.courseContent.map((chapter)=> chapter.chapterContent.map(lecture=>time +=lecture.lectureDuration
//         ))
//         return humanizeDuration(time * 60 *1000,{unit:["h","m"]})

//     }

//     //Function to calculate the number of lectures in the course

//     const calculateNoOfLectures=(course)=>{
//         let totalLectures=0;
//         course.courseContent.forEach(chapter=>{
//             if(Array.isArray(chapter.chapterContent)){
//                 totalLectures += chapter.chapterContent.length
//             }
//         });
//         return totalLectures;
//     }

//     //Fetch User Enrolled Courses
//     const fetchUserEnrolledCourses = async ()=>{

//         try {
            
//         const token = await getToken();
//         const {data} = await axios.get(backendUrl + '/api/user/enrolled-courses',{headers:{Authorization:`Bearer ${token}`}})

//         if(data.success){
//             setEnrolledCourses(data.enrolledCourses.reverse())
//         }else{
//             toast.error(data.message)
//         }
//         } catch (error) {
//             toast.error(data.message)
//         }


//     }










//     useEffect(()=>{
//         fetchAllCourses()
        
//     },[])


//     useEffect(()=>{
//         if(user){
//             fetchUserData()
//             fetchUserEnrolledCourses()
//         }
//     },[user])

//     const value={
//         currency,allCourses,navigate,calculateRating,isEducator,setIsEducator,calculateNoOfLectures,calculateCourseDuration,calculateChapterTime,enrolledCourses,fetchUserEnrolledCourses,backendUrl,userData,setUserData,getToken,fetchAllCourses

//     }
//     return (
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     )

// }

import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL.trim();
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  // ----------------------
  // Axios Instances
  // ----------------------
  const api = axios.create({
    baseURL: backendUrl,
    headers: { "Content-Type": "application/json" },
  });

  const authApi = async () => {
    const token = await getToken();
    return axios.create({
      baseURL: backendUrl,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // ----------------------
  // Fetch All Courses
  // ----------------------
  const fetchAllCourses = async () => {
    try {
      const { data } = await api.get("/api/course/all");
      if (data.success) setAllCourses(data.courses);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ----------------------
  // Fetch User Data
  // ----------------------
  const fetchUserData = async () => {
    if (user?.publicMetadata?.role === "educator") setIsEducator(true);

    try {
      const apiWithAuth = await authApi();
      const { data } = await apiWithAuth.get("/api/user/data");
      if (data.success) setUserData(data.user);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ----------------------
  // Fetch User Enrolled Courses
  // ----------------------
  const fetchUserEnrolledCourses = async () => {
    try {
      const apiWithAuth = await authApi();
      const { data } = await apiWithAuth.get("/api/user/enrolled-courses");
      if (data.success) setEnrolledCourses(data.enrolledCourses.reverse());
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ----------------------
  // Calculate Average Rating
  // ----------------------
  const calculateRating = (course) => {
    if (!course.courseRatings?.length) return 0;
    const total = course.courseRatings.reduce((sum, r) => sum + r.rating, 0);
    return Math.floor(total / course.courseRatings.length);
  };

  // ----------------------
  // Calculate Course Duration
  // ----------------------
  const calculateChapterTime = (chapter) => {
    const time = chapter.chapterContent?.reduce(
      (sum, lecture) => sum + lecture.lectureDuration,
      0
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent?.forEach((chapter) => {
      chapter.chapterContent?.forEach((lecture) => {
        time += lecture.lectureDuration;
      });
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateNoOfLectures = (course) => {
    let total = 0;
    course.courseContent?.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent))
        total += chapter.chapterContent.length;
    });
    return total;
  };

  // ----------------------
  // Effects
  // ----------------------
  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [user]);

  // ----------------------
  // Context Value
  // ----------------------
  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
