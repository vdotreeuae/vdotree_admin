import * as ActionType from "./liveTv.type";
import { baseURL, secretKey } from "../../util/config";
import axios from "axios";
import { Toast } from "../../util/Toast_";
import { useHistory } from "react-router-dom";
import { apiInstanceFetch } from "../../util/api";

export const getCountry = () => (dispatch) => {
  apiInstanceFetch
    .get("countryLiveTV")
    .then((res) => {
     
      dispatch({
        type: ActionType.GET_COUNTRY,
        payload: res.countryLiveTV,
      });
    })
    .catch((error) => console.log(error));
};

export const getLiveTvData = (country) => (dispatch) => {
  
  console.log("country", country);
  //   const request = {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json", key: secretKey },
  //   };
  //   fetch(
  //     `${baseURL}countryLiveTV/getStoredetails?countryName=${country}`,
  //     request
  //   )
  //     .then((response) => response.json())
  //     .then((res) => {
  //       console.log(res);
  //       dispatch({ type: ActionType.GET_LIVE_TV, payload: res });
  //     })
  //     .catch((error) => console.log(error));

  apiInstanceFetch
    .get(`countryLiveTV/getStoredetails?countryName=${country}`)
    .then((res) => {
      
      dispatch({ type: ActionType.GET_LIVE_TV, payload: res.streamData });
    })
    .catch((error) => console.log(error));
};

// create live channel
export const createLiveChannel = (data) => (dispatch) => {
  
  axios
    .post("stream/create", data)
    .then((res) => {
     
      if (res.data.status) {
        dispatch({ type: ActionType.CREATE_LIVE_TV, payload: res.data.stream });
        Toast("success", res.data.message);

      
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// admin CreateLiveChannel Get
export const getAdminCreateLiveTv = () => (dispatch) => {
  apiInstanceFetch
    .get("stream")
    .then((res) => {
   
      dispatch({
        type: ActionType.GET_LIVE_TV_CREATE_BY_ADMIN,
        payload: res.stream,
      });
    })
    .catch((error) => console.log(error));
};

// edit live tv channel

export const updateLiveTvChannel = (id, formData) => (dispatch) => {
  axios
    .patch(`stream/update?streamId=${id}`, formData)
    .then((res) => {
    
      if (res.data.status) {
        Toast("success", res.data.message);
        dispatch({
          type: ActionType.EDIT_LIVETV_CHANNEL,
          payload: { data: res.data.stream, id: id },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

export const deleteLiveChannel = (id) => (dispatch) => {
  axios
    .delete(`stream/delete?streamId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.DELETE_LIVETV_CHANNEL, payload: id });
        Toast("success", res.data.message);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

// create manual live tv

// create live channel
export const createManualLiveChannel = (data) => (dispatch) => {
  
  axios
    .post("stream/manualCreate", data)
    .then((res) => {
      
  
      if (res.data.status) {
        dispatch({ type: ActionType.CREATE_LIVE_TV, payload: res.data.stream });
        Toast("success", res.data.message);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getFlag = () => (dispatch) => {

  apiInstanceFetch
    .get("flag")
    .then((res) => {
    
      
      dispatch({type:ActionType.GET_FLAG ,payload:res.flag})
    })
    .catch((error) => {
      console.log(error);
    });
};
