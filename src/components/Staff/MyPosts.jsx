import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import StaffApi from "../../Api/Staff/StaffApi";
import Side from "../../layout/layout-user/Side";
import Paginate from "../../layout/paginate/Paginate";
import { transDate } from "../../utils/Pipe";
import "./style.css";
import $ from "jquery";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Validator from "hero-validate";
import { MyUploadAdapter } from "../../utils/Adapter";

const MyPosts = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams();
  const [postList, setPostList] = useState([]);
  const [post, setPost] = useState({
    id: "",
    title: "",
    createdAt: "",
    slug: "",
    banner: "",
    categoryids: [],
    description: "",
    content: "",
    feed: "",
  });

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
      const data = await StaffApi.getMyPosts(page);
      setPostList(data.data.data);
      setPager(data.data.pager);
      console.log(data.data.data);
    };
    fetch();
  }, [page]);

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

  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: e.target.value,
    });
  };


  const rules = {
    title: "required|min:2",
    description: "required|min:2",
    content: "required|min:2",
    slug: "required|min:2",
    categoryids: "required|min:1",
    banner: "required|min:1",
  };
  Validator.setLocale(Validator.languages.vi);
  Validator.setMessages({
    title: {
      required: "Không được bỏ trống :name",
      min: "Quá ngắn",
    },
  });
  const [postForm, setPostForm] = useState({
    title: "",
    description: "",
    content: "",
    slug: "",
    categoryids: [],
    banner: "",
    view: 0,
    feeds:[]
  });

  const [isWatching, setIsWatching] = useState(false);
  const openModalToWatch = (currentPost) => {
    //$('#exampleModal').modal('show');
    setIsWatching(true);
    console.log(currentPost);
    setPostForm({
      ...postForm,
      id: currentPost.id,
      title: currentPost.title,
      slug: currentPost.slug,
      createdAt: currentPost.createdAt,
      description: currentPost.description,
      content: currentPost.content,
      categoryids: currentPost.categories.map((c) => c.id),
      banner: currentPost.banner,
      feeds: currentPost.feeds
    });
    setPreview('https://localhost:44354/contents/' + currentPost.banner);
    ckeditor1.current.setData(currentPost.description);
    ckeditor2.current.setData(currentPost.content);
  };

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
    setPostForm({ ...postForm, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    setErrors(Validator.validate(postForm, rules));
  }, [postForm]);

  const handleEditor2 = (event, editor) => {
    const data = editor.getData();
    setTouched({ ...touched, content: true });
    setPostForm((prev) => {
      return { ...prev, content: data };
    });
  };
  const handleEditor1 = (event, editor) => {
    const data = editor.getData();
    setTouched({ ...touched, description: true });
    setPostForm((prev) => {
      return { ...prev, description: data };
    });
  };
  const handleCategoryids = (event) => {
    setTouched({ ...touched, categoryids: true });
    var options = event.target.options;
    var value = [];
    for (let index = 0; index < options.length; index++) {
      if (options[index].selected) value.push(options[index].value);
    }
    setPostForm((prev) => {
      return { ...prev, categoryids: value };
    });
  };
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  useEffect(() => {
    if (!selectedFile) {
      //setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
    const fileName = e.target.files[0].name;
    console.log(fileName);
    setTouched({ ...touched, banner: true });
    setPostForm({ ...postForm, banner: fileName });
  };
  const deleteImage = () => {
    setSelectedFile(undefined);
    setPreview(undefined);
    setPostForm({ ...postForm, banner: "" });
  };
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      let data = await StaffApi.getAllCategories();
      console.log(data.data);

      setCategories(data.data.data);
    };
    fetch();
  }, []);
  const submit =  (e) => {
    e.preventDefault();
    console.log(postForm);
    StaffApi.updatePost(postForm).then(async (res) => {
      console.log(res);
      if(selectedFile !== undefined){
        const formData = new FormData();
        formData.append('file',selectedFile);
        StaffApi.uploadImage(formData,res.data.id).then(data=>{
          
  
        })
      }
      alert('Sửa thành công');
      const ef = document.getElementById('cancel');
      ef?.click();
      const data = await StaffApi.getMyPosts(page);
      setPostList(data.data.data);
      setPager(data.data.pager);
    });
  };

  const deletePost = (id)=>{
    console.log(id);
  }

  const openModalToEdit = (currentPost)=>{
    setIsWatching(false);
    setSelectedFile(undefined);
    console.log(currentPost);
    setPostForm({
      ...postForm,
      id: currentPost.id,
      title: currentPost.title,
      slug: currentPost.slug,
      createdAt: currentPost.createdAt,
      description: currentPost.description,
      content: currentPost.content,
      categoryids: currentPost.categories.map((c) => c.id),
      banner: currentPost.banner,
      feeds: currentPost.feeds
    });
    setPreview('https://localhost:44354/contents/' + currentPost.banner);
    ckeditor1.current.setData(currentPost.description);
    ckeditor2.current.setData(currentPost.content);
  }


  const onReady = (editor) => {
    ckeditor2.current = editor;
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  };
  let ckeditor1 = useRef();
  let ckeditor2 = useRef();

  return (
    <>
      <div id="layoutSidenav">
        <Side />
        <div id="layoutSidenav_content">
          <div className="container-fluid px-4">
            <h1 className="mt-4">Bài viết của tôi</h1>
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
                        Quản lý bài viết
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
                        <fieldset disabled={isWatching ? true : false}>
                          {postForm?.feeds?.length > 0 && (
                            <div className="form-group">
                            <label for="">Lý do bị từ chối</label>
                            <textarea
                              rows="10"
                              cols="30"
                              type="text"
                              className="form-control"
                              readOnly
                              style={{ resize: "none" }}
                              value={postForm.feeds[0]?.content}
                            ></textarea>
                          </div>
                          )}
                          
                          <div className="form-group">
                            <label for="">Tiêu đề</label>
                            <input
                              formControlName="title"
                              type="text"
                              name="title"
                              className="form-control"
                              placeholder="Tiêu đề"
                              value={postForm.title}
                              onChange={handleChange}
                            />
                            {hasErr("title") && (
                              <div style={{ color: "red" }} role="alert">
                                <span className="text-danger">
                                  {errors.getError("title")}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="form-group mt-3">
                            <label for="">Ngày viết</label>
                            <input
                              id="currentdate"
                              name="createdAt"
                              value={transDate(postForm.createdAt)}
                              //onChange={onHandleChange}
                              type="text"
                              readonly
                              className="form-control"
                            />
                          </div>
                          <div className="form-group mt-3">
                            <label for="">Slug</label>
                            <input
                              name="slug"
                              value={postForm.slug}
                              onChange={handleChange}
                              type="text"
                              className="form-control"
                              placeholder="metatitle"
                              required
                            />
                            {hasErr("slug") && (
                              <div style={{ color: "red" }} role="alert">
                                <span className="text-danger">
                                  {errors.getError("slug")}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="form-group mt-3">
                            <label for="">Ảnh bài viết</label> <br />
                            {postForm && (
                              <img
                                alt=""
                                src={preview}
                                style={{ width: "480px", height: "360px" }}
                              />
                            )}
                            <label for="files" className="btn btn-primary">
                              Chọn ảnh
                            </label>
                            <input
                              onChange={onSelectFile}
                              accept="image/*"
                              className="form-control-file"
                              id="files"
                              style={{ visibility: "hidden" }}
                              type="file"
                              name="banner"
                            />
                            <button onClick={deleteImage} type="button">
                              Delete
                            </button>
                            {hasErr("banner") && (
                              <div style={{ color: "red" }} role="alert">
                                <span className="text-danger">
                                  {errors.getError("banner")}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="form-group mt-3">
                            <label for="">Chọn thể loại</label>
                            {categories && (
                              <select
                                name="categoryids"
                                value={postForm.categoryids}
                                onChange={handleCategoryids}
                                className="form-select"
                                aria-label="Default select example"
                                multiple={true}
                                style={{ height: "300px" }}
                              >
                                {categories?.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.title}{" "}
                                  </option>
                                ))}
                              </select>
                            )}
                            {hasErr("categoryids") && (
                              <div style={{ color: "red" }} role="alert">
                                <span className="text-danger">
                                  {errors.getError("categoryids")}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="form-group mt-3">
                            <label for="editor2">Mô tả</label>
                            <CKEditor
                              editor={ClassicEditor}
                              className="ck-content"
                              value={postForm.description}
                              onChange={handleEditor1}
                              onReady={(editor)=>{ckeditor1.current = editor}}
                              name="description"
                              ref={ckeditor1}
                              disabled={isWatching ? true : false}
                              
                            ></CKEditor>
                            {hasErr("description") && (
                              <div style={{ color: "red" }} role="alert">
                                <span className="text-danger">
                                  {errors.getError("description")}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="form-group mt-3">
                            <label for="editor1">Nội dung</label>
                            <CKEditor
                              editor={ClassicEditor}
                              className="ck-content"
                              value={postForm.content}
                              onChange={handleEditor2}
                              onReady={(editor)=>onReady(editor)}
                              name="content"
                              ref={ckeditor2}
                              disabled={isWatching ? true : false}
                            ></CKEditor>
                            {hasErr("content") && (
                              <div style={{ color: "red" }} role="alert">
                                <span className="text-danger">
                                  {errors.getError("content")}
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
                        Sửa
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <select
                  value={orderOption}
                  onChange={changeOrderOption}
                  name=""
                  id=""
                  className="form-select"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="mostviews">Xem nhiều nhất</option>
                  <option value="lessviews">Xem ít nhất</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="live">Đã duyệt</option>
                  <option value="decline">Từ chối</option>
                </select>
              </div>

              <div className="card-body" style={{ backgroundColor: "white" }}>
                <table
                  className="table table-bordered"
                  style={{ verticalAligh: "middle", textAlign: "center" }}
                  id="posts"
                >
                  <thead>
                    <tr>
                      <th scope="col">STT</th>
                      <th scope="col">Ảnh</th>
                      <th scope="col">Tiêu đề</th>
                      <th scope="col">Ngày viết</th>
                      <th scope="col">Lượt xem</th>
                      <th scope="col">Trạng thái</th>
                      <th scope="col">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody id="tableposts">
                    {postList.map((post, i) => (
                      <tr key={post.id}>
                        <td scope="row">
                          {(pager.currentPage - 1) * pager.pageSize + i + 1}{" "}
                        </td>
                        <td>
                          <img
                            width="240px"
                            height="160px"
                            src={
                              "https://localhost:44354/contents/" + post.banner
                            }
                            alt=""
                          />
                        </td>
                        <td
                          dangerouslySetInnerHTML={{ __html: post.title }}
                        ></td>
                        <td> {transDate(post.createdAt)} </td>
                        <td> {post.view} </td>
                        <td>
                          <span className={"badge " + checkStatus(post.status)}>
                            {post.status}{" "}
                          </span>
                        </td>
                        <td scope="col">
                          <button
                            onClick={() => {
                              openModalToWatch(post);
                            }}
                            type="button"
                            data-toggle="modal"
                            data-target="#exampleModal"
                            className="btn btn-primary m-1"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                           onClick={() => {
                            openModalToEdit(post);
                          }}
                            className="btn btn-warning m-1"
                            type="button"
                            data-toggle="modal"
                            data-target="#exampleModal"
                            disabled={post.status === 'live' ? true : false}
                          >
                            <i className="fas fa-pen"></i>
                          </button>
                          <button  onClick={() => {
                              deletePost(post.id);
                            }} type="button" disabled={post.status === 'live' ? true : false} className="btn btn-danger m-1">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
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
        </div>
      </div>
    </>
  );
};

export default MyPosts;
