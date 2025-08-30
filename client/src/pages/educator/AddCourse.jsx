// import React, { useContext, useEffect, useRef, useState } from "react";
// import {nanoid} from "nanoid/non-secure";
// import Quill from "quill";
// import { assets } from "../../assets/assets";
// import { AppContext } from "../../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const AddCourse = () => {


//   const {backendUrl,getToken}=useContext(AppContext)


//   const quillRef = useRef(null);
//   const editorRef = useRef(null);

//   // ❗ Make controlled inputs use strings (not null)
//   const [courseTitle, setCourseTitle] = useState(""); // was null -> ""
//   const [coursePrice, setCoursePrice] = useState(0);
//   const [discount, setDiscount] = useState(0);

//   const [image, setImage] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null); // for safe <img> preview

//   const [chapters, setChapters] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [currentChapterId, setCurrentChapterId] = useState(null);

//   const [lectureDetails, setLectureDetails] = useState({
//     lectureTitle: "",
//     lectureDuration: "",
//     lectureUrl: "",
//     isPreviewFree: false,
//   });

//   // Build a safe ObjectURL preview and clean it up
//   useEffect(() => {
//     if (!image) {
//       setPreviewUrl(null);
//       return;
//     }
//     const url = URL.createObjectURL(image);
//     setPreviewUrl(url);
//     return () => URL.revokeObjectURL(url);
//   }, [image]);

//   const handleChapter = (action, chapterId) => {
//     if (action === "add") {
//       const title = prompt("Enter Chapter Name:");
//       if (title) {
//         const newChapter = {
//           chapterId: nanoid(),
//           ChapterTitle: title, // fixed key: chapterTitle (not chaptertitle)
//           chapterContent: [],
//           collapsed: false,
//           chapterOrder:
//             lastChapterOrder + 1,
//         };
//         setChapters([...chapters, newChapter]);
//       }
//     } else if (action === "remove") {
//       setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
//     } else if (action === "toggle") {
//       setChapters(
//         chapters.map((chapter) =>
//           chapter.chapterId === chapterId
//             ? { ...chapter, collapsed: !chapter.collapsed }
//             : chapter
//         )
//       );
//     }
//   };

//   const handleLecture = (action, chapterId, lectureIndex) => {
//     if (action === "add") {
//       setCurrentChapterId(chapterId);
//       setShowPopup(true);
//     } else if (action === "remove") {
//       setChapters(
//         chapters.map((chapter) => {
//           if (chapter.chapterId === chapterId) {
//             const next = [...chapter.chapterContent];
//             next.splice(lectureIndex, 1);
//             return { ...chapter, chapterContent: next };
//           }
//           return chapter;
//         })
//       );
//     }
//   };

//   const addLecture = () => {
//     setChapters(
//       chapters.map((chapter) => {
//         if (chapter.chapterId === currentChapterId) {
//           const last =
//             chapter.chapterContent.length > 0
//               ? chapter.chapterContent.slice(-1)[0].lectureOrder || 0 // fixed: lectureOrder
//               : 0;

//           const newLecture = {
//             ...lectureDetails,
//             lectureOrder: last + 1, // fixed property name
//             lectureId: nanoid(),
//           };

//           return {
//             ...chapter,
//             chapterContent: [...chapter.chapterContent, newLecture],
//           };
//         }
//         return chapter;
//       })
//     );
//     setShowPopup(false);
//     setLectureDetails({
//       lectureTitle: "",
//       lectureDuration: "",
//       lectureUrl: "",
//       isPreviewFree: false,
//     });
//   };

//   const handleSubmit = async (e) => {
//     try {
//       e.preventDefault();
//       if(!image){
//         toast.error('Thumbnail Not Selected')
//       }

//       const courseData={
//         courseTitle,
//         courseDescription: quillRef.current.root.innerHTML,
//         coursePrice:Number(coursePrice),
//         discount:Number(discount),
//         courseContent:chapters,
//       }

//       const formData = new FormData()
// formData.append('courseData',JSON.stringify(courseData))
// formData.append('image',image)

// const token=await getToken()
// const {data}= await axios.post(backendUrl + '/api/educator/add-course',formData,{headers:{Authorization:`Bearer ${token}`}})

