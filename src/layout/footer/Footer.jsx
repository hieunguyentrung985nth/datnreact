import React from 'react'

const Footer = () => {
  return (
    <>
    <div className="container-fluid fh5co_footer_bg pb-3">
    <div className="container animate-box">
        <div className="row">
            <div className="col-12 spdp_right py-5"><img src="/assets/images/white_logo.png" alt="img" className="footer_logo"/></div>
            <div className="clearfix"></div>
            <div className="col-12 col-md-4 col-lg-3">
                <div className="footer_main_title py-3"> About</div>
                <div className="footer_sub_about pb-3"> Đây là Lorem Ipsum is simply dummy text of the printing and typesetting
                    industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                    unknown printer took a galley of type and scrambled it to make a type specimen book.
                </div>
                <div className="footer_mediya_icon">
                    <div className="text-center d-inline-block"><a className="fh5co_display_table_footer">
                        <div className="fh5co_verticle_middle"><i className="fa fa-linkedin"></i></div>
                    </a></div>
                    <div className="text-center d-inline-block"><a className="fh5co_display_table_footer">
                        <div className="fh5co_verticle_middle"><i className="fa fa-google-plus"></i></div>
                    </a></div>
                    <div className="text-center d-inline-block"><a className="fh5co_display_table_footer">
                        <div className="fh5co_verticle_middle"><i className="fa fa-twitter"></i></div>
                    </a></div>
                    <div className="text-center d-inline-block"><a className="fh5co_display_table_footer">
                        <div className="fh5co_verticle_middle"><i className="fa fa-facebook"></i></div>
                    </a></div>
                </div>
            </div>      
            <div className="col-12 col-md-5 col-lg-3 position_footer_relative">             
            </div>
            <div className="col-12 col-md-12 col-lg-4 ">
                <div className="footer_main_title py-3"> Liên hệ: 19001999101</div>
                <div className="footer_main_title py-3"> Địa chỉ: xx phố ABCXYZ đường QWERTY Hà Nội</div>            
            </div>
        </div>    
    </div>
  </div>
  <div className="container-fluid fh5co_footer_right_reserved">
    <div className="container">
        <div className="row  ">
            <div className="col-12 col-md-6 py-4 Reserved"> ©Copyright 2018, All rights reserved. Design by ABCXYZ. </div>
            <div className="col-12 col-md-6 spdp_right py-4">
                <a href="/" className="footer_last_part_menu">Home</a>
                <a href="Contact_us.html" className="footer_last_part_menu">About</a>
                <a href="Contact_us.html" className="footer_last_part_menu">Contact</a>
                <a href="blog.html" className="footer_last_part_menu">Latest News</a></div>
        </div>
    </div>
  </div>
    </>
  )
}

export default Footer