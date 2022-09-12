import axios from "axios";

export const getTourById = async (tourId) => {
    try {
    const {data: [data]} = await axios.get(`https://myguidebackend.onrender.com/tours`, {params: {tour_code: tourId}})
    return data
    } catch (error) {
        throw error.response.data
    }
}

export const getSitesByTour = async (siteArray) => {
    const {data} = await axios.get(`https://myguidebackend.onrender.com/sites`, {params: {site_id: [siteArray]}})
    return data
}

export const fetchSites = async (author_id) => {
    try {
        const data = await axios.get(`https://myguidebackend.onrender.com/sites`, {params: {author_id}})
    return data;
    } catch (error) {
    return error.response.data
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

export const addNewSite = async (newSiteData) => {

  try {
    const site = await axios.post(
      `https://myguidebackend.onrender.com/sites/`,
      newSiteData
    );
    return site.data;
  } catch (error) {
    throw error.response.data;
  }
};