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
        const data = await axios.get(`https://myguidebackend.onrender.com/sites`, {params: {author_id}})
    return data;
    } catch (error) {
    throw error.response.data;
  }
};

export const fetchSiteById = async (site_Id) => {
    try {
        const site = await axios.get(`https://myguidebackend.onrender.com/sites/${site_Id}`)
    return site.data;
    } catch (error) {
    throw error.response.data;
  }
};

export const updateSiteById = async (site_Id, updateData) => {
    try {
        const site = await axios.patch(`https://myguidebackend.onrender.com/sites/${site_Id}`, updateData)
    return site.data;
    } catch (error) {
    throw error.response.data;
  }
};