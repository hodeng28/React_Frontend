import axios from "axios";
import cookie from "react-cookies";
import BootPay from "bootpay-js";
import { transformDateFormat } from "../Utils/util";
import key from "../key.json";
import { setTicketNumber } from "../Reducer/bookingReducer";

export const refreshValidation = async () => {
  try {
    const refreshToken = cookie.load("refreshToken");
    const newAccessToken = await axios.post(
      "https://www.omegabox.xyz/members/token/refresh/",
      {
        refresh: refreshToken,
      }
    );

    cookie.remove("accessToken", {
      path: "/",
    });
    cookie.save("accessToken", newAccessToken.data.access, {
      path: "/",
    });

    return true;
  } catch (e) {
    return false;
  }
};

export const isLogin = async () => {
  const accessToken = cookie.load("accessToken");

  if (accessToken) return true;

  return await refreshValidation();
};

export const billing = ({
  title,
  price,
  reservations,
  history,
  dispatch,
  username = "오메가맨",
  email = "omegaman@gmail.com",
}) => {
  return BootPay.request({
    price, //실제 결제되는 가격
    application_id: key.applicationId,
    name: `오메가박스 영화티켓-${title}`, //결제창에서 보여질 이름
    // pg: "[[ pg ]]",
    // method: "[[ method ]]", //결제수단, 입력하지 않으면 결제수단 선택부터 화면이 시작합니다.
    show_agree_window: 0, // 부트페이 정보 동의 창 보이기 여부
    items: [
      {
        item_name: `오메가박스 영화티켓-${title}`, //상품명
        qty: 1, //수량
        unique: "123", //해당 상품을 구분짓는 primary key
        price: price, //상품 단가
        cat1: "영화티켓", // 대표 상품의 카테고리 상, 50글자 이내
      },
    ],
    user_info: {
      username,
      email,
      // addr: "사용자 주소",
      // phone: "010-1234-4567",
    },
    order_id: Math.round(Math.random() * 10000), //고유 주문번호로, 생성하신 값을 보내주셔야 합니다.
    // params: {
    //   callback1: "그대로 콜백받을 변수 1",
    //   callback2: "그대로 콜백받을 변수 2",
    //   customvar1234: "변수명도 마음대로",
    // },
    // account_expire_at: "2018-05-25", // 가상계좌 입금기간 제한 ( yyyy-mm-dd 포멧으로 입력해주세요. 가상계좌만 적용됩니다. )
    // extra: {
    //   start_at: "2019-05-10", // 정기 결제 시작일 - 시작일을 지정하지 않으면 그 날 당일로부터 결제가 가능한 Billing key 지급
    //   end_at: "2022-05-10", // 정기결제 만료일 -  기간 없음 - 무제한
    //   vbank_result: 1, // 가상계좌 사용시 사용, 가상계좌 결과창을 볼지(1), 말지(0), 미설정시 봄(1)
    //   quota: "0,2,3", // 결제금액이 5만원 이상시 할부개월 허용범위를 설정할 수 있음, [0(일시불), 2개월, 3개월] 허용, 미설정시 12개월까지 허용
    // },
  })
    .error(function (data) {
      //결제 진행시 에러가 발생하면 수행됩니다.
      console.log("에러", data);
      return data;
    })
    .cancel(function (data) {
      //결제가 취소되면 수행됩니다.
      console.log("취소시", data);
      return data;
    })
    .ready(function (data) {
      // 가상계좌 입금 계좌번호가 발급되면 호출되는 함수입니다.
      console.log(data);
    })
    .confirm(function (data) {
      //결제가 실행되기 전에 수행되며, 주로 재고를 확인하는 로직이 들어갑니다.
      //주의 - 카드 수기결제일 경우 이 부분이 실행되지 않습니다.
      console.log(data);
      const enable = true; // 재고 수량 관리 로직 혹은 다른 처리
      if (enable) {
        BootPay.transactionConfirm(data); // 조건이 맞으면 승인 처리를 한다.
      } else {
        BootPay.removePaymentWindow(); // 조건이 맞지 않으면 결제 창을 닫고 결제를 승인하지 않는다.
      }
    })
    .close(function (data) {
      // 결제창이 닫힐때 수행됩니다. (성공,실패,취소에 상관없이 모두 수행됨)
      console.log("닫힐때", data);
      return data;
    })
    .done(async function (data) {
      //결제가 정상적으로 완료되면 수행됩니다
      //비즈니스 로직을 수행하기 전에 결제 유효성 검증을 하시길 추천합니다.
      const accessToken = cookie.load("accessToken");
      const reservation_id = reservations.reservation_id;
      console.log("예약 검증", data.receipt_id, "예약아이디들", reservations);
      const body = {
        receipt_id: data.receipt_id,
        price,
        reservation_id,
        discount_price: 0, // 나중에 포인트 상태로 수정 필수
      };
      try {
        const res = await axios.post(
          "https://www.omegabox.xyz/reservations/payments/",
          body,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );
        if (res.status === 200 || res.status === 201) {
          dispatch(setTicketNumber(res.data.code));
          history.push("/booking/ticket");
        }
      } catch (e) {
        console.log("검증에러", e.response);
      }
    });
};

