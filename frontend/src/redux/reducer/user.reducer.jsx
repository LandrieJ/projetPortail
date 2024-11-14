import {  SESSION_FAIL, SESSION_REQUEST, SESSION_SUCCESS } from "../constant/user.constant";

export const myPointingListReducer = (state={}, action) => {
    switch (action.type) {
        case MY_POINTING_LIST_REQUEST:
            return{
                loading: true
            }
        case MY_POINTING_LIST_SUCCESS:
            return{
                loading: false,
                pointings: action.payload
            }
        case MY_POINTING_LIST_FAIL:
            return{
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
}

export const sessionReducer = (state={}, action) => {
    switch (action.type) {
        case SESSION_REQUEST:
            return {
                loading: true
            };
        case SESSION_SUCCESS:
            return {
                loading: false,
                pointing: action.payload
            };
        case SESSION_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
}