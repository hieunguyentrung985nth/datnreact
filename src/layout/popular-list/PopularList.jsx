import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import HomeApi from "../../Api/Home/HomeApi";
import IMAGES from "../../utils/LocalImages";
import { hideText, transDate } from "../../utils/Pipe";

const PopularList = () => {
    const [postList, setPostList] = useState([]);
    useEffect(()=>{
        const fetchList =async ()=>{
            const res = await HomeApi.getPopularPosts();
            setPostList(res.data.data);
        } 
        fetchList();
    },[])

  return (
    <>
      <div className="clearfix"></div>

      <div>
        <div className="fh5co_heading fh5co_heading_border_bottom pt-3 py-2 mb-4">
          Phổ biến
        </div>
      </div>
      {postList.map(post=>(
 <div key={post.id} className="row pb-3">
 <div className="col-5 align-self-center">
   <img
     src={'https://localhost:44354/contents/'+post.banner}
     alt="img"
     className="fh5co_most_trading"
   />
 </div>
 <div className="col-7 paddding">
   <div
     className="most_fh5co_treding_font"
     style={{
       fontFamily:
         "Cambria, Cochin, Georgia, Times, Times New Roman, serif",
     }}
   >
     <a href="single.html" style={{ color: "black" }}>
       {hideText(post.title, 40)}
     </a>
   </div>
   <div className="most_fh5co_treding_font_123">{transDate(post.createdAt)} - <i className="fa fa-eye">{post.view}</i></div>
 </div>
</div>
      ))}
     
    </>
  );
};

export default PopularList;
