import Anime from "../models/Anime.js";

const getAnimes = async (req, res, next) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
  
    const startIndex = (parsedPage - 1) * parsedLimit;
    const endIndex = parsedPage * parsedLimit;
  
    const result = {};
    
    const allAnimes = await Anime.find({});
  
    if (startIndex > 0) {
      result.previous = {
        page: parsedPage - 1,
        limit: parsedLimit,
      };
    }
  
    if (endIndex < allAnimes.length) {
      result.next = {
        page: parsedPage + 1,
        limit: parsedLimit,
      };
    }

    result.list = allAnimes.slice(startIndex, endIndex);
    res.send(result);
  } catch (err) {
    next(err);
  }
}

export default {
  getAnimes,
}