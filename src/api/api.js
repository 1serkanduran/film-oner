import axios from "axios";

const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

const getGenreByMood = (mood) => {
  switch (mood) {
    // Mood'a göre genre id'lerini döndüren mevcut switch-case yapısı
    case "Mutlu":
      return "35";
    case "Heyecanlı":
      return "53";
    case "Romantik":
      return "10749";
    case "Komik":
      return "35";
    case "Meraklı":
      return "99";
    case "Korkulu":
      return "27";
    case "Melankolik":
      return "18";
    case "Hüzünlü":
      return "10751";
    case "Sakin":
      return "18";
    case "Kasvetli":
      return "9648";
    case "Tuhaf":
      return "878";
    case "Hayalperest":
      return "878";
    case "Maceraperest":
      return "12";
    case "Aksiyon Dolu":
      return "28";
    case "Duygusal":
      return "10751";
    case "Vurdulu Kırdılı":
      return "10752";
    case "Tarihsel":
      return "36";
    case "Sanatsal":
      return "10402";
    default:
      return ""; // Belirtilen duygu için uygun tür bulunamadıysa boş dize döndür
  }
};

const getMoviesByMood = async (mood, pageCount = 5) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie`,
      {
        params: {
          api_key: API_KEY,
          with_genres: getGenreByMood(mood),
          sort_by: "popularity.desc",
          language: "tr-TR",
          page: 1
        },
      }
    );
    const totalPages = response.data.total_pages % 500;
    const startPage = Math.floor(Math.random() * (totalPages - pageCount)) + 1;

    const requests = [];
    for (let page = startPage; page < startPage + pageCount; page++) {
      requests.push(
        axios.get(`https://api.themoviedb.org/3/discover/movie`, {
          params: {
            api_key: API_KEY,
            with_genres: getGenreByMood(mood),
            sort_by: "popularity.desc",
            language: "tr-TR",
            page: page,
          },
        })
      );
    }

    const responses = await Promise.all(requests);
    const allResults = responses.flatMap(response => response.data.results);

    return allResults;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

const getMovieVideos = async (movieId) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    const data = await response.data;
    if (!data.results.length) {
      console.error("Filmin videosu bulunamadı!");
      return null;
    }
    return data.results[0].key;
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    return null;
  }
};


const getMovieReviews = async (movieId) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/reviews`,
      {
        params: {
          api_key: API_KEY,
        },
      }
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movie reviews:", error);
    return [];
  }
};


export { getMoviesByMood, getMovieVideos, getMovieReviews };