// if(data.success){
//   toast.success(data.message)
//   setCourseTitle('')
//   setCoursePrice(0)
//   setDiscount(0)
//   setImage(null)
//   setChapters([])
//   quillRef.current.root.innerHTML=""
// }else{
//   toast.error(data.message)
// }
//     } catch (error) {
//       toast.error(error.message)
      
//     }
    

//     // TODO: collect editor content and submit
//   };

//   useEffect(() => {
//     if (!quillRef.current && editorRef.current) {
//       quillRef.current = new Quill(editorRef.current, {
//         theme: "snow",
//       });
//     }
//   }, []);

//   return (
//     <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-4 max-w-md w-full text-gray-500"
//       >
//         <div className="flex flex-col gap-1">
//           <p>Course Title</p>
//           {/* value should never be null -> keep it as "" string */}
//           <input
//             onChange={(e) => setCourseTitle(e.target.value)}
//             value={courseTitle}
//             type="text"
//             placeholder="Type here"
//             className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500 "
//             required
//           />
//         </div>

//         <div className="flex flex-col gap-1">
//           <p>Course Description</p>
//           <div ref={editorRef}></div>
//         </div>

//         <div className="flex items-center justify-between flex-wrap">
//           <div className="flex flex-col gap-1">
//             <p>Course Price</p>
//             <input
//               onChange={(e) => setCoursePrice(Number(e.target.value))}
//               value={coursePrice}
//               type="number"
//               placeholder="0"
//               className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
//               required
//               min={0}
//             />
//           </div>

//           <div className="flex md:flex-row flex-col items-center gap-3">
//             <p>Course Thumbnail</p>
//             <label htmlFor="thumbnailImage" className="flex items-center gap-3">
//               <img
//                 src={assets.file_upload_icon}
//                 alt=""
//                 className="p-3 bg-blue-500 rounded"
//               />
//               {/* fixed id spelling & preview handling */}
//               <input
//                 type="file"
//                 id="thumbnailImage"
//                 onChange={(e) => setImage(e.target.files?.[0] || null)}
//                 accept="image/*"
//                 hidden
//               />
//               {/* Render preview only when we have a URL; never pass "" to src */}
//               {previewUrl && (
//                 <img
//                   className="max-h-10"
//                   src={previewUrl}
//                   alt="Course thumbnail preview"
//                 />
//               )}
//             </label>
//           </div>
//         </div>

//         <div className="flex flex-col gap-1">
//           <p>Discount %</p>
//           <input
//             onChange={(e) => setDiscount(Number(e.target.value))}
//             value={discount}
//             type="number"
//             placeholder="0"
//             min={0}
//             max={100}
//             className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
//             required
//           />
//         </div>

//         {/* Adding Chapters & lectures */}
//         <div>
//           {chapters.map((chapter, chapterIndex) => (
//             <div key={chapter.chapterId} className="bg-white border rounded-lg mb-4">
//               <div className="flex justify-between items-center p-4 border-b">
//                 <div className="flex items-center">
//                   <img
//                     onClick={() => handleChapter("toggle", chapter.chapterId)}
//                     src={assets.dropdown_icon}
//                     width={14}
//                     alt=""
//                     className={`mr-2 cursor-pointer transition-all ${
//                       chapter.collapsed && "-rotate-90"
//                     }`}
//                   />
//                   <span className="font-semibold">
//                     {chapterIndex + 1}. {chapter.ChapterTitle}
//                   </span>
//                 </div>

//                 <span className="text-gray-500">
//                   {chapter.chapterContent.length} Lectures
//                 </span>

//                 {/* fixed: chapterId (not chapterid) */}
//                 <img
//                   onClick={() => handleChapter("remove", chapter.chapterId)}
//                   src={assets.cross_icon}
//                   alt=""
//                   className="cursor-pointer"
//                 />
//               </div>

