import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ManagerApi from "../../Api/Manager/ManagerApi";
import Side from "../../layout/layout-user/Side";
import { hideText } from "../../utils/Pipe";
import Validator from "hero-validate";

const ViewCategory = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [pager, setPager] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);

  useEffect(() => {
    const fetch = async () => {
      const data = await ManagerApi.getAllCategories();
      setCategoryList(data.data.data);
      console.log(data.data.data);
    };
    fetch();
  }, []);

  var count = 0;
  var hackLevel = 0;
  const render = useRef();
  const [table, setTable] = useState(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    // if (time < 2) {
    //   setTime(time + 1);
    //   return;
    // }
    if (render.current) {
      // if (time < 2) {
      //   setTime(time + 1);
      //   return;
      // }
      setTable(document.getElementById("table"));

      var table = document.getElementById("table");
      console.log(table);
      var html = "";
      hackLevel = 0;
      count = 0;

      for (let index = 0; index < categoryList.length; index++) {
        count++;
        html += renderCategory(categoryList[index], 0, count);
      }
      if (table) table.innerHTML = html;
      else table.innerHTML = "";
      //var btn = document.getElementsByclassName('edit');
      document.querySelectorAll(".edit").forEach((link) =>
        link.addEventListener("click", () => {
          var el = link.getAttribute("data-id")
            ? link.getAttribute("data-id")?.toString()
            : "";
          editCategory(el);
        })
      );
      document.querySelectorAll(".delete").forEach((link) =>
        link.addEventListener("click", () => {
          var el = link.getAttribute("data-id")
            ? link.getAttribute("data-id")?.toString()
            : "";
          deleteCategory(el);
        })
      );
    }
  }, [table, time, categoryList]);

  const renderCategory = (category, level, index) => {
    const spaces = "*";
    const repeat = spaces.repeat(level);
    var html = "";
    html += ` <tr>
    <td scope="row">${index}</td>
    <td>${repeat + category.title}</td>
    <td>${category.slug}</td>
    <td>${hideText(category.description, 30)}</td>
    <th scope="col">
      <button
        class="btn btn-primary edit"
        data-toggle="modal"
        data-target="#exampleModal"
        data-id="${category.id}"
        (click)="editCategory(${category.id})"
        
      >
        Sửa</button
      ><button
        class="btn btn-danger delete"
        data-id="${category.id}"
        (click)="deleteCategory(${category.id})"
      >
        Xóa
      </button>
    </th>
  </tr>`;
    if (
      category.inverseCategoryNavigation &&
      category.inverseCategoryNavigation?.length > 0
    ) {
      for (let i = 0; i < category.inverseCategoryNavigation.length; i++) {
        count++;
        html += renderCategory(
          category.inverseCategoryNavigation[i],
          level + 1,
          count
        );
        hackLevel++;
      }
      category.inverseCategoryNavigation.forEach((child) => {});
    }
    return html;
  };


  const deleteCategory =async (id) => {
    if(window.confirm('Xóa chứ?')){
      await ManagerApi.deleteCategory(id);
      const data = await ManagerApi.getAllCategories();
      setCategoryList(data.data.data);
    }
  };

  const rules = {
    title: "required|min:2",
    description: "required|min:2",
    slug: "required|min:2",
  };
  Validator.setLocale(Validator.languages.vi);

  Validator.setMessages({
    title: {
      required: "Không được bỏ trống :name",
      min: "Quá ngắn",
    },
  });
  const [categoryForm, setCategoryForm] = useState({
    title: "",
    description: "",
    slug: "",
    categoryid: "",
  });

  const [touched, setTouched] = useState({
    title: false,
    description: false,
    slug: false,
    categoryid: false,
  });

  const [errors, setErrors] = useState(Validator.getEmpty());

  const hasErr = (name) => {
    //console.log(errors);
    return touched[name] && errors.isError(name);
  };

  const handleChange = (event) => {
    //event.persist();
    setTouched({ ...touched, [event.target.name]: true });
    setCategoryForm({
      ...categoryForm,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    setErrors(Validator.validate(categoryForm, rules));
  }, [categoryForm]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      let data = await ManagerApi.getAllCategories();
      console.log(data.data);

      setCategories(data.data.data);
    };
    fetch();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    console.log(categoryForm);
    if(categoryForm.categoryid === "null") setCategoryForm({...categoryForm, categoryid: null})
    if (isAdding) {
      ManagerApi.addCategory(categoryForm).then(async (res) => {
        console.log(res);
        alert("Thêm thành công");
        const ef = document.getElementById("cancel");
        ef?.click();
        const data = await ManagerApi.getAllCategories();
        setCategoryList(data.data.data);
      });
    } else {
      ManagerApi.updateCategory(categoryForm).then(async (res) => {
        console.log(res);
        alert("Sửa thành công");
        const ef = document.getElementById("cancel");
        ef?.click();
        const data = await ManagerApi.getAllCategories();
        setCategoryList(data.data.data);
      });
    }
   
   
  };

  const editCategory = (categoryId) => {
    setIsAdding(false);
    const currentCategory = categoryList.find((c) => c.id === categoryId);
    console.log(currentCategory);
    setCategoryForm({
      ...categoryForm,
      id: currentCategory.id,
      title: currentCategory.title,
      slug: currentCategory.slug,
      description: currentCategory.description,
      categoryid: currentCategory.categoryid || "null",
    });
  };
  const [isAdding, setIsAdding] = useState(false);

  const addCategory = () => {
    setIsAdding(true);
    setCategoryForm({
      ...categoryForm,
      id: '',
      title: '',
      slug: '',
      description: '',
      categoryid: "null",
    });
  };
  console.log(categoryForm);

  return (
    <>
      <div id="layoutSidenav">
        <Side />
        <div id="layoutSidenav_content">
          <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý danh mục</h1>
            <div className="card mb-4" style={{ width: "100%" }}>
              <div
                className="modal fade"
                id="exampleModal"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="modalTitle">
                        Quản lý danh mục
                      </h5>
                      <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        id="cancel"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={submit}>
                        <div className="form-group">
                          <label for="name" className="col-form-label">
                            Tên danh mục:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            formControlName="title"
                            value={categoryForm.title}
                            onChange={handleChange}
                            name="title"
                          />
                        </div>
                        <div className="form-group">
                          <label for="name" className="col-form-label">
                            Slug:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            formControlName="slug"
                            value={categoryForm.slug}
                            onChange={handleChange}
                            name="slug"
                          />
                        </div>
                        <div className="form-group">
                          <label for="name" className="col-form-label">
                            Mô tả:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="inputPassword"
                            formControlName="description"
                            value={categoryForm.description}
                            onChange={handleChange}
                            name="description"
                          />
                        </div>
                        <div className="form-group">
                          <label for="name" className="col-form-label">
                            Danh mục cha:
                          </label>

                          {categories && (
                            <select
                              name="categoryid"
                              value={categoryForm.categoryid}
                              onChange={handleChange}
                              className="form-select"
                              aria-label="Default select example"
                              // multiple={true}
                            >
                              <option value="null">
                                Không có danh mục cha
                              </option>
                              {categories?.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.title}{" "}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                        <div class="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                          >
                            Đóng
                          </button>
                          {isAdding && (
                            <button type="submit" className="btn btn-primary">
                              Add
                            </button>
                          )}
                          {!isAdding && (
                            <button type="submit" className="btn btn-primary">
                              Update
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body" style={{ backgroundColor: "white" }}>
                <button
                  type="button"
                  class="btn btn-primary"
                  data-toggle="modal"
                  data-target="#exampleModal"
                  onClick={addCategory}
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
                      <th scope="col">Tên danh mục</th>
                      <th scope="col">Slug</th>
                      <th scope="col">Mô tả</th>
                      <th scope="col">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody ref={render} id="table"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewCategory;
