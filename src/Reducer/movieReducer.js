import { movieApi } from "../Api/api"

const MOVIE_SUCCESS = "movie/SUCCESS";
const MOVIE_ERROR = "movie/ERROR";
const MOVIE_LOADING = "movie/LOADING";

const MOVIE_DETAIL_SUCCESS = "movies/SUCCESS";
const MOVIE_DETAIL_ERROR = "movies/ERROR";
const MOVIE_DETAIL_LOADING = "movies/LOADING";

const BOOKING_AGE_RATING_SUCCESS = "ageBooking/SUCCESS"
const BOOKING_AGE_RATING_ERROR = "ageBooking/ERROR"
const BOOKING_AGE_RATING_LOADING = "ageBooking/LOADING"


// const SEARCH_SPACE = "movies/SEARCH_SPACE";
// const ADD_SPACE = "movies/ADD_SPACE";

const setSuccessMovie = (data) => ({ type: MOVIE_SUCCESS, data });
const setLoadingMovie = () => ({ type: MOVIE_LOADING });
const setErrorMovie = (error) => ({ type: MOVIE_ERROR, error });

const setSuccessMovieDetail = (data) => ({ type: MOVIE_DETAIL_SUCCESS, data })
const setLoadingMovieDetail = () => ({ type: MOVIE_DETAIL_LOADING });
const setErrorMovieDetail = (error) => ({ type: MOVIE_DETAIL_ERROR, error });

const setSuccessBookingAgeRating = (id, data) => ({ type: BOOKING_AGE_RATING_SUCCESS, id, data })
const setLoadingBookingAgeRating = () => ({ type: BOOKING_AGE_RATING_LOADING, })
const setErrorBookingAgeRating = (error) => ({ type: BOOKING_AGE_RATING_ERROR, error })


const getMovies = () => async (dispatch) => {
  try {
    dispatch(setLoadingMovie());
    const res = await movieApi.getMovies();
    if (res.status === 200) {
      if (!Array.isArray(res.data.results)) return console.error("배열이 아닙니다.");
      dispatch(setSuccessMovie(res.data.results));
    } else {
      dispatch({
        type: "ERROR",
        error: {
          state: true,
          message: test.statusText,
        },
      });
    }
  } catch (error) {
    dispatch({
      type: "ERROR",
      error: {
        state: true,
        message: error.message,
      },
    });
  }
};

const getMovie = (id) => async (dispatch) => {
  dispatch(setLoadingMovieDetail());
  try {
    const res = await movieApi.getMovie(id);
    if (res.status === 200) {
      dispatch(setSuccessMovieDetail(res.data));
    } else {
      dispatch({
        type: "ERROR",
        error: {
          state: true,
          message: test.statusText,
        },
      });
    }
  } catch (error) {
    dispatch({
      type: "ERROR",
      error: {
        state: true,
        message: error.message,
      },
    });
  }
};

const getAgeBooking = (id) => async (dispatch) => {
  dispatch(setLoadingBookingAgeRating());
  try {
    const res = await movieApi.getAgeBooking(id);
    if (res.status === 200) {
      dispatch(setSuccessBookingAgeRating(id, res.data));
    } else {
      dispatch({
        type: "ERROR",
        error: {
          state: true,
          message: test.statusText,
        },
      });
    }
  } catch (error) {
    dispatch({
      type: "ERROR",
      error: {
        state: true,
        message: error.message,
      },
    });
  }
};

const initialState = {
  page: 0,
  loading: false,
  error: false,
  errorMessage: "",
  movies: [],
  detail: {},
  ageBooking: {},
};

const movieReducer = (state = initialState, action) => {
  switch (action.type) {
    case MOVIE_SUCCESS:
      return {
        ...state,
        loading: false,
        movies: action.data,
        error: null,
        page: action.page
      }
    case MOVIE_ERROR:
      return {
        ...state,
        error: action.error.state,
        errorMessage: action.error.message,
        loading: false
      }
    case MOVIE_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
        page: state.page,
      }
    case MOVIE_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        detail: action.data,
        error: null,
        page: action.page
      }
    case MOVIE_DETAIL_ERROR:
      return {
        ...state,
        error: action.error.state,
        errorMessage: action.error.message,
        loading: false
      }
    case MOVIE_DETAIL_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
        page: state.page,
      }
    case BOOKING_AGE_RATING_SUCCESS:
      return {
        ...state,
        loading: false,
        ageBooking: action.data,
        // page: action.page,
        error: null,
      }
    case BOOKING_AGE_RATING_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
        page: state.page,
      }
    case BOOKING_AGE_RATING_ERROR:
      return {
        ...state,
        error: action.error.state,
        errorMessage: action.error.message,
        loading: false
      }
    default:
      return state;
  }
};

export {
  getMovies,
  getMovie,
  getAgeBooking,
  // getSearch,
  movieReducer,
  setSuccessMovie,
  setLoadingMovie,
  setSuccessMovieDetail,
  setLoadingMovieDetail,
  setErrorMovie,
  setErrorMovieDetail,
  setSuccessBookingAgeRating,
  setErrorBookingAgeRating,
  setLoadingBookingAgeRating
};