//               {!chapter.collapsed && (
//                 <div className="p-4">
//                   {chapter.chapterContent.map((lecture, lectureIndex) => (
//                     <div
//                       key={lecture.lectureId}
//                       className="flex justify-between items-center mb-2"
//                     >
//                       <span>
//                         {lectureIndex + 1}. {lecture.lectureTitle} -{" "}
//                         {lecture.lectureDuration} mins -{" "}
//                         <a
//                           href={lecture.lectureUrl}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="text-blue-500"
//                         >
//                           Link
//                         </a>{" "}
//                         - {lecture.isPreviewFree ? "Free Preview" : "Paid"}
//                       </span>
//                       <img
//                         src={assets.cross_icon}
//                         alt=""
//                         onClick={() =>
//                           handleLecture("remove", chapter.chapterId, lectureIndex)
//                         }
//                         className="cursor-pointer"
//                       />
//                     </div>
//                   ))}
//                   <div
//                     className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2"
//                     onClick={() => handleLecture("add", chapter.chapterId)}
//                   >
//                     + Add Lecture
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}

//           <div
//             className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer"
//             onClick={() => handleChapter("add")}
//           >
//             + Add Chapter
//           </div>

//           {showPopup && (
//             <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//               <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80">
//                 <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

//                 <div className="mb-2">
//                   <p>Lecture Title</p>
//                   <input
//                     type="text"
//                     className="mt-1 block w-full border rounded py-1 px-2"
//                     value={lectureDetails.lectureTitle}
//                     onChange={(e) =>
//                       setLectureDetails({
//                         ...lectureDetails,
//                         lectureTitle: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="mb-2">
//                   <p>Duration (minutes)</p>
//                   <input
//                     type="number"
//                     className="mt-1 block w-full border rounded py-1 px-2"
//                     value={lectureDetails.lectureDuration}
//                     onChange={(e) =>
//                       setLectureDetails({
//                         ...lectureDetails,
//                         lectureDuration: e.target.value, // fixed: was setting lectureUrl
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="mb-2">
//                   <p>Video URL</p>
//                   <input
//                     type="url"
//                     className="mt-1 block w-full border rounded py-1 px-2"
//                     value={lectureDetails.lectureUrl}
//                     onChange={(e) =>
//                       setLectureDetails({
//                         ...lectureDetails,
//                         lectureUrl: e.target.value,
//                       })
//                     }
//                     placeholder="https://..."
//                   />
//                 </div>

//                 <div className="flex gap-2 my-4">
//                   <p>Is Preview Free?</p>
//                   <input
//                     type="checkbox"
//                     className="mt-1 scale-125"
//                     checked={lectureDetails.isPreviewFree}
//                     onChange={(e) =>
//                       setLectureDetails({
//                         ...lectureDetails,
//                         isPreviewFree: e.target.checked,
//                       })
//                     }
//                   />
//                 </div>

//                 <button
//                   type="button"
//                   className="w-full bg-blue-400 text-white px-4 py-2 rounded"
//                   onClick={addLecture}
//                 >
//                   Add
//                 </button>

//                 <img
//                   onClick={() => setShowPopup(false)}
//                   src={assets.cross_icon}
//                   className="absolute top-4 right-4 w-4 cursor-pointer"
//                   alt=""
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="bg-black text-white w-max py-2.5 px-8 rounded my-4"
//         >
//           ADD
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddCourse;


