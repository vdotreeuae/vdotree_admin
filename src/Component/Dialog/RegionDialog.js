import React, { useState, useEffect } from "react";

// material-ui
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Tooltip,
} from "@mui/material";
import Cancel from "@mui/icons-material/Cancel";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";

//action
import { insertRegion, updateRegion } from "../../store/Region/region.action";
import { CLOSE_DIALOG } from "../../store/Genre/genre.type";

//Alert


const RegionDialog = (props) => {
  const { dialog: open, dialogData } = useSelector((state) => state.region);

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  // const [image, setImage] = useState([]);
  // const [imagePath, setImagePath] = useState("");
  const [regionId, setRegionId] = useState("");
  const [error, setError] = useState({
    name: "",
    // image: "",
  });

  

  //Insert and update Data Functionality
  const handleSubmit = (e) => {
    
    e.preventDefault();

    if (!regionId) {
      if (
        // !image || !imagePath ||
        !name
      ) {
        const error = {};
        if (!name) error.name = "Name is Required!";
        // if (!image || !imagePath) error.image = "Image is Required!";
        return setError({ ...error });
      }
    } else {
      if (
        // !image && !imagePath &&
        !name
      ) {
        if (!name) error.name = "Name is Required!";
        // if (image.length === 0 && !imagePath)
        //   error.image = "Image is Required!";
        return setError({ ...error });
      }
    }
    dispatch({ type: CLOSE_DIALOG });
    
    // const formData = new FormData();

    // formData.append("image", image);
    // formData.append("name", name);

    const regionData = {
      name,
    };

    if (regionId) {
      props.updateRegion(regionId, name);
    } else {
      props.insertRegion(regionData);
    }
  };

  //Empty Data After Insert
  useEffect(() => {
    setError({
      name: "",
    });
    setName("");
    setRegionId("");
  }, [open]);

  //Set Data Value
  useEffect(() => {
    if (dialogData) {
      setName(dialogData.name);
      // setImagePath(dialogData.image);
      setRegionId(dialogData._id);
    }
  }, [dialogData]);

  //Close Dialog
  const handleClose = () => {
    dispatch({ type: CLOSE_DIALOG });
  };

  //  Image Load fffff
  // const imageLoad = (event) => {
  //   setImage(event.target.files[0]);

  //   setImagePath(URL.createObjectURL(event.target.files[0]));
  // };

  const handleKeyPress = (event) => {
    event.preventDefault();
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="responsive-dialog-title"
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="responsive-dialog-title">
        {dialogData ? <h5>Edit Region</h5> : <h5>Add Region</h5>}
      </DialogTitle>

      <Tooltip title="Close">
        <Cancel
          className="cancelButton"
          style={{
            position: "absolute",
            top: "23px",
            right: "15px",
            color: "#fff",
          }}
          onClick={handleClose}
        />
      </Tooltip>

      <DialogContent>
        <div className="modal-body pt-1 px-1 pb-3">
          <div className="d-flex flex-column">
            <form>
              <div className="form-group">
                <div className="row">
                  <div className="col-md-12 my-2">
                    <label className="float-left styleForTitle text-white">
                      Name
                    </label>
                    
                    <input

                      type="text"
                      placeholder="Name"
                      className="form-control form-control-line text-capitalize"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1));
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            name: "Name is Required!",
                          });
                        } else {
                          return setError({
                            ...error,
                            name: "",
                          });
                        }
                      }}
        
                    />
                    {error.name && (
                      <div className="pl-1 text-left">
                       {error.name && (
                        <span className="error">{error.name}</span>
                      )}
                      </div>
                    )}
                  </div>
                </div>

                {/* <div className="row">
                  <div className="col-md-12 my-2">
                    <label className="float-left styleForTitle text-white">
                      Image
                    </label>
                    <input
                      class="form-control form-control-sm"
                      id="customFile"
                      type="file"
                      accept="image/png, image/jpeg ,image/jpg"
                      required=""
                      onChange={imageLoad}
                    ></input>

                    {imagePath ? (
                      <>
                        <img
                          height="100px"
                          width="100px"
                          alt="app"
                          src={imagePath}
                          style={{
                            boxShadow: "0 0 0 1.2px #7f65ad80",
                            borderRadius: 10,
                            marginTop: 10,
                            float: "left",
                          }}
                        />

                        <div
                          className="img-container"
                          style={{
                            display: "inline",
                            position: "relative",
                            float: "left",
                          }}
                        ></div>
                      </>
                    ) : (
                      <div className="pl-1 text-left">
                        <Typography
                          variant="caption"
                          style={{
                            fontFamily: "Circular-Loom",
                            color: "#ee2e47",
                          }}
                        >
                          {error.image}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div> */}
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
      <div>
        <hr className=" dia_border w-100 mt-0"></hr>
      </div>
      <DialogActions>
        <button
          type="button"
          className="btn btn-danger btn-sm px-3 py-1 mb-3"
          onClick={handleClose}
        >
          Cancel
        </button>
        {dialogData ? (
          <button
            type="button"
            className="btn btn-success btn-sm px-3 py-1 mr-3 mb-3"
            onClick={handleSubmit}
          >
            Update
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-success btn-sm px-3 py-1 mr-3 mb-3"
            onClick={handleSubmit}
          >
            Insert
          </button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default connect(null, { insertRegion, updateRegion })(RegionDialog);