export const cancelBilling = async (id, receipt_id, price) => {
  console.log("취소정보", id, receipt_id, price);
  return axios.put(
    `
    https://www.omegabox.xyz/reservations/payments/${id}/cancel/
  `,
    {
      receipt_id,
      price,
    },
    {
      headers: {
        Authorization: "Bearer " + cookie.load("accessToken"),
      },
    }
  );
};

export const movieApi = {
  getMovies: () => axios.get("https://www.omegabox.xyz/movies/"),
  getMovie: (id) => axios.get(`https://www.omegabox.xyz/movies/detail/${id}`),
  getAgeBooking: (id) =>
    axios.get(`https://www.omegabox.xyz/movies/detail/${id}/age-booking/`),
  getSearch: (keyword) =>
    axios.get(`https://www.omegabox.xyz/movies/?searchName=${keyword}`),
  getLikeCheck: (id) =>
    axios.get(`https://www.omegabox.xyz/movies/detail/${id}/like/`),
  getSchedules: ({ date, movies, theaterId }) => {
    let movieIds = "";
    if (movies) {
      movieIds = movies.reduce((acc, cur) => acc + "+" + cur.id, "").slice(1);
    }

    if (date) date = transformDateFormat(date).dateStringNoDash;

    if (date && theaterId && !movies) {
      return axios.get(
        `https://www.omegabox.xyz/theaters/${theaterId}/schedules/${date}`
      );
    } else {
      return axios.get(
        `https://www.omegabox.xyz/theaters/${theaterId}/schedules/${date}/?movies=${movieIds}`
      );
    }
  },
  getScreeningRegions: (date, movies) => {
    let movieIds = "";
    if (movies.length) {
      movieIds = movies.reduce((acc, cur) => acc + "+" + cur.id, "").slice(1);
    }

    const call = `https://www.omegabox.xyz/theaters/schedules/regions/${date}/${
      movies.length ? "?movies=" + movieIds : ""
    }
    `;
    console.log("지역 정보요청 url", call);

    return axios.get(call);
  },
  getScreeningTheaters: async (date, movies) => {
    let movieIds = "";
    if (movies.length) {
      movieIds = movies.reduce((acc, cur) => acc + "+" + cur.id, "").slice(1);
    }
    let call = `https://www.omegabox.xyz/theaters/schedules/${date}/${
      movies.length ? "?movies=" + movieIds : ""
    }
    `;
    console.log("상영관 정보요청 url", movies, call);

    let resTheaters = {
      status: 200,
      data: {
        next: call,
        results: [],
      },
    };
    while (resTheaters.status === 200 && resTheaters.data.next) {
      try {
        const res = await axios.get(resTheaters.data.next);
        console.log(res);
        resTheaters.data.next = res.data.next;
        resTheaters.data.results = [
          ...resTheaters.data.results,
          ...res.data.results,
        ];
      } catch (e) {
        console.log(e.response);
        return {
          status: 400,
        };
      }
    }

    return resTheaters;
  },
  getReservedSeats: (scheduleId) => {
    return axios.get(
      `https://www.omegabox.xyz/theaters/schedules/${scheduleId}/reserved-seats/`
    );
  },
  getTotalPrice: (scheduleId, personalCount) => {
    // 받은 personalCount가 객체가 아닐때
    if (typeof personalCount !== "object")
      return console.error("전달받은 값이 객체가 아닙니다.");
    // 인원별 모든 값이 0일 때 실행 안함.
    if (Object.values(personalCount).every((val) => val === 0))
      return {
        data: {
          total_price: 0,
        },
      };
    const urlString =
      `https://www.omegabox.xyz/theaters/schedules/${scheduleId}/price/?` +
      Object.keys(personalCount)
        .filter((key) => personalCount[key] !== 0)
        .map((key) => `${key}s=${personalCount[key]}`)
        .join("&");
    return axios.get(urlString);
  },
  getSeatId: (scheduleId, seatArr) => {
    console.log(scheduleId, seatArr.join("+"));
    return axios.get(
      `https://www.omegabox.xyz/theaters/schedules/${scheduleId}/seats/?names=${seatArr.join(
        "+"
      )}`
    );
  },
  makeReservation: (scheduleId, seatIdArr, seatPersonalType) => {
    const accessToken = cookie.load("accessToken");
    if (!accessToken) return;
    const seatPersonalTypeArr = [];
    Object.keys(seatPersonalType).forEach((key) => {
      for (let i = 0; i < seatPersonalType[key]; i++) {
        seatPersonalTypeArr.push(key);
      }
    });

    const body = {
      schedule_id: scheduleId,
      grades: seatPersonalTypeArr,
      seat_ids: seatIdArr,
    };

    return axios.post("https://www.omegabox.xyz/reservations/", body, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  },
};

export const userApi = {
  signup: ({ name, id, pw, pwCheck, birth, tell, email }) => {
    return axios.post("https://www.omegabox.xyz/members/signup/", {
      username: id,
      email: email,
      password1: pw,
      password2: pwCheck,
      name: name,
      mobile: tell,
      birth_date: birth,
    });
  },
  googleSignup: ({ username, email, name, mobile, birth_date, unique_id }) => {
    const body = {
      username,
      email,
      name,
      mobile,
      birth_date,
      unique_id,
    };
    console.log("api 호출 직전 유니크아이디", unique_id);
    return axios.post("https://www.omegabox.xyz/members/signup/social/", body);
  },
  login: ({ id, pw }) => {
    return axios.post("https://www.omegabox.xyz/members/login/", {
      username: id,
      password: pw,
    });
  },
  logout: () => {
    return axios.post("https://www.omegabox.xyz/members/logout/");
  },
  socialLogin: ({ email, googleId, token_id }) => {
    return axios.post("https://www.omegabox.xyz/members/login/social/", {
      username: email,
      password: googleId,
      google_id_token: token_id,
    });
  },
  memberDetail: () => {
    return axios.get("https://www.omegabox.xyz/members/detail/", {
      headers: {
        Authorization: `Bearer ${cookie.load("accessToken")}`,
      },
    });
  },
  myReserved: () => {
    return axios.get(`https://www.omegabox.xyz/members/reserved-movies/`, {
      headers: {
        Authorization: `Bearer ${cookie.load("accessToken")}`,
      },
    });
  },
  myReservedCancel: () => {
    return axios.get(
      `https://www.omegabox.xyz/members/reserved-movies/canceled/`,
      {
        headers: {
          Authorization: `Bearer ${cookie.load("accessToken")}`,
        },
      }
    );
  },
  timelineRating: () => {
    return axios.get(`https://www.omegabox.xyz/members/rating-movies/`, {
      headers: {
        Authorization: `Bearer ${cookie.load("accessToken")}`,
      },
    });
  },
  timelineWatched: () => {
    return axios.get(`https://www.omegabox.xyz/members/watched-movies/`, {
      headers: {
        Authorization: `Bearer ${cookie.load("accessToken")}`,
      },
    });
  },
  timelineLike: () => {
    return axios.get(`https://www.omegabox.xyz/members/like-movies/`, {
      headers: {
        Authorization: `Bearer ${cookie.load("accessToken")}`,
      },
    });
  },
  idDoubleCheck: (id) => {
    return axios.post(
      "https://www.omegabox.xyz/members/signup/check-username/",
      {
        username: id,
      }
    );
  },
};
