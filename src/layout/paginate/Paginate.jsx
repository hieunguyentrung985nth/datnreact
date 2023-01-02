import React from "react";
import { useState } from "react";
import {Link, useLocation, matchRoutes, useSearchParams, useNavigate} from 'react-router-dom'
import {browserHistory} from 'react-router';
import "./Paginate.css";
import { useEffect } from "react";


const Paginate = ({ pager, handlePageChange }) => {
    // const location = useLocation();
    // const [{route}] = matchRoutes(route, location);
   

    const renderPagination = ()=>{
        const arr =[];
            for (let index = pager.startPage; index <= pager.endPage; index++) {
                arr.push(
              <Link
              key={index}
            //   to={{ pathname: window.location.pathname,  query:{page:currentPage} }}
              onClick={(e)=>handlePageChange(e, index)}
                style={{ textDecoration: "none" }}
                className={(index === pager.currentPage) ? 'btn_pagging activee' : 'btn_pagging ' }
              >
                {index}
              </Link>)
            }
            return arr;
    }

  return (
    <>
      {pager && (
        <div className="col-12 text-center pb-4 pt-4">
          {pager.currentPage > 1 && (
            <Link
            onClick={(e)=>handlePageChange(e, 1)}
              style={{ textDecoration: "none" }}
              className="btn_mange_pagging active"
            >
              <i className="fas fa-arrow-left"></i>&nbsp;&nbsp; First
            </Link>
          )}
          {renderPagination()}
          {pager.currentPage < pager.totalPages && (
            <Link
            onClick={(e)=>handlePageChange(e, pager.totalPages)}
              style={{ textDecoration: "none" }}
              className="btn_mange_pagging"
            >
              Last <i className="fas fa-arrow-right"></i>&nbsp;&nbsp;{" "}
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Paginate;
