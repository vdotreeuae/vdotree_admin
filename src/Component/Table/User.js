import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

//react-router-dom
import { Link, useHistory } from "react-router-dom";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";

//image
import profile from "../assets/images/singleUser.png";

//action
import {
  getUser,
  handleBlockUnblockSwitch,
} from "../../store/User/user.action";
import $ from "jquery";

//mui
import Switch from "@mui/material/Switch";

//Pagination
import TablePaginationActions from "./Pagination";
import { TablePagination } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";

import { baseURL } from "../../util/config";

//Alert

import { covertURl } from "../../util/AwsFunction";
import Search from "../assets/images/search.png";
import arraySort from "array-sort";

const User = (props) => {
  const { loader } = useSelector((state) => state.loader);
  // const [showURLs, setShowURLs] = useState([]);
  const dispatch = useDispatch();

  const history = useHistory();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [coinSort, setCoinSort] = useState(true);
  const [emailSort, setEmailSort] = useState(true);
  const [countrySort, setCountrySort] = useState(true);

  const { user, total } = useSelector((state) => state.user);
  

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);


  //Set User Data
  useEffect(() => {
    setData(user);
  }, [user]);

  const count = total;

  //pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //user details
  const userDetails = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    history.push("/admin/user/user_form");
  };

  //for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = user.filter((data) => {
        return (
          data?.fullName?.toUpperCase()?.indexOf(value) > -1 ||
          data?.country?.toUpperCase()?.indexOf(value) > -1 ||
          data?.gender?.toUpperCase()?.indexOf(value) > -1 ||
          data?.email?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(user);
    }
  };

  const handleUserHistory = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    history.push("/admin/user/history");
  };

  //Block switch
  const handleIsBlock = (userId) => {
    
    props.handleBlockUnblockSwitch(userId);
  };
  const handleCoinSort = () => {
    setCoinSort(!coinSort);

    arraySort(data, "fullName", { reverse: coinSort });
  };
  const handleEmailSort = () => {
    setEmailSort(!emailSort);

    arraySort(data, "email", { reverse: emailSort });
  };
  const handleCountrySort = () => {
    setCountrySort(!countrySort);

    arraySort(data, "country", { reverse: countrySort });
  };

  // set default image

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", profile);
    });
  });

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid pl-3">
          <div className="row">
            <div className="col-sm-12">
              <div className="iq-card mb-5">
                <div className="iq-card-header-table d-flex justify-content-between pt-5 mx-2">
                  <div class="iq-header-title">
                    <h4 class="card-title">User List</h4>
                  </div>
                  <div className="text-center sm ">
                    <form class="position-relative">
                      <div class="form-group mb-0 d-flex mr-3 position-relative">
                        {/* <i class="fa fa-search text-white" aria-hidden="true"></i> */}
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
                      <thead class="text-nowrap">
                        <tr>
                          <th className="text-center">Profile</th>
                          <th
                            className="d-flex justify-content-center align-items-center"
                            onClick={handleCoinSort}
                            style={{ cursor: "pointer" }}
                          >
                            Name {coinSort ? " ▼" : " ▲"}
                          </th>
                          <th className="text-center">Nick Name</th>
                          <th
                            className="text-center"
                            onClick={handleEmailSort}
                            style={{ cursor: "pointer" }}
                          >
                            Email {emailSort ? " ▼" : " ▲"}
                          </th>

                          <th className="text-center">Gender</th>
                          <th
                            className="text-center"
                            onClick={handleCountrySort}
                            style={{ cursor: "pointer" }}
                          >
                            Country {countrySort ? " ▼" : " ▲"}
                          </th>

                          <th className="text-center">Premium Plan</th>
                          <th className="text-center">Block</th>
                          <th className="text-center">Join Date</th>
                          <th className="text-center">History</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.length > 0
                          ? data
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((data, index) => {
                                return (
                                  <>
                                    <tr>
                                      {/* <td class="align-middle">{index + 1}</td> */}
                                      <td className="text-center">
                                        <img
                                          className="rounded-circle img-fluid avatar-40"
                                          src={data?.image ? data?.image : profile}
                                          alt=""
                                          style={{ objectFit: "cover" }}
                                        />
                                      </td>

                                      <td className="text-center text-capitalize">
                                        {data?.fullName}
                                      </td>
                                      <td className="text-center text-capitalize">
                                        {data?.nickName}
                                      </td>
                                      <td className="text-center">
                                        {data?.loginType !== 2
                                          ? data?.email
                                          : data.uniqueId}
                                      </td>
                                      <td className="text-center text-capitalize">
                                        {data?.gender}
                                      </td>
                                      <td className="text-center text-capitalize">
                                        {data?.country}
                                      </td>

                                      <td className="text-center">
                                        {data.isPremiumPlan ? "Yes" : "No"}
                                      </td>
                                      <td className="text-center">
                                        <Switch
                                          checked={data?.isBlock}
                                          onChange={(e) =>
                                            handleIsBlock(data?._id)
                                          }
                                          color="primary"
                                          name="checkedB"
                                          inputProps={{
                                            "aria-label": "primary checkbox",
                                          }}
                                        />
                                      </td>
                                      <td class="align-middle text-center">
                                        {dayjs(data?.date).format(
                                          "YYYY MMM DD"
                                        )}
                                      </td>
                                      <td className="text-center">
                                        <button
                                          type="button"
                                          className="btn iq-bg-primary btn-sm"
                                          onClick={() =>
                                            handleUserHistory(data)
                                          }
                                        >
                                          <HistoryIcon />
                                        </button>
                                      </td>
                                    </tr>
                                  </>
                                );
                              })
                          : loader === false &&
                            data.length === 0 && (
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
                      { label: "All", value: data.length },
                    ]}
                    component="div"
                    count={data.length}
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
  getUser,
  handleBlockUnblockSwitch,
})(User);
