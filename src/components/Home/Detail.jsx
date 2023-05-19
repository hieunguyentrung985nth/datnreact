import React, { useEffect } from "react";
import PopularList from "../../layout/popular-list/PopularList";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import HomeApi from "../../Api/Home/HomeApi";
import { transDate } from "../../utils/Pipe";
import useScript from "../../hooks/addScripts";
import addScript from "../../hooks/addScripts";
import { Link } from "react-router-dom";

const Detail = () => {
  // useScript('../../assets/jquery-3.6.0.min.js');
  // useScript('../../assets/js/modernizr-3.5.0.min.js');
  // useScript('../../assets/js/owl.carousel.min.js');
  // useScript('../../assets/bootstrap-5.1.3-dist/js/bootstrap.bundle.min.js');
  // useScript('../../assets/js/jquery.waypoints.min.js');
  // useScript('../../assets/js/main.js');
  const [searchParams, setSearchParams] = useSearchParams();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [mainPost, setMainPost] = useState(null);
  const [pager, setPager] = useState(null);
  const [page, setPage] = useState(1);
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    console.log(slug);

    const fetchList = async () => {
      const res = await HomeApi.getDetail(slug);
      setMainPost(res.data.data.p);
      setPostList([]);
      setPager(null);
      console.log(res.data.data.p);
      window.scrollTo(0, 0);
    };
    fetchList();
  }, [slug]);

  useEffect(() => {
    const fetchList = async () => {
      document.body.style.backgroundImage = "";
      const res = await HomeApi.morePost(mainPost.categories[0].id, page);
      setPostList((prev) => [...prev, res.data.data[0]]);
      setPager(res.data.pager);
      console.log(res.data);
    };
    fetchList();
  }, [mainPost, page]);

  const increasePage = ()=>{
    if(pager.currentPage !== pager.totalPages){
      setPage(page + 1);
    }
    else{
      return;
    }
  }


  useEffect(() => {
    addScript("../../assets/jquery-3.6.0.min.js");
    addScript("../../assets/js/modernizr-3.5.0.min.js");
    addScript("../../assets/js/owl.carousel.min.js");
    addScript("../../assets/bootstrap-5.1.3-dist/js/bootstrap.bundle.min.js");
    addScript("../../assets/js/jquery.waypoints.min.js");
    addScript("../../assets/js/main.js");
  }, []);

  return (
    <>
      {mainPost && (
        <div>
          <div
            id="fh5co-title-box"
            style={{
              backgroundImage: `url('https://localhost:44354/contents/${mainPost?.banner}')`,
              posotion: "relative",
              height: "700px",
              width: "100%",
            }}
            data-stellar-background-ratio="0.5"
          >
            {/* <div className="overlay"></div> */}
            <div
              className="page-title"
              style={{ width: "100%", margin: "0 auto", textAlign: "center" }}
            >
              <span>
                {transDate(mainPost?.createdAt)} - <i className="fa fa-eye"></i>{" "}
                {mainPost?.view}{" "}
              </span>
              <h2
                style={{
                  fontFamily:
                    "Cambria, Cochin, Georgia, Times, Times New Roman, serif",
                }}
              >
                {" "}
                {mainPost?.title}{" "}
              </h2>
            </div>
          </div>
          <div
            id="fh5co-single-content"
            className="container-fluid pb-4 pt-4 paddding"
            style={{ fontFamily: "Times New Roman, Times, serif" }}
          >
            <div className="container paddding">
              <div className="row mx-0">
                <div
                  className="col-md-8 animate-box"
                  data-animate-effect="fadeInLeft"
                >
                  <span
                    dangerouslySetInnerHTML={{ __html: mainPost?.content }}
                  ></span>
                  <br />
                  <i>Tác giả: {mainPost?.authorNavigation.staff[0].name} </i>
                </div>
                <div
                  className="col-md-4 animate-box"
                  data-animate-effect="fadeInRight"
                  ng-init="getPostsLastWeeks()"
                >
                  <PopularList />
                </div>
                <div
                  className="animate-box"
                  data-animate-effect="fadeInRight"
                ></div>
              </div>
            </div>
          </div>
          <div className="container" data-animate-effect="fadeIn" id="lq">
            <h2>Tin liên quan</h2>
            {postList && postList.map((post, index)=>(
 <div key={post?.id} className="row pb-4">
 <div className="col-md-5">
   <div className="fh5co_hover_news_img">
     <div className="fh5co_news_img">
       <img
         src={"https://localhost:44354/contents/" + post?.banner}
         alt=""
       />
     </div>
     <div></div>
   </div>
 </div>
 <div className="col-md-7">
 <Link
                        to={"/post/" + post?.slug}
                        className="fh5co_magna py-2"
                        style={{ display: "block" }}
                      >
                        {" "}
                        {post?.title}{" "}
                      </Link>{" "}
                      <a href="single.html" className="fh5co_mini_time py-3">
                        {transDate(post?.createdAt)} -{" "}
                        <i className="fa fa-eye">&nbsp;{post?.view}</i>{" "}
                      </a>
                      <div
                        className="fh5co_consectetur"
                        dangerouslySetInnerHTML={{ __html: post?.description }}
                      ></div>
 </div>
</div>
            ))}
           
            
            <div>
              <button onClick={increasePage} ng-show="!loading" id="more" className="btn btn-link">
                Hiện thêm
              </button>
              <div ng-show="loading" className="loader"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Detail;
