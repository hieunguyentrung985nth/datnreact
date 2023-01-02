import React, {useState, useEffect} from 'react'
import HomeApi from '../../Api/Home/HomeApi';
import HomeService from '../../services/HomeService';
import IMAGES from '../../utils/LocalImages'
import { hideText, transDate } from '../../utils/Pipe';

const Banner = () => {
    const [bannerPosts, setBannerPosts] = useState([]);
    const [firstPost, setFirstPost] = useState(null)
    useEffect(()=>{
        const fetchList = async()=>{
            const res = await HomeApi.getFivePosts();
            console.log(res.data);
            setBannerPosts(res.data.data);
            setFirstPost(res.data.first);
        }
        fetchList();
    },[])
  return (
   <>
<div className="container-fluid paddding mb-5">
    <div className="row mx-0">
        <div className="col-md-6 col-12 paddding animate-box" data-animate-effect="fadeIn">
            <div className="fh5co_suceefh5co_height"><img src={firstPost && 'https://localhost:44354/contents/'+firstPost?.banner} alt="img"/>
                <div className="fh5co_suceefh5co_height_position_absolute"></div>
                <div className="fh5co_suceefh5co_height_position_absolute_font">
                    <div className=""><a href="#" className="color_fff"> <i className="fa fa-clock"></i>&nbsp;&nbsp;{transDate(firstPost?.createdAt)} - <i className='fa fa-eye'>{firstPost?.view}</i>
                    </a></div>
                    <div className=""><a href="single.html" className="fh5co_good_font"> {firstPost && hideText(firstPost?.title, 80)} </a></div>
                </div>
            </div>
        </div>
        <div className="col-md-6">
            <div className="row">
                {bannerPosts.map((post)=>(
                    <div key={post.id} className="col-md-6 col-6 paddding animate-box" data-animate-effect="fadeIn">
                    <div className="fh5co_suceefh5co_height_2"><img src={'https://localhost:44354/contents/'+post.banner} alt="img"/>
                        <div className="fh5co_suceefh5co_height_position_absolute"></div>
                        <div className="fh5co_suceefh5co_height_position_absolute_font_2">
                            <div className=""><a href="#" className="color_fff"> <i className="fa fa-clock"></i>&nbsp;&nbsp;{transDate(post.createdAt)} - <i className='fa fa-eye'>{post.view}</i> </a></div>
                            <div className=""><a href="single.html" className="fh5co_good_font_2">{hideText(post.title,50)} </a></div>
                        </div>
                    </div>
                </div>
                ))}
              
            </div>
        </div>
    </div>
</div>
     </>
  )
}

export default Banner