import axios from "axios";

export const getTourById = async (tourId) => {
    const {data} = await axios.get(`https://myguidebackend.onrender.com/tours`)
    //DELETE THIS ONCE TOUR CODE IS QUERYABLE
    return tourId == 123456 ? data[0] 
    : tourId == 654321 ? data[1] : `Sorry, ${tourId} has not been found`
}

export const getSitesByTour = async (siteArray) => {
    const {data} = await axios.get(`https://myguidebackend.onrender.com/sites`, {params: {site_ids: [siteArray]}})
    return data
}

export const fetchSites = async (author_id) => {
    try {
        const data = await axios.get(`https://myguidebackend.onrender.com/sites`, {params: {author_id: author_id}})
    return data;
    } catch (error) {
    throw error.response.data;
  }
};