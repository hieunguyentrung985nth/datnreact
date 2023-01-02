import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ManagerApi from "../../Api/Manager/ManagerApi";
import StaffApi from "../../Api/Staff/StaffApi";
import Side from "../../layout/layout-user/Side";
import Paginate from "../../layout/paginate/Paginate";
import { MyUploadAdapter } from "../../utils/Adapter";
import { transDate } from "../../utils/Pipe";
import Validator from "hero-validate";
import $ from "jquery";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import AuthContext from "../../context/AuthProvider";
import AuthApi from "../../Api/Auth/Auth";
import AdminApi from "../../Api/Admin/AdminApi";
import addScript from "../../hooks/addScripts";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';import { Bar } from 'react-chartjs-2';

const ViewStaff = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );


  const navigate = useNavigate();
  const queryParams = new URLSearchParams();
  const [staffList, setStaffList] = useState([]);
  const [pager, setPager] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderOption, setOrderOption] = useState(
    searchParams.get("order") || "newest"
  );

  const checkStatus = (status) => {
    if (status === "pending") return "badge-warning";
    else if (status === "decline") return "badge-danger";
    return "badge-success";
  };
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const param = [];
  const handlePageChange = async (e, index) => {
    e.preventDefault();
    searchParams.set("page", index);
    setSearchParams(searchParams);
    //searchParams.set('page', index);
    setPage(index);
  };
  useEffect(() => {
    const fetch = async () => {
      const data = await AdminApi.getStaff(page);
      setStaffList(data.data.data);
      setPager(data.data.pager);
      console.log(data.data);
    };
    fetch();
  }, [page]);

  useEffect(() => {
    addScript("../../assets/bootstrap-5.1.3-dist/js/bootstrap.bundle.min.js");

  }, []);

  const changeOrderOption = (e) => {
    e.preventDefault();
    setOrderOption(e.target.value);
    searchParams.set("order", e.target.value);
    for (let entry of searchParams.entries()) {
      console.log(entry);
    }
    setSearchParams(searchParams);
    //searchParams.set('order', e.target.value);
  };

  const rules = {
    name: "required|min:2",
    address: "required|min:2",
    birthdate: "required|min:2",
    gender: "required|min:2",
    job: "required|min:1",
    phone: "required|min:1",
    email: "required|min:1",
    password: "required|min:1",
  };
  Validator.setLocale(Validator.languages.vi);
//   Validator.setMessages({
//     title: {
//       required: "Không được bỏ trống :name",
//       min: "Quá ngắn",
//     },
//   });
  const [staffForm, setStaffForm] = useState({
    name: "",
    address: "",
    birthdate: "",
    gender: "",
    job: "",
    phone: "",
    email: "",
    password: "",
  });

  

  const [isWatching, setIsWatching] = useState(false);
