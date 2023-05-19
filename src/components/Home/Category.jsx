import React, { useEffect } from "react";
import { useSearchParams, useNavigate, Link, useParams } from "react-router-dom";
import Banner from "../../layout/banner/Banner";
import Hot from "../../layout/hot/Hot";
import addScript from "../../hooks/addScripts";
import PopularList from "../../layout/popular-list/PopularList";
import IMAGES from "../../utils/LocalImages";
import { useState } from "react";
import HomeApi from "../../Api/Home/HomeApi";
import Paginate from "../../layout/paginate/Paginate";
import { transDate } from "../../utils/Pipe";


const Category = () => {
  //useScript('../../assets/js/main.js');
  const [postList, setPostList] = useState([]);
  const [pager, setPager] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const { slug } = useParams();
  const handlePageChange = async (e, index) => {
    e.preventDefault();
    searchParams.set("page",index);
    setSearchParams(searchParams);
    await setPage(index);
    console.log(index);

    //navigate(window.location.pathname)
  };

  useEffect(() => {
    const fetchList = async () => {
      document.body.style.backgroundImage = "";
      const res = await HomeApi.getCategoryPosts(slug,page);
      setPostList(res.data.data);
      setPager(res.data.pager);
      console.log(res.data);
    };
    fetchList();
  }, [page,slug]);
  useEffect(() => {
    addScript("../../assets/jquery-3.6.0.min.js");
    addScript("../../assets/bootstrap-5.1.3-dist/js/bootstrap.bundle.min.js");
    addScript("../../assets/js/modernizr-3.5.0.min.js");
    addScript("../../assets/js/owl.carousel.min.js");
    addScript("../../assets/js/jquery.waypoints.min.js");
    addScript("../../assets/js/main.js");
  }, []);
  return (
    <>
      <Banner />
      <Hot />
      <div className="container-fluid pb-4 pt-4 paddding">
        <div className="container paddding">
          <div className="row mx-0">
            <div
              className="col-md-8 animate-box"
              data-animate-effect="fadeInLeft"
            >
              <div>
                <div className="fh5co_heading fh5co_heading_border_bottom py-2 mb-4">
                  Tin tức
                </div>
              </div>
              {postList &&
                postList.map((post) => (
                  <div key={post.id} className="row pb-4">
                    <div className="col-md-5">
                      <div className="fh5co_hover_news_img">
                        <div className="fh5co_news_img">
                          <img
                            src={
                              "https://localhost:44354/contents/" + post.banner
                            }
                            alt=""
                          />
                        </div>
                        <div></div>
                      </div>
                    </div>
                    <div className="col-md-7 animate-box">
                      <Link
                        to={"/post/" + post.slug}
                        className="fh5co_magna py-2"
                        style={{ display: "block" }}
                      >
                        {" "}
                        {post.title}{" "}
                      </Link>{" "}
                      <a href="single.html" className="fh5co_mini_time py-3">
                        {transDate(post.createdAt)} -{" "}
                        <i className="fa fa-eye">&nbsp;{post.view}</i>{" "}
                      </a>
                      <div
                        className="fh5co_consectetur"
                        dangerouslySetInnerHTML={{ __html: post.description }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
            <div
              className="col-md-4 animate-box"
              data-animate-effect="fadeInRight"
            >
              <PopularList />
            </div>
          </div>
          <div className="row mx-0 animate-box" data-animate-effect="fadeInUp">
            <Paginate pager={pager} handlePageChange={handlePageChange} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;
