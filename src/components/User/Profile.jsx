import React, { useEffect } from 'react'
import addScript from '../../hooks/addScripts';
import Side from '../../layout/layout-user/Side'

const Profile = () => {
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
    <div id="layoutSidenav">
    <Side/>
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4" id="thongtin">
          <h1 className="mt-4">Thông tin tài khoản</h1>
          <div className="card mb-4">
            <div className="card-body" style={{textAlign:'center'}}>
              <table style={{borderCollapse:'separate',borderSpacing:'0 10px'}}>
              <thead></thead>
              <tbody>
                <tr style={{textAlign:'right'}}>
                 
                  <th style={{width:'150px',paddingRight:'15px'}}>Ảnh đại diện:</th>
                  <td style={{width:'150px',textAlign:'center'}}><img src="images/download (1).jpg"/></td>
                  <td><div>
                    <label htmlFor="files" className="btn btn-primary">Chọn ảnh</label>
                    <input id="files" type="file"/>
                  </div></td>
                </tr>
                </tbody>
                <tfoot></tfoot>
                {/* <tr style={{textAlign:'right'}}>
                  <th style="width: 150px; padding-right: 15px;">Tên đăng nhập:</th>
                  <td style="width: 150px; text-align: center;">User</td>
                </tr>
                <tr style="text-align: right;">
                  <th style="width: 150px; padding-right: 15px;">Mật khẩu:</th>
                  <td style="width: 150px; text-align: center;">*******</td>
                </tr>
                <tr style="text-align: right;">
                  <th style="width: 150px; padding-right: 15px;">Email:</th>
                  <td style="width: 150px; text-align: center;">User@gmail.com</td>
                </tr>
                <tr style="text-align: right;">
                  <th style="width: 150px; padding-right: 15px;">SĐT:</th>
                  <td style="width: 150px; text-align: center;">012345789</td>
                </tr> */}
               
              </table>
            </div>
          </div>
        </div>
       
      </main>
    </div>
  </div>
  

    </>
  )
}

export default Profile