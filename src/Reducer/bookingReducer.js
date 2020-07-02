import { select, put, call, takeLatest } from "redux-saga/effects";

const SUCCESS = "booking/SUCCESS";
const ERROR = "booking/ERROR";
const LOADING = "booking/LOADING";

const SET_SELECTED_DATE = "booking/SELECTED_DATE";
const SET_SELECTED_HOUR = "booking/SELECTED_HOUR";
const SET_SELECTED_REGION = "booking/SELECTED_REGION";
const SET_SELECTED_THEATERS = "booking/SELECTED_THEATER";

const SELECT_THEATER = "booking/SELECT_THEATER";
const GET_SCHEDULES = "booking/GET_SCHEDULES";

const setSelectedDate = (date) => ({ type: SET_SELECTED_DATE, date });
const setSelectedHour = (hour) => ({ type: SET_SELECTED_HOUR, hour });
const setSelectRegion = (region) => ({ type: SET_SELECTED_REGION, region });
const setSelectTheaters = (theaters) => ({
  type: SET_SELECTED_THEATERS,
  theaters,
});

const selectTheater = (theater) => ({ type: SELECT_THEATER, theater });

function* selectTheaterSaga(action) {
  let selectedTheaters = yield select();
  selectedTheaters = selectedTheaters.Booking.selectedOption.selectedTheathers;

  let newSelectedTheaters = [];

  // 이미 리스트에 있다면 상태에서 빼고, 없다면 넣는다. 3개이상 못들어간다.
  if (selectedTheaters.includes(action.theater)) {
    newSelectedTheaters = selectedTheaters.filter(
      (theater) => theater !== action.theater
    );
  } else {
    if (selectedTheaters.length === 3) return;

    newSelectedTheaters = selectedTheaters.slice();
    newSelectedTheaters.push(action.theater);
  }

  yield put(setSelectTheaters(newSelectedTheaters));
}

function* bookingSaga() {
  yield takeLatest(SELECT_THEATER, selectTheaterSaga);
}