import React, { useContext, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid/non-secure";
import Quill from "quill";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        let lastChapterOrder = 0;
        if (chapters.length > 0) {
          lastChapterOrder = chapters[chapters.length - 1].chapterOrder;
        }

        const newChapter = {
          chapterId: nanoid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: lastChapterOrder + 1,
        };

        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters((prev) =>
        prev.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            const updatedContent = [...chapter.chapterContent];
            updatedContent.splice(lectureIndex, 1);
            return { ...chapter, chapterContent: updatedContent };
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    setChapters((prev) =>
      prev.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          let lastLectureOrder = 0;
          if (chapter.chapterContent.length > 0) {
            lastLectureOrder =
              chapter.chapterContent[chapter.chapterContent.length - 1].lectureOrder || 0;
          }

          const newLecture = {
            ...lectureDetails,
            lectureId: nanoid(),
            lectureOrder: lastLectureOrder + 1,
          };

          const updatedContent = [...chapter.chapterContent, newLecture];
          return { ...chapter, chapterContent: updatedContent };
        }
        return chapter;
      })
    );

    setShowPopup(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!image) {
        toast.error("Thumbnail Not Selected");
        return;
      }

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      formData.append("image", image);

      const token = await getToken();
      const { data } = await axios.post(backendUrl + "/api/educator/add-course", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        setCourseTitle("");
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full text-gray-500">
        <div className="flex flex-col gap-1">
          <p>Course Title</p>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <p>Course Description</p>
          <div ref={editorRef}></div>
        </div>

        <div className="flex items-center justify-between flex-wrap">
          <div className="flex flex-col gap-1">
            <p>Course Price</p>
            <input
              onChange={(e) => setCoursePrice(Number(e.target.value))}
              value={coursePrice}
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
              required
              min={0}
            />
          </div>

          <div className="flex md:flex-row flex-col items-center gap-3">
            <p>Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className="flex items-center gap-3">
              <img src={assets.file_upload_icon} alt="" className="p-3 bg-blue-500 rounded" />
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                accept="image/*"
                hidden
              />
              {previewUrl && <img className="max-h-10" src={previewUrl} alt="Course thumbnail preview" />}
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p>Discount %</p>
          <input
            onChange={(e) => setDiscount(Number(e.target.value))}
            value={discount}
            type="number"
            placeholder="0"
            min={0}
            max={100}
            className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
            required
          />
        </div>

        {/* Chapters & Lectures */}
        <div>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapter.chapterId} className="bg-white border rounded-lg mb-4">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center">
                  <img
                    onClick={() => handleChapter("toggle", chapter.chapterId)}
                    src={assets.dropdown_icon}
                    width={14}
                    alt=""
                    className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && "-rotate-90"}`}
                  />
                  <span className="font-semibold">
                    {chapterIndex + 1}. {chapter.chapterTitle}
                  </span>
                </div>

                <span className="text-gray-500">{chapter.chapterContent.length} Lectures</span>

                <img
                  onClick={() => handleChapter("remove", chapter.chapterId)}
                  src={assets.cross_icon}
                  alt=""
                  className="cursor-pointer"
                />
              </div>

              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lecture.lectureId} className="flex justify-between items-center mb-2">
                      <span>
                        {lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins -{" "}
                        <a href={lecture.lectureUrl} target="_blank" rel="noreferrer" className="text-blue-500">
                          Link
                        </a>{" "}
                        - {lecture.isPreviewFree ? "Free Preview" : "Paid"}
                      </span>
                      <img
                        src={assets.cross_icon}
                        alt=""
                        onClick={() => handleLecture("remove", chapter.chapterId, lectureIndex)}
                        className="cursor-pointer"
                      />
                    </div>
                  ))}

                  <div
                    className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2"
                    onClick={() => handleLecture("add", chapter.chapterId)}
                  >
                    + Add Lecture
                  </div>
                </div>
              )}
            </div>
          ))}

          <div
            className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer"
            onClick={() => handleChapter("add")}
          >
            + Add Chapter
          </div>

          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80">
                <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

                <div className="mb-2">
                  <p>Lecture Title</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border rounded py-1 px-2"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) =>
                      setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })
                    }
                  />
                </div>

                <div className="mb-2">
                  <p>Duration (minutes)</p>
                  <input
                    type="number"
                    className="mt-1 block w-full border rounded py-1 px-2"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) =>
                      setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })
                    }
                  />
                </div>

                <div className="mb-2">
                  <p>Video URL</p>
                  <input
                    type="url"
                    className="mt-1 block w-full border rounded py-1 px-2"
                    value={lectureDetails.lectureUrl}
                    onChange={(e) =>
                      setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="flex gap-2 my-4">
                  <p>Is Preview Free?</p>
                  <input
                    type="checkbox"
                    className="mt-1 scale-125"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) =>
                      setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })
                    }
                  />
                </div>

                <button type="button" className="w-full bg-blue-400 text-white px-4 py-2 rounded" onClick={addLecture}>
                  Add
                </button>

                <img
                  onClick={() => setShowPopup(false)}
                  src={assets.cross_icon}
                  className="absolute top-4 right-4 w-4 cursor-pointer"
                  alt=""
                />
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="bg-black text-white w-max py-2.5 px-8 rounded my-4">
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddCourse;

