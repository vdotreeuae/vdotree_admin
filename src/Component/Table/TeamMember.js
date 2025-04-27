import React, { useState, useEffect } from "react";
import $ from "jquery";

//image
import placeholderImage from "../assets/images/defaultUserPicture.jpg";

//react-router-dom
import { NavLink, useHistory } from "react-router-dom";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import Search from "../assets/images/search.png";

//mui
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import EditIcon from "@mui/icons-material/Edit";

//Alert
import Swal from "sweetalert2";

//Alert
import { setToast } from "../../util/Toast";
import { warning } from "../../util/Alert";


//action
import {
  getTeamMember,
  deleteTeamMember,
} from "../../store/TeamMember/teamMember.action";
import { getMovie } from "../../store/Movie/movie.action";
import {
  OPEN_DIALOG,
  CLOSE_TEAM_MEMBER_TOAST,
} from "../../store/TeamMember/teamMember.type";

//Pagination
import TablePaginationActions from "./Pagination";
import { TablePagination } from "@mui/material";
import { baseURL } from "../../util/config";
import { covertURl } from "../../util/AwsFunction";

const TeamMember = (props) => {
  const { loader } = useSelector((state) => state.loader);
  const { teamMember, toast, toastData, actionFor } = useSelector(
    (state) => state.teamMember
  );

  const history = useHistory();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  

  const dialogData = JSON.parse(localStorage.getItem("trailerId"));
  const movieTitle = localStorage.getItem("movieTitle");


  useEffect(() => {
    dispatch(getTeamMember(dialogData?._id));
    dispatch(getMovie());
  }, []);

  useEffect(() => {
    setData(teamMember);
  }, [teamMember]);

  const insertOpen = (data) => {
    
    localStorage.removeItem("updateTeamMemberData");
    history.push("/admin/cast/cast_form");
  };

  //Update Dialog OPen
  const updateOpen = (data) => {
    
    dispatch({ type: OPEN_DIALOG, payload: data });
    localStorage.setItem("updateTeamMemberDataDialogue", JSON.stringify(data));

    history.push("/admin/cast/cast_form");
  };

  //pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // delete sweetAlert
  const openDeleteDialog = (mongoId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          
          props.deleteTeamMember(mongoId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  //for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = teamMember.filter((data) => {
        return (
          data?.name?.toUpperCase()?.indexOf(value) > -1 ||
          data?.position?.toUpperCase()?.indexOf(value) > -1 ||
          data?.movie?.title.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(teamMember);
    }
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_TEAM_MEMBER_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", placeholderImage);
    });
  });

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div class="col-sm-12 col-lg-12 mb-4 pr-0 pl-0">
                <div class="iq-card">
                  <div class="iq-card-header d-flex justify-content-between">
                    <div class="iq-header-title d-flex align-items-center">
                      <MovieFilterIcon
                        className="mr-2"
                        style={{ fontSize: "30px", color: "#ffff" }}
                      />
                      <h4 class="card-title my-0">{movieTitle} : Cast</h4>
                    </div>
                  </div>
                  <div class="iq-card-body">
                    <ul
                      class="nav nav-pills mb-2"
                      id="pills-tab"
                      role="tablist"
                      style={{ marginLeft: "21px" }}
                    >
                      <li class="nav-item navCustom">
                        <NavLink
                          class="nav-link "
                          id="pills-home-tab"
                          data-toggle="pill"
                          href="#pills-home"
                          to="/admin/movie/movie_form"
                          role="tab"
                          aria-controls="pills-home"
                          aria-selected="true"
                        >
                          <EditIcon
                            className="mb-1"
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          Edit
                        </NavLink>
                      </li>
                      <li class="nav-item navCustom">
                        <NavLink
                          class="nav-link"
                          id="pills-profile-tab"
                          data-toggle="pill"
                          href="#pills-profile"
                          to="/admin/movie/trailer"
                          role="tab"
                          aria-controls="pills-profile"
                          aria-selected="false"
                        >
                          <i
                            className="ri-vidicon-line mr-1"
                            style={{ fontSize: "18px" }}
                          />
                          Trailer
                        </NavLink>
                      </li>
                      <li class="nav-item navCustom">
                        <NavLink
                          class="nav-link active"
                          id="pills-contact-tab"
                          data-toggle="pill"
                          href="#pills-contact"
                          to="/admin/movie/cast"
                          role="tab"
                          aria-controls="pills-contact"
                          aria-selected="false"
                        >
                          <RecentActorsIcon
                            className="mr-1"
                            style={{ fontSize: "20px", marginBottom: "2px" }}
                          />
                          Cast
                        </NavLink>
                      </li>
                    </ul>
                    <div class="tab-content" id="pills-tabContent-2">
                      <div
                        class="tab-pane fade show active"
                        id="pills-home"
                        role="tabpanel"
                        aria-labelledby="pills-home-tab"
                      ></div>
                      <div
                        class="tab-pane fade"
                        id="pills-profile"
                        role="tabpanel"
                        aria-labelledby="pills-profile-tab"
                      ></div>
                      <div
                        class="tab-pane fade"
                        id="pills-contact"
                        role="tabpanel"
                        aria-labelledby="pills-contact-tab"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="iq-header-title">
                {/* <h4 class="card-title">Cast</h4> */}
              </div>

              <div className="iq-card mb-5">
                <div className="iq-card-header d-flex justify-content-between">
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
                          onChange={handleSearch}
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
                      <thead>
                        <tr>
                          <th className="tableAlign">ID</th>
                          <th className="tableAlign">Profile Image</th>
                          <th className="tableAlign">Name</th>
                          <th className="tableAlign">Job</th>
                          <th className="tableAlign">Movie</th>
                          <th className="tableAlign">Edit</th>
                          <th className="tableAlign">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.length > 0
                          ? data
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((data, index) => {
                                return (
                                  <>
                                    <tr className="text-center">
                                      <td>{index + 1}</td>
                                      <td>
                                        <img
                                          src={
                                            data?.image
                                              ? data?.image
                                              : placeholderImage
                                          }
                                          height="60px"
                                          width="60px"
                                          style={{
                                            boxShadow:
                                              "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                            border:
                                              "0.5px solid rgba(255, 255, 255, 0.20)",
                                            borderRadius: 10,

                                            objectFit: "cover",
                                          }}
                                          alt=""
                                        />
                                      </td>
                                      <td>{data?.name}</td>
                                      <td>{data?.position}</td>
                                      <td>{data?.movie?.title}</td>

                                      <td>
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
                                      <td>
                                        <button
                                          type="button"
                                          className="btn iq-bg-primary btn-sm"
                                          onClick={() =>
                                            openDeleteDialog(data._id)
                                          }
                                        >
                                          <i
                                            class="ri-delete-bin-6-line"
                                            style={{ fontSize: "19px" }}
                                          ></i>
                                        </button>
                                      </td>
                                    </tr>
                                  </>
                                );
                              })
                          : loader === false &&
                            data?.length === 0 && (
                              <tr>
                                <td colSpan="12" className="text-center">
                                  No data Found!!
                                </td>
                              </tr>
                            )}
                      </tbody>
                    </table>
                  </div>

                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      50,
                      100,
                      { label: "All", value: data?.length },
                    ]}
                    component="div"
                    count={data?.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
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
  getTeamMember,
  getMovie,
  deleteTeamMember,
})(TeamMember);
