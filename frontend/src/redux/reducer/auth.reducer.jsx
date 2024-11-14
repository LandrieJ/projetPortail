import { ME_FAIL, ME_REQUEST, ME_SUCESS } from "../constant/auth.constant";

export const authReducer = (state = {}, action) => {
    switch (action.type) {
        case ME_REQUEST:
            return{
                loading: true
            };
        case ME_FAIL:
            return{
                loading: false,
                error: action.payload
            };
        case ME_SUCESS:
            return{
                loading: false,
                me: action.payload
            };
        default:
            return state;
    }
}