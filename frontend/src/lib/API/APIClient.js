import axios from "axios";
import useAuthStore from "../store/authStore";

const API_URL='https://personal-finance-tracker-api-2-iee2.onrender.com/api';

const api=axios.create({
    baseURL:API_URL,
    headers:{
        'Content-Type':'application/json'
    }
})

// adding a request interceptor to include auth token
api.interceptors.request.use((config)=>{
    const token=useAuthStore.getState().token;
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
})
export default api;