const initialState = {
  selectedOption: {
    selectedDate: "",
    selectedRegion: "",
    selectedTheathers: [],
    selectedMovieTitle: ["살아있다", "결백"],
    movieAgeGrade: "All",
    screenHall: "2관",
    selectedHour: "19",
    selectedTime: "19:40",
    endTime: "",
    seletedSeat: [],
  },
  ticket: {
    selectedDate: "2020-07-10",
    selectedTheather: "강남",
    selectedMovieTitle: "살아있다",
    movieAgeGrade: "All",
    screenHall: "2관",
    seletedTime: "19:40",
    endTime: "",
    seats: [],
    ticketType: {
      adult: 0,
      teen: 0,
      preferential: 0,
    },
    price: 0,
  },
  movies: [
    {
      id: 1,
      name_kor: "테스트 영화",
      name_eng: "test movie 1",
      running_time: "90",
      genre: null,
      rank: 9999,
      acc_audience: 1234,
      reservation_rate: 0.1,
      open_date: "2020-06-28",
      grade: "청소년관람불가",
      description: "테스트 영화",
      poster:
        "https://caloculator-s3.s3.ap-northeast-2.amazonaws.com/media/posters/django_unchained.jpg",
      trailer:
        "https://caloculator-s3.s3.ap-northeast-2.amazonaws.com/media/trailers/DJANGO_UNCHAINED_-_Official_International_Trailer-_iH0UBYDI4g.mp4",
    },
    {
      id: 2,
      name_kor: "테스트2",
      name_eng: "test2",
      running_time: "100",
      genre: null,
      rank: 9998,
      acc_audience: 12345,
      reservation_rate: 0.1,
      open_date: "2020-07-01",
      grade: "전체관람가",
      description: "test2",
      poster:
        "https://caloculator-s3.s3.ap-northeast-2.amazonaws.com/media/posters/django_unchained.jpg",
      trailer: null,
    },
    {
      id: 3,
      name_kor: "#살아있다",
      name_eng: "#ALIVE",
      running_time: "97",
      genre: null,
      rank: 1,
      acc_audience: 1194980,
      reservation_rate: 63.2,
      open_date: "2020-06-24",
      grade: "15세이상관람가",
      description: "",
      poster:
        "https://caloculator-s3.s3.ap-northeast-2.amazonaws.com/media/posters/django_unchained.jpg",
      trailer: null,
    },
    {
      id: 4,
      name_kor: "결백",
      name_eng: "Innocence",
      running_time: "110",
      genre: null,
      rank: 2,
      acc_audience: 742917,
      reservation_rate: 13.5,
      open_date: "2020-06-10",
      grade: "15세이상관람가",
      description: "",
      poster:
        "https://caloculator-s3.s3.ap-northeast-2.amazonaws.com/media/posters/django_unchained.jpg",
      trailer: null,
    },
    {
      id: 5,
      name_kor: "온워드: 단 하루의 기적",
      name_eng: "Onward",
      running_time: "102",
      genre: null,
      rank: 3,
      acc_audience: 296931,
      reservation_rate: 8.7,
      open_date: "2020-06-17",
      grade: "전체관람가",
      description: "",
      poster:
        "https://caloculator-s3.s3.ap-northeast-2.amazonaws.com/media/posters/django_unchained.jpg",
      trailer: null,
    },
    {
      id: 6,
      name_kor: "배트맨 비긴즈",
      name_eng: "Batman Begins",
      running_time: "134",
      genre: null,
      rank: 4,
      acc_audience: 902295,
      reservation_rate: 2.6,
      open_date: "2005-06-24",
      grade: "12세관람가",
      description: "",
      poster:
        "https://caloculator-s3.s3.ap-northeast-2.amazonaws.com/media/posters/django_unchained.jpg",
      trailer: null,
    },
    {
      id: 7,
      name_kor: "사라진 시간",
      name_eng: "ME AND ME",
      running_time: "104",
      genre: null,
      rank: 5,
      acc_audience: 184401,
      reservation_rate: 2.1,
      open_date: "2020-06-18",
      grade: "15세이상관람가",
      description: "",
      poster:
        "https://caloculator-s3.s3.ap-northeast-2.amazonaws.com/media/posters/django_unchained.jpg",
      trailer: null,
    },
    {
      id: 8,
      name_kor: "위대한 쇼맨",
      name_eng: "The Greatest Showman",
      running_time: "104",
      genre: null,
      rank: 6,
      acc_audience: 1685596,
      reservation_rate: 1.3,
      open_date: "2017-12-20",
      grade: "12세이상관람가",
      description: "",
      poster:
        "https://caloculator-s3.s3.ap-northeast-2.amazonaws.com/media/posters/django_unchained.jpg",
      trailer: null,
    },
    {
      id: 9,
      name_kor: "엔딩스 비기닝스",
      name_eng: "ENDINGS, BEGINNINGS",
      running_time: "110",
      genre: null,
      rank: 7,
      acc_audience: 12429,
      reservation_rate: 1.0,
      open_date: "2020-06-24",
      grade: "15세이상관람가",
      description: "",
      poster:
        "https://caloculator-s3.s3.ap-northeast-2.amazonaws.com/media/posters/django_unchained.jpg",
      trailer: null,
    },
    {
      id: 10,
      name_kor: "야구소녀",
      name_eng: "Baseball Girl",
      running_time: "104",
      genre: null,
      rank: 8,
      acc_audience: 29965,
      reservation_rate: 0.8,
      open_date: "2020-06-18",
      grade: "12세이상관람가",
      description: "",
      poster:
        "https://caloculator-s3.s3.ap-northeast-2.amazonaws.com/media/posters/django_unchained.jpg",
      trailer: null,
    },
    {
      id: 11,
      name_kor: "침입자",
      name_eng: "Intruder",
      running_time: "102",
      genre: null,
      rank: 9,
      acc_audience: 530661,
      reservation_rate: 0.7,
      open_date: "2020-06-04",
      grade: "15세이상관람가",
      description: "",
      poster:
        "https://caloculator-s3.s3.ap-northeast-2.amazonaws.com/media/posters/django_unchained.jpg",
      trailer: null,
    },
    {
      id: 12,
      name_kor: "콜 미 바이 유어 네임",
      name_eng: "Call Me by Your Name",
      running_time: "131",
      genre: null,
      rank: 10,
      acc_audience: 224881,
      reservation_rate: 0.5,
      open_date: "2018-03-22",
      grade: "청소년관람불가",
      description: "",
      poster:
        "https://caloculator-s3.s3.ap-northeast-2.amazonaws.com/media/posters/django_unchained.jpg",
      trailer: null,
    },
  ],
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_DATE:
      return {
        ...state,
        selectedOption: {
          ...state.selectedOption,
          selectedDate: action.date,
        },
      };
    case SET_SELECTED_HOUR:
      return {
        ...state,
        selectedOption: {
          ...state.selectedOption,
          selectedHour: action.hour,
        },
      };
    case SET_SELECTED_REGION:
      return {
        ...state,
        selectedOption: {
          ...state.selectedOption,
          selectedRegion: action.region,
        },
      };
    case SET_SELECTED_THEATERS:
      return {
        ...state,
        selectedOption: {
          ...state.selectedOption,
          selectedTheathers: action.theaters,
        },
      };
    case SUCCESS:
    case ERROR:
    case LOADING:
    default:
      return state;
  }
};

export {
  bookingReducer,
  bookingSaga,
  setSelectedDate,
  setSelectedHour,
  setSelectRegion,
  setSelectTheaters,
  selectTheater,
};
