import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeApi from "../../Api/Home/HomeApi";
import IMAGES from "../../utils/LocalImages";
import { hideText, transDate } from "../../utils/Pipe";

const Hot = () => {
  const [postList, setPostList] = useState([]);
  useEffect(() => {
    const fetchList = async () => {
      const res = await HomeApi.getPopularPosts();
      setPostList(res.data.data);
    };
    fetchList();
  },[]);
  return (
    <>
      <div className="container-fluid pt-3">
        <div className="container animate-box" data-animate-effect="fadeIn">
          <div>
            <div className="fh5co_heading fh5co_heading_border_bottom py-2 mb-4">
              Nổi bật
            </div>
          </div>
          <div className="owl-carousel owl-theme js" id="slider1">
            {postList.map((post) => (
              <div key={post.id} className="item px-2">
                <div className="fh5co_latest_trading_img_position_relative">
                  <div className="fh5co_latest_trading_img">
                    <img
                      src={'https://localhost:44354/contents/'+post.banner}
                      alt=""
                      className="fh5co_img_special_relative"
                    />
                  </div>
                  <div className="fh5co_latest_trading_img_position_absolute"></div>
                  <div className="fh5co_latest_trading_img_position_absolute_1">
                    <Link
                      to={'/post/'+post.slug}
                      className="text-white"
                      style={{
                        fontFamily:
                          " Cambria, Cochin, Georgia, Times, Times New Roman",
                        fontSize: "1.5rem",
                      }}
                    >
                      {hideText(post.title, 40)}
                    </Link>
                    <div className="fh5co_latest_trading_date_and_name_color">
                      {transDate(post.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

           
          </div>
        </div>
      </div>
    </>
  );
};

export default Hot;
