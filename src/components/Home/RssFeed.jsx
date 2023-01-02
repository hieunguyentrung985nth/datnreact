// import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom';
// import Parser from 'rss-parser'
// import addScript from '../../hooks/addScripts';
// import Banner from "../../layout/banner/Banner";
// import Hot from "../../layout/hot/Hot";
// import PopularList from '../../layout/popular-list/PopularList';
// import { transDate } from '../../utils/Pipe';
// import ReactPaginate from 'react-paginate';
// import './boostrap.css'

// const RssFeed = () => {
//     const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
//   const [postList, setPostList] = useState([]);

//   useEffect(() => {
//     const handle = async()=>{
//       // eslint-disable-next-line
//       const parser = new Parser({
//         customFields: {
//           item: [["enclosure", { keepArray: true }]],
//         },
//       });
//       const feed = await parser.parseURL(CORS_PROXY + 'https://thanhnien.vn/rss/cong-nghe-game/game-moi-568.rss');
//       setPostList(feed.items);
//       console.log(feed.items);
//     }
  
//     handle();
//   },[])

//   useEffect(() => {
//     addScript("../../assets/jquery-3.6.0.min.js");
//     //addScript("../../assets/bootstrap-5.1.3-dist/js/bootstrap.bundle.min.js");
//     addScript("../../assets/js/modernizr-3.5.0.min.js");
//     addScript("../../assets/js/owl.carousel.min.js");
//     addScript("../../assets/js/jquery.waypoints.min.js");
//     addScript("../../assets/js/main.js");
//   }, []);
  
//   return (
//     <>
//     <Banner />
//     <Hot />
//     <div className="container-fluid pb-4 pt-4 paddding">
//       <div className="container paddding">
//         <div className="row mx-0">
//           <div
//             className="col-md-8 animate-box"
//             data-animate-effect="fadeInLeft"
//           >
//             <div>
//               <div className="fh5co_heading fh5co_heading_border_bottom py-2 mb-4">
//                 Tin mới
//               </div>
//             </div>
//             <PaginatedItems itemsPerPage={4} />
//           </div>
//           <div
//             className="col-md-4 animate-box"
//             data-animate-effect="fadeInRight"
//           >
//             <PopularList />
//           </div>
//         </div>
//         <div className="row mx-0 animate-box" data-animate-effect="fadeInUp">
//           {/* <Paginate pager={pager} handlePageChange={handlePageChange} /> */}
         
//         </div>
//       </div>
//     </div>
//   </>
//   )
//   function Items({ currentItems }) {
//     return (
//       <div className="items">
//       {currentItems && currentItems.map((item) => (
//         <div key={item.guid} className="row pb-4">
//         <div className="col-md-5">
//           <div className="fh5co_hover_news_img">
//             <div className="fh5co_news_img">
//               <img
//                 src={
//                   "https://thumbs.dreamstime.com/b/news-newspapers-folded-stacked-word-wooden-block-puzzle-dice-concept-newspaper-media-press-release-42301371.jpg"
//                 }
//                 alt=""
//               />
//             </div>
//             <div></div>
//           </div>
//         </div>
//         <div className="col-md-7 animate-box">
//           <a
//             href={item.link}
//             rel="noreferrer"
//             target="_blank"
//             className="fh5co_magna py-2"
//             style={{ display: "block" }}
//           >
//             {" "}
//             {item.title}{" "}
//           </a>{" "}
//           <a href="single.html" className="fh5co_mini_time py-3">
//             {transDate(item.isoDate)}
//             {/* <i className="fa fa-eye">&nbsp;{post.view}</i>{" "} */}
//           </a>
//           <div
//             className="fh5co_consectetur"
//             dangerouslySetInnerHTML={{ __html: item.contentSnippet }}
//           ></div>
//         </div>
//       </div>
//       ))}
      
//         </div>
//     );
//   }

//   function PaginatedItems({ itemsPerPage }) {
//     // Here we use item offsets; we could also use page offsets
//     // following the API or data you're working with.
//     const [itemOffset, setItemOffset] = useState(0);
  
//     // Simulate fetching items from another resources.
//     // (This could be items from props; or items loaded in a local state
//     // from an API endpoint with useEffect and useState)
//     const endOffset = itemOffset + itemsPerPage;
//     console.log(`Loading items from ${itemOffset} to ${endOffset}`);
//     const currentItems = postList.slice(itemOffset, endOffset);
//     console.log(currentItems);
//     const pageCount = Math.ceil(postList.length / itemsPerPage);
  
//     // Invoke when user click to request another page.
//     const handlePageClick = (event) => {
//       const newOffset = (event.selected * itemsPerPage) % postList.length;
//       console.log(
//         `User requested page number ${event.selected}, which is offset ${newOffset}`
//       );
//       setItemOffset(newOffset);
//     };
  
//     return (
//       <>
//       <Items currentItems={currentItems}/>
//         <ReactPaginate
//           breakLabel="..."
//           nextLabel="next >"
//           onPageChange={handlePageClick}
//           pageRangeDisplayed={5}
//           pageCount={pageCount}
//           previousLabel="< previous"
//           renderOnZeroPageCount={null}
//         />
//       </>
//     );
//   }
// }

// export default RssFeed