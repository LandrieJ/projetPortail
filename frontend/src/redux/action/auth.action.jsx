import axios from "axios";
import { ME_REQUEST, ME_SUCESS } from "../constant/auth.constant"

export const getMe = (redirect=null) => async (dispatch) => {
    try {
        const jwt_access = localStorage.getItem('jwt_access');

        dispatch({
            type: ME_REQUEST
        });

        const { data } = await axios.get(`http://localhost:5000/api/v1/auth/me`, {
                                        headers: {
                                            'Authorization': 'Bearer ' + jwt_access
                                        }                            
                                    });
        dispatch(setMe(data));
    } catch (error) {
        // console.log(error.response)
        if(error.response.status === 401 || error.response.status === 404){
            // console.log('ici')
            dispatch(logout(redirect));       
        }
    }
}

export const setMe = (me) => (dispatch) => {
    dispatch({
        type: ME_SUCESS,
        payload: me
    });
}

export const logout = (redirect=null) => (dispatch) => {
    dispatch({
        type: ME_REQUEST
    });
    
    localStorage.removeItem("jwt_access");
    
    dispatch({
        type: ME_SUCESS,
        payload: null
    });

    // window.location.href = "/login" + (redirect ? "?redirect=" + redirect : "") 
}