import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

//react-router-dom
import { useHistory } from "react-router-dom";
import $ from "jquery";
import noImage from "../assets/images/movieDefault.png";
//react-redux
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getSeries,
  deleteSeries,
  newRelease,
} from "../../store/TvSeries/tvSeries.action";
import {
  CLOSE_TV_SERIES_TOAST,
  OPEN_DIALOG,
  TV_SERIES_DETAILS,
} from "../../store/TvSeries/tvSeries.type";

//mui
import Switch from "@mui/material/Switch";

//Alert
import { setToast } from "../../util/Toast";
import { warning, alert } from "../../util/Alert";


import { makeStyles } from '@mui/styles';
import Pagination from "../../Pages/Pagination";
import Search from "../assets/images/search.png";
import arraySort from "array-sort";
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

const TvSeries = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const classes = useStyles1();
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

  

  const { movie, toast, toastData, actionFor, totalSeries, web_Series } =
    useSelector((state) => state.series);

  useEffect(() => {
    dispatch(getSeries(activePage, rowsPerPage, search));
  }, [dispatch, activePage, rowsPerPage, search]);

  useEffect(() => {
    setData(movie);
  }, [movie]);

  useEffect(() => {
    localStorage.removeItem("updateMovieData1");
  }, []);

  //update button
  const updateOpen = (data) => {
    dispatch({ type: OPEN_DIALOG, payload: data });
    localStorage.setItem("updateMovieData", JSON.stringify(data));
    sessionStorage.setItem("tvSeriesId", data?._id);
    history.push("/admin/web_series/series_form");
  };

  //pagination
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    sessionStorage.setItem("activePage", pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
    sessionStorage.setItem("activePage", activePage);
    sessionStorage.setItem("pageParRow", value);
  };

  const insertOpen = () => {
    localStorage.removeItem("updateMovieData");
    history.push("/admin/web_series/series_form");
  };

  //Movie Details
  const MovieDetails = (data) => {
    // localStorage.setItem("movieDetails", JSON.stringify(data));
    dispatch({ type: TV_SERIES_DETAILS, payload: data });
    history.push({
      pathname: "/admin/web_series/webSeriesDetail",
      state: data,
    });
  };

  //new release switch
  const handleNewRelease = (seriesId) => {
    props.newRelease(seriesId);
  };

  //for search
  const handleSearch = (e) => {
    setSearch(e);
  };

  const handleTitleSort = () => {
    setTitleSort(!titleSort);

    arraySort(data, "title", { reverse: titleSort });
  };
  const handleCountrySort = () => {
    setCountrySort(!countrySort);

    arraySort(data, "region.name", { reverse: countrySort });
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_TV_SERIES_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  //Delete Movie
  const deleteOpen = (seriesId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          
          props.deleteSeries(seriesId);
          Toast("success", "Series deleted successfully.");
        }
      })
      .catch((err) => console.log(err));
  };
  // set default image

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
                <h4 class="card-title">Web Series</h4>
              </div>
              <div className="iq-card mb-5">
                <div className="iq-card-header d-flex justify-content-between ml-3 p-0 ">
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
                    {/* <div className="row justify-content-end">
                      <div className="col-sm-12 col-md-6">
                        <div
                          id="user_list_datatable_info"
                          className="dataTables_filter"
                        >
                          <form className="mr-3 position-relative">
                            <div className="form-group mb-0">
                              <input
                                type="search"
                                className="form-control"
                                id="exampleInputSearch"
                                placeholder="Search"
                                aria-controls="user-list-table"
                                onChange={handleSearch}
                              />
                            </div>
                          </form>
                        </div>
                      </div>
                    </div> */}
                    <table
                      id="user-list-table"
                      className="table table-striped table-borderless mt-4"
                      role="grid"
                      aria-describedby="user-list-page-info"
                    >
                      <thead class="text-nowrap">
                        <tr>
                          <th className=" tableAlign">ID</th>
                          <th className=" tableAlign">Image</th>
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
                          <th className=" tableAlign">Type</th>
                          {/* <th>View</th>
                          <th>Created Date</th> */}
                          <th className=" tableAlign">New Release</th>
                          <th className=" tableAlign">View Details</th>
                          <th className=" tableAlign">Edit</th>
                          <th className=" tableAlign">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.length > 0
                          ? data?.map((data, index) => {
                              return (
                                <React.Fragment key={index}>
                                  <tr>
                                    <td className="pr-3 tableAlign">
                                      {index + 1}
                                    </td>
                                    <td className="pr-3">
                                      <img
                                        height="100px"
                                        width="80px"
                                        className="img-fluid"
                                        style={{
                                          boxShadow:
                                            "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                          border:
                                            "0.5px solid rgba(255,255,255,0.20)",
                                          borderRadius: 10,
                                          float: "left",
                                          objectFit: "cover",
                                        }}
                                        src={
                                          data?.thumbnail
                                            ? data?.thumbnail
                                            : noImage
                                        }
                                        alt="profile"
                                      />
                                    </td>

                                    <td className="pr-3 text-center">
                                      {data?.title}
                                      {/* {data?.title?.length > 10
                                      ? data?.title.slice(0, 10) + "...."
                                      : data?.title} */}
                                    </td>
                                    <td className="pr-3 description-text text-center">
                                      {/* {parse(
                                        `${
                                          data?.description.length > 150
                                            ? data?.description.substr(0, 150) +
                                              "..."
                                            : data?.description
                                        }`
                                      )} */}
                                      {data?.region?.name}
                                    </td>
                                    {/* <td>
                                    <video
                                      // className="shadow bg-white rounded mt-2"
                                      src={data?.link}
                                      height="60px"
                                      width="60px"
                                      type="video/mp4"
                                      controls
                                      style={{
                                        boxShadow:
                                          "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                        border: "2px solid rgba(41, 42, 72, 1)",
                                        borderRadius: 10,
                                        float: "left",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </td> */}
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
                                    {/* <td>{data?.view}</td>

                                  <td>
                                    {dayjs(data?.createdAt).format(
                                      "DD MMM YYYY"
                                    )}
                                  </td> */}
                                    <td className="pr-3 tableAlign">
                                      {/* <input type={checkbox} class="custom-control-input bg-primary" id="customSwitch01" /> */}
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
                                        onClick={() => MovieDetails(data?._id)}
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
                                        onClick={() => deleteOpen(data?._id)}
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
                            data.length < 0 && (
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
                    userTotal={totalSeries}
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
  getSeries,
  deleteSeries,
  newRelease,
})(TvSeries);
