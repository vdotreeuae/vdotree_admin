import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import noImage from "../assets/images/moviePlaceHolder.png";

//react-router-dom
import { useHistory } from "react-router-dom";

//react-redux
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getMovie,
  deleteMovie,
  newRelease,
} from "../../store/Movie/movie.action";
import $ from "jquery";
import {
  CLOSE_MOVIE_TOAST,
  OPEN_MOVIE_DIALOG,
  MOVIE_DETAILS,
} from "../../store/Movie/movie.type";

//mui
import Switch from "@mui/material/Switch";

//Alert
import { setToast } from "../../util/Toast";
import { warning, alert } from "../../util/Alert";
import Swal from "sweetalert2";


//html Parser

import { makeStyles } from '@mui/styles';
import { baseURL } from "../../util/config";
import Pagination from "../../Pages/Pagination";
import { covertURl } from "../../util/AwsFunction";
import Search from "../assets/images/search.png";
import arraySort from "array-sort";
import { OPEN_LOADER } from "../../store/Loader/loader.type";
import { Toast } from "../../util/Toast_";
//useStyle
const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft:theme?.spacing && theme?.spacing(2.5),
    background: "#221f3a",
    color: "#fff",
  },
}));

const Movie = (props) => {
  const { loader } = useSelector((state) => state.loader);

  //Define History
  const history = useHistory();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [showURLs, setShowURLs] = useState([]);
  const [titleSort, setTitleSort] = useState(true);
  const [countrySort, setCountrySort] = useState(true);
  const [search, setSearch] = useState("");

  

  const { movie, isTost, toastData, actionFor, totalMovie } = useSelector(
    (state) => state.movie
  );

  useEffect(() => {
    dispatch(getMovie(activePage, rowsPerPage, search));
  }, [dispatch, activePage, rowsPerPage, search]);

  useEffect(() => {
    if (movie?.length > 0) {
      setData(movie);
    }
  }, [movie]);

  const updateOpen = (data) => {
    sessionStorage.setItem("trailerId", data?._id);
    localStorage.setItem("updateMovieData1", JSON.stringify(data));
    history.push({ pathname: "/admin/movie/movie_form", state: data });
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const insertOpen = () => {
    localStorage.removeItem("updateMovieData");
    history.push("/admin/movie/movie_form");
  };

  const MovieDetails = (data) => {
    dispatch({ type: MOVIE_DETAILS, payload: data });
    history.push({
      pathname: "/admin/movie/movie_details",
      state: data,
    });
  };

  const handleNewRelease = (movieId) => {
    
    props.newRelease(movieId);
  };

  const handleSearch = (e) => {
    setSearch(e);
  };

  useEffect(() => {
    localStorage.removeItem("updateMovieData1");
  }, []);

  const deleteOpen = (movieId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          
          props.deleteMovie(movieId);
          Toast("success", "Movie deleted successfully.");
        }
      })
      .catch((err) => console.log(err));
  };
  const handleTitleSort = () => {
    setTitleSort(!titleSort);
    arraySort(data, "title", { reverse: titleSort });
  };
  const handleCountrySort = () => {
    setCountrySort(!countrySort);
    arraySort(data, "region.name", { reverse: countrySort });
  };
  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", noImage);
    });
  });
  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid pl-3">
          <div className="row">
            <div className="col-sm-12">
              <div class="iq-header-title mt-4 ml-2">
                <h4 class="card-title">Movie</h4>
              </div>
              <div className="iq-card mb-5">
                <div className="iq-card-header d-flex justify-content-between p-0 ml-3">
                  <button
                    type="button"
                    class="btn dark-icon btn-primary"
                    data-bs-toggle="modal"
                    id="create-btn"
                    data-bs-target="#showModal"
                    onClick={insertOpen}
                  >
                    <i class="ri-add-line align-bottom me-1 fs-6"></i> Add
                  </button>
                  <div className="text-center sm">
                    <form class="mr-3 position-relative">
                      <div class="form-group mb-0 d-flex mr-3 position-relative">
                        {" "}
                        <img
                          src={Search}
                          width="23px"
                          height="23px"
                          style={{
                            filter: "invert(1)",
                            right: "10px",
                            position: "absolute",
                            top: "7px",
                          }}
                        />
                        <input
                          type="search"
                          class="form-control"
                          id="input-search"
                          placeholder="Search"
                          aria-controls="user-list-table"
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <div className="iq-card-body">
                  <div className="table-responsive">
                    <table
                      id="user-list-table"
                      className="table table-striped table-borderless mt-4"
                      role="grid"
                      aria-describedby="user-list-page-info"
                    >
                      <thead class="text-nowrap">
                        <tr>
                          <th className="tableAlign">ID</th>
                          <th className="tableAlign">Image</th>
                          <th
                            className="tableAlign"
                            onClick={handleTitleSort}
                            style={{ cursor: "pointer" }}
                          >
                            Title {titleSort ? " ▼" : " ▲"}
                          </th>
                          <th
                            className="tableAlign"
                            onClick={handleCountrySort}
                            style={{ cursor: "pointer" }}
                          >
                            Region {countrySort ? " ▼" : " ▲"}
                          </th>
                          <th className="tableAlign">Type</th>
                          <th className="tableAlign">New Release</th>
                          <th className="tableAlign">View Details</th>
                          <th className="tableAlign">Edit</th>
                          <th className="tableAlign">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.length > 0
                          ? data.map((data, index) => {
                              return (
                                <React.Fragment key={index}>
                                  <tr>
                                    <td className="pr-3 tableAlign">
                                      {index + 1}
                                    </td>
                                    <td className="pr-3">
                                      <img
                                        className="img-fluid"
                                        style={{
                                          height: "100px",
                                          width: "80px",
                                          boxShadow:
                                            "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                          border:
                                            "0.5px solid rgba(255, 255, 255, 0.20)",
                                          borderRadius: 10,
                                          objectFit: "cover",
                                        }}
                                        src={
                                          data?.thumbnail
                                            ? data?.thumbnail
                                            : noImage
                                        }
                                        alt=""
                                      />
                                    </td>

                                    <td className="text-start text-capitalize text-center">
                                      {data?.title}
                                    </td>
                                    <td className="description-text text-center">
                                      {data?.region?.name}
                                    </td>

                                    <td className="pr-3 tableAlign">
                                      {data?.type === "Premium" ? (
                                        <div class="badge badge-pill badge-danger">
                                          {data?.type}
                                        </div>
                                      ) : (
                                        <div class="badge badge-pill badge-info">
                                          {data?.type}
                                        </div>
                                      )}
                                    </td>

                                    <td className="pr-3 tableAlign">
                                      <Switch
                                        checked={data?.isNewRelease}
                                        onChange={(e) =>
                                          handleNewRelease(data?._id)
                                        }
                                        color="primary"
                                        name="checkedB"
                                        inputProps={{
                                          "aria-label": "primary checkbox",
                                        }}
                                      />
                                    </td>

                                    <td className="pr-3 tableAlign">
                                      <button
                                        type="button"
                                        className="btn iq-bg-primary btn-sm"
                                        onClick={() => MovieDetails(data._id)}
                                      >
                                        <i
                                          class="ri-information-line"
                                          style={{ fontSize: "19px" }}
                                        ></i>
                                      </button>
                                    </td>
                                    <td className="pr-3 tableAlign">
                                      <button
                                        type="button"
                                        className="btn iq-bg-primary btn-sm"
                                        onClick={() => updateOpen(data)}
                                      >
                                        <i
                                          className="ri-pencil-fill"
                                          style={{ fontSize: "19px" }}
                                        />
                                      </button>
                                    </td>
                                    <td className="pr-3 tableAlign">
                                      <button
                                        type="button"
                                        className="btn iq-bg-primary btn-sm"
                                        onClick={() => deleteOpen(data._id)}
                                      >
                                        <i
                                          class="ri-delete-bin-6-line"
                                          style={{ fontSize: "19px" }}
                                        ></i>
                                      </button>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            })
                          : loader === false &&
                            data?.length < 0 && (
                              <tr>
                                <td colSpan="12" className="text-center">
                                  No data Found!!
                                </td>
                              </tr>
                            )}
                      </tbody>
                    </table>
                  </div>

                  <Pagination
                    activePage={activePage}
                    rowsPerPage={rowsPerPage}
                    userTotal={totalMovie}
                    handleRowsPerPage={handleRowsPerPage}
                    handlePageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getMovie,
  deleteMovie,
  newRelease,
})(Movie);
