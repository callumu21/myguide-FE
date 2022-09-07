import axios from "axios";

export const getTourById = async (tourId) => {
    const {data} = await axios.get(`https://myguidebackend.onrender.com/tours`)
    //DELETE THIS ONCE TOUR CODE IS QUERYABLE
    return data[0]
}

export const getSitesById = async () => {
    const {data} = await axios.get(`https://myguidebackend.onrender.com/sites`)
    //DELETE THIS ONCE SITE ID IS QUERYABLE
    return data
}