//   const openModalToWatch = (currentStaff) => {
//     //$('#exampleModal').modal('show');
//     setIsWatching(true);
//     console.log(currentStaff);
//     setStaffForm({
//       ...staffForm,
//       id: currentStaff.id,
//       name: currentStaff.id,
//     address: "required|min:2",
//     birthdate: "required|min:2",
//     gender: "required|min:2",
//     job: "required|min:1",
//     phone: "required|min:1",
//     email: "required|min:2",
//     password: "required|min:2",
//     });
//     setPreview("https://localhost:44354/contents/" + currentPost.banner);
//     ckeditor1.current.setData(currentPost.description);
//     ckeditor2.current.setData(currentPost.content);
//   };

  // console.log(postForm);

  const [touched, setTouched] = useState({
    title: false,
    description: false,
    content: false,
    slug: false,
    categoryids: false,
    banner: false,
  });

  const [errors, setErrors] = useState(Validator.getEmpty());

  const hasErr = (name) => {
    //console.log(errors);
    return touched[name] && errors.isError(name);
  };

  const handleChange = (event) => {
    //event.persist();
    setTouched({ ...touched, [event.target.name]: true });
    setStaffForm({ ...staffForm, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    setErrors(Validator.validate(staffForm, rules));
  }, [staffForm]);

//   

  const submit = (e) => {
    e.preventDefault();
    console.log(staffForm);
    AdminApi.addStaff(staffForm).then(async (res) => {
      console.log(res);    
      alert("Thêm thành công");
      const ef = document.getElementById("cancel");
      ef?.click();
      const data = await AdminApi.getStaff(page);
      setStaffList(data.data.data);
      setPager(data.data.pager);
    });
  };


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Biểu đồ số bài viết của các nhân viên',
      },
    },
  };
  const [stat, setStat] = useState([])
  useEffect(()=>{
    const fetch = async()=>{
      const data = await AdminApi.statistical();
      setStat(data.data);
    }
    fetch();
  },[])

  const labels = stat.map(s=>s.name);

  const data = {
    labels,
    datasets:[
      {
        label:'Số bài viết',
        data: stat.map(s=>s.count),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  }

  return (
    <>
      <div id="layoutSidenav">
        <Side />
        <div id="layoutSidenav_content">
          <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý nhân viên</h1>
            <div className="card mb-4" style={{ width: "100%" }}>
              <div
                className="modal fade"
                id="exampleModal"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-lg" role="document">
                  <div className="modal-content" id="row_style">
                    <div className="modal-header">
                      <h5 className="modal-title" id="modalTitle">
                        Quản lý nhân viên
                      </h5>
                      <button
                        type="button"
                        id="cancel"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <form>
                        <fieldset>                       
                          <div className="form-group">
                            <label for="">Tên nhân viên</label>
                            <input
                              formControlName="title"
                              type="text"
                              name="name"
                              className="form-control"
                              placeholder="Tiêu đề"
                              value={staffForm.name}
                              onChange={handleChange}
                            />
                            {hasErr("name") && (
                              <div style={{ color: "red" }} role="alert">
                                <span className="text-danger">
                                  {errors.getError("name")}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="form-group mt-3">
                            <label for="">Địa chỉ</label>
                            <input
                              id="currentdate"
                              name="address"
                              value={staffForm.createdAt}
                              onChange={handleChange}
                              type="text"
                              readonly
                              className="form-control"
                            />
                            {hasErr("address") && (
                              <div style={{ color: "red" }} role="alert">
                                <span className="text-danger">
                                  {errors.getError("address")}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="form-group mt-3">
                            <label for="">Ngày sinh</label>
                            <input
                              name="birthdate"
                              value={staffForm.birthdate}
                              onChange={handleChange}
                              type="date"
                              className="form-control"
                              placeholder="metatitle"
                              required
                            />
                            {hasErr("birthdate") && (
                              <div style={{ color: "red" }} role="alert">
                                <span className="text-danger">
                                  {errors.getError("birthdate")}
                                </span>
                              </div>
                            )}
                          </div>                      

                          <div className="form-group mt-3">
                            <label for="">Giới tính</label>
                            <select value={staffForm.gender} onChange={handleChange} name="gender" id="">
                                <option value="nam">Nam</option>
                                <option value="nữ">Nữ</option>
                            </select>
                            {hasErr("gender") && (
                              <div style={{ color: "red" }} role="alert">
                                <span className="text-danger">
                                  {errors.getError("gender")}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="form-group mt-3">
                            <label for="">Email</label>
                            <input
                              id="currentdate"
                              name="email"
                              value={staffForm.email}
                              onChange={handleChange}
                              type="email"
                              readonly
                              className="form-control"
                            />
                            {hasErr("email") && (
                              <div style={{ color: "red" }} role="alert">
                                <span className="text-danger">
                                  {errors.getError("email")}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="form-group mt-3">
                            <label for="">Mật khẩu</label>
                            <input
                              id="currentdate"
                              name="password"
                              value={staffForm.password}
                              onChange={handleChange}
                              type="password"
                              readonly
                              className="form-control"
                            />
                            {hasErr("password") && (
                              <div style={{ color: "red" }} role="alert">
                                <span className="text-danger">
                                  {errors.getError("password")}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="form-group mt-3">
                            <label for="">SĐT</label>
                            <input
                              id="currentdate"
                              name="phone"
                              value={staffForm.phone}
                              onChange={handleChange}
                              type="tel"
                              readonly
                              className="form-control"
                            />
                            {hasErr("phone") && (
                              <div style={{ color: "red" }} role="alert">
                                <span className="text-danger">
                                  {errors.getError("phone")}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="form-group mt-3">
                            <label for="">Chức vụ</label>
                            <select value={staffForm.job} onChange={handleChange} name="job" id="">
                                <option value="Staff">Nhân viên</option>
                                <option value="Manager">Quản lý</option>
                            </select>
                            {hasErr("job") && (
                              <div style={{ color: "red" }} role="alert">
                                <span className="text-danger">
                                  {errors.getError("job")}
                                </span>
                              </div>
                            )}
                          </div>
                        </fieldset>
                      </form>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        ng-click="closeModal()"
                      >
                        Đóng
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        id="addbtn"
                        onClick={submit}
                        disabled={errors.hasError ? true : false}
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="modal fade"
                id="Modal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
               
              </div>
           
              <div className="card-body" style={{ backgroundColor: "white" }}>
              <button
                  type="button"
                  class="btn btn-primary"
                  data-toggle="modal"
                  data-target="#exampleModal"
                >
                  <i class="fa fa-plus">
                    <span>ADD</span>
                  </i>
                </button>
                <table
                  className="table table-bordered"
                  style={{ verticalAligh: "middle", textAlign: "center" }}
                  id="posts"
                >
                  <thead>
                    <tr>
                    <th scope="col">STT</th>
                                <th scope="col">Tên nhân viên</th>
                                <th scope="col">Địa chỉ</th>
                                <th scope="col">Giới tính</th>
                                <th scope="col">Ngày sinh</th>
                                <th scope="col">Email</th>
                                <th scope="col">Chức vụ</th>
                                <th scope="col">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody id="tableposts">
                    {staffList.map((staff, i) => (
                      <tr key={staff.staff.id}>
                        <td scope="row">
                          {(pager.currentPage - 1) * pager.pageSize + i + 1}{" "}
                        </td>
                        <td>{ staff.staff.name }</td>
                        <td>{ staff.staff.address }</td>
                                <td>{ staff.staff.gender }</td>
                                <td>{ transDate(staff.staff.birthdate)}</td>
                                <td>{ staff.staff.user.email }</td>
                                <td>{ staff.role.role1 }</td>
                                <th scope="col"><button class="btn btn-primary" ng-click="showStaff(staff.id)">Sửa</button><button class="btn btn-danger" ng-click="deleteStaff(staff.id)">Xóa</button></th>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="row">
                  <Paginate pager={pager} handlePageChange={handlePageChange} />
                </div>
              </div>
             
            </div>
          </div>
          <Bar options={options} data={data}/>
        </div>
       
      </div>
     
    </>
  );
};

export default ViewStaff;
