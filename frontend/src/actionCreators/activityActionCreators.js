import axios from "axios";
import { FETCH_ALL_ACTIVITY_ERROR, FETCH_ALL_ACTIVITY_RESPONSE } from ".";

/** 
* Fetch all portfolio asset
* @param {String} code the code representation of the crypto asset: e.g. Bitcoin's would be 'btc', Ethereum's would be 'eth', Stellar Lumens would be 'xlm', etc.
* @returns 
*/
export const fetchAllActivity = () => async dispatch => await axios
    .get('http://localhost:8081/api/all-activity')
    .then(async resp => {
        const payload = await resp.data;
        dispatch({ type: FETCH_ALL_ACTIVITY_RESPONSE, payload })
    })
    .catch(err => dispatch({ type: FETCH_ALL_ACTIVITY_ERROR, payload: console.log(err) }))