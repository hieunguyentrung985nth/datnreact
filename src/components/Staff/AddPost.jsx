import React, { useContext, useEffect, useRef, useState } from "react";
import Side from "../../layout/layout-user/Side";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./style.css";
import Validator from "hero-validate";
import StaffApi from "../../Api/Staff/StaffApi";
import AuthApi from "../../Api/Auth/Auth";
import { MyUploadAdapter } from "../../utils/Adapter";
import { SocketContext } from "../../context/SocketProvider";
import AuthContext from "../../context/AuthProvider";


const AddPost = () => {
  //ClassicEditor.create(document.getElementById('#desc'))
  const { socket } = useContext(SocketContext);
  const {user} = useContext(AuthContext);

  const sendNotification = (postId) => {
    socket.emit("sendNotification", {
      creator_id: user.id,
      post_id: postId,
      type: "newpost",
    });
    return ()=>socket.off("sendNotification");
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
  const [author, setAuthor] = useState(async ()=>{
    const user =await AuthApi.getCurrentUser();
    return user.ID;
  })

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

  const [postForm, setPostForm] = useState({
    title: "",
    description: "",
    content: "",
    slug: "",
    categoryids: [],
    banner: "",
    view: 0
   
  });

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
    console.log(ckeditor2.current.getData());
    setTouched({ ...touched, content: true });
    setPostForm({ ...postForm, content: data });
  };
  const handleEditor1 = (event, editor) => {
    const data = editor.getData();
    console.log(ckeditor1.current.getData());
    setTouched({ ...touched, description: true });
    setPostForm({ ...postForm, description: data });
  };
  const handleCategoryids = (event)=>{
    setTouched({ ...touched, categoryids: true });
    var options = event.target.options;
    var value = [];
    for (let index = 0; index < options.length; index++) {
       if(options[index].selected)
            value.push(options[index].value);
    }
    setPostForm({...postForm, categoryids: value});
  }
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
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
  const submit = (e) => {
    e.preventDefault();
    console.log(postForm);
    StaffApi.upPost(postForm).then((res) => {
      console.log(res);
      const formData = new FormData();
      formData.append('file',selectedFile);
      StaffApi.uploadImage(formData,res.data.id).then(data=>{
        sendNotification(res.data.id);
        deleteImage();
        ckeditor1.current.setData('');
        ckeditor2.current.setData('');
        setPostForm({
            title: "",
            description: "",
            content: "",
            slug: "",
            categoryids: [],
            banner: "",
            view: 0,
        });


      })
    });

  };
  const onReady = (editor)=> {
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
  }
  let ckeditor1 = useRef();
  let ckeditor2 = useRef();


  return (
    <>
      <div id="layoutSidenav">
        <Side />
        <div id="layoutSidenav_content">
          <main className="container-fluid px-4" id="vb">
            <h1 className="mt-4">Viết bài</h1>
            <div className="container" style={{ margin: "0" }} id="postup">
              <div className="row" id="row_style">
                <div className="col-md-12 col-md-offset-4">
                  <form encType="multipart/form-data" onSubmit={submit}>
                    <div className="form-group">
                      <label htmlFor="">Tiêu đề</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tiêu đề"
                        name="title"
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
                      <label htmlFor="">Ngày viết</label>
                      <input
                        id="currentdate"
                        type="text"
                        readOnly
                        className="form-control"
                        
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="">Slug</label>
                      <input
                        name="slug"
                        value={postForm.slug}
                        onChange={handleChange}
                        type="text"
                        className="form-control"
                        placeholder="Slug"
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
                      <label htmlFor="">Ảnh bài viết</label> <br />
                      {selectedFile && (
                        <img
                          alt=""
                          src={preview}
                          style={{ width: "480px", height: "360px" }}
                        />
                      )}
                      <label htmlFor="files" className="btn btn-primary">
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
                      <label htmlFor="">Chọn thể loại</label>
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
                      <label htmlFor="editor2">Mô tả</label>
                      <CKEditor
                      ref={ckeditor1}
                        id="desc"
                        editor={ClassicEditor}
                        className="ck-content"
                        name="description"
                        value={postForm.description}
                        onChange={handleEditor1}
                       onReady={(editor)=>{ckeditor1.current = editor}}
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
                      <label htmlFor="editor1">Nội dung</label>
                      <CKEditor
                        ref={ckeditor2}
                        id="content"
                        editor={ClassicEditor}
                        className="ck-content"
                        name="content"
                        value={postForm.content}
                        onChange={handleEditor2}
                        onReady={(editor)=>onReady(editor)}
                      ></CKEditor>
                      {hasErr("content") && (
                        <div style={{ color: "red" }} role="alert">
                          <span className="text-danger">
                            {errors.getError("content")}
                          </span>
                        </div>
                      )}
                    </div>
                    <br />
                    <div className="form-group mt-3">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        id="uppost"
                        disabled={errors.hasError ? true : false}
                      >
                        Đăng Bài
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AddPost;
