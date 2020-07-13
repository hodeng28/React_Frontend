import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import BookingCancel from "../../Molecules/BookingCancel";
import PopupNotice from "../../Molecules/PopupNotice";
import ModalPortal from "../../../Modules/ModalPortal";
import { numWithComma } from "../../../Utils/util";
import "./style/BookingHistoryWrap.scss";

const BookingHistoryWrap = () => {
  /* 예매내역 */
  const { bookingHistory } = useSelector((state) => ({
    bookingHistory: state.userInfo.bookingHistory,
  }));

  const { cancelMovies } = useSelector((state) => ({
    cancelMovies: state.userInfo.cancelMovies,
  }));

  const [useInfo, setUseInfo] = useState({ open: false });

  const openUseInfo = () => {
    setUseInfo({
      open: !useInfo.open,
    });
  };

  /* 모달 팝업 */
  const [modal, text, event, w, h] = useSelector((state) => {
    const Modal = state.modal;
    return [Modal.modal, Modal.text, Modal.event, Modal.width, Modal.height];
  });

  const now = new Date();

  const getSelectTerm = (now, term) => {
    let _now = new Date(now);
    let year = now.getFullYear();
    let month = now.getMonth();
    let date = now.getDate();
    let selectTerm = "";

    if (term === 7) {
      year =
        now.getMonth() === 0 && now.getDate() <= 7
          ? now.getFullYear() - 1
          : now.getFullYear();
      month =
        now.getDate() <= 7
          ? now.getMonth()
            ? now.getMonth()
            : 12
          : now.getMonth() + 1;
      _now.setDate(now.getDate() - term);
      date = _now.getDate();
    } else {
      year = now.getMonth() < term ? now.getFullYear() - 1 : now.getFullYear();
      _now.setMonth(now.getMonth() - term);
      month = _now.getMonth() + 1;
      date = now.getDate();
    }
    selectTerm = `${year}/${month < 10 ? "0" + month : month}/${
      date < 10 ? "0" + date : date
    }`;
    console.log(selectTerm);
    return selectTerm;
  };
  const [_bookingHistory, set_BookingHistory] = useState(bookingHistory);
  console.log(_bookingHistory);

  const selectTerm = (now, term) => {
    set_BookingHistory(
      bookingHistory.filter(
        (booking) =>
          Date.parse(getSelectTerm(now, term)) < Date.parse(booking.paymentDate)
      )
    );
  };

  return (
    <div className="bookingHistoryWrap">
      <h3 className="mypageTitle">예매내역</h3>
      <section className="bookingHistory">
        <div className="bookingCondition">
          <span>조회기간</span>
          <div className="btnTermSorting">
            <button
              type="button"
              className={["btn", "small", "fill", "white"].join(" ")}
              onClick={() => selectTerm(now, 7)}
            >
              1주일
            </button>
            <button
              type="button"
              className={["btn", "small", "fill", "white"].join(" ")}
              onClick={() => selectTerm(now, 1)}
            >
              1개월
            </button>
            <button
              type="button"
              className={["btn", "small", "fill", "white"].join(" ")}
              onClick={() => selectTerm(now, 3)}
            >
              3개월
            </button>
            <button
              type="button"
              className={["btn", "small", "fill", "white"].join(" ")}
              onClick={() => selectTerm(now, 6)}
            >
              6개월
            </button>
          </div>
        </div>
        <p className="listCounter">
          총<span>{_bookingHistory.length}</span>건
        </p>
        <ul className="movieList">
          {bookingHistory.length ? (
            _bookingHistory.map((booking) => (
              <li key={booking.id}>
                <article className="movieItem">
                  <div className="poster">
                    <img
                      src={booking.poster}
                      alt={[booking.title, "포스터"].join(" ")}
                    />
                  </div>
                  <ul className={["info", "clearfix"].join(" ")}>
                    <li className="bookingNumber">
                      <h5>예매번호</h5>
                      <p>{booking.ticketNumber}</p>
                    </li>
                    <li className="title">
                      <h5>영화명</h5>
                      <p>{booking.title}</p>
                    </li>
                    <li className="theater">
                      <h5>극장/상영관</h5>
                      <p>
                        {booking.theater} / {booking.screeningHall}
                      </p>
                    </li>
                    <li className="peopleCounter">
                      <h5>관람인원</h5>
                      <p>{booking.attendance}</p>
                    </li>
                    <li className="viewingDate">
                      <h5>관람일시</h5>
                      <p>
                        {booking.date} ({booking.time})
                      </p>
                    </li>
                    <li className="viewingSeat">
                      <h5>관람좌석</h5>
                      <p>{booking.seats}</p>
                    </li>
                    <li className="paymentDate">
                      <h5>결제일시</h5>
                      <p>
                        {booking.paymentDate} ({booking.paymentTime})
                      </p>
                    </li>
                    <li className="btnWrap">
                      <button
                        type="button"
                        className={["btn", "fill", "small", "main"].join(" ")}
                      >
                        교환권출력
                      </button>
                      <BookingCancel
                        classSet={["btn", "fill", "small", "darkGray"].join(
                          " "
                        )}
                      />
                    </li>
                  </ul>
                </article>
              </li>
            ))
          ) : (
            <li className="listNull" key={bookingHistory.length}>
              리스트가 없습니다.
            </li>
          )}
        </ul>
        {modal && (
          <ModalPortal>
            <PopupNotice
              text={text}
              onEvent={event}
              popupSize={{
                width: w,
                height: h,
              }}
            />
          </ModalPortal>
        )}
      </section>
      <section className="bookingCancel">
        <div className="subTitleWrap">
          <h4 className="titleText">예매취소내역</h4>
        </div>
        <p className="bullet">
          상영일 기준 7일간 취소내역을 확인하실 수 있습니다.
        </p>
        <table cellPadding="0" cellSpacing="0" className="cancelList">
          <thead>
            <tr>
              <th>취소일시</th>
              <th>영화명</th>
              <th>극장</th>
              <th>상영일시</th>
              <th>취소금액</th>
            </tr>
          </thead>
          <tbody>
            {cancelMovies.length ? (
              cancelMovies.map((cancelMovie) => (
                <tr key={cancelMovie.id}>
                  <td>
                    {cancelMovie.cancelDate} ({cancelMovie.cancelTime})
                  </td>
                  <td>{cancelMovie.title}</td>
                  <td>{cancelMovie.theater}</td>
                  <td>
                    {cancelMovie.date} {cancelMovie.time}
                  </td>
                  <td>{numWithComma(String(cancelMovie.price))}원</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">취소내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        <ul className="paging">
          <li>
            <Link to="">1</Link>
          </li>
        </ul>
      </section>
      <section className="useInfo">
        <button
          type="button"
          className={["btn", "regular", "fill", "white"].join(" ")}
          onClick={openUseInfo}
        >
          이용안내
          <span className={["icon", "arrowBottom"].join(" ")}></span>
        </button>
        <div
          className={
            useInfo.open ? ["explanation", "open"].join(" ") : "explanation"
          }
        >
          <h4>[예매안내]</h4>
          <ul className="bullet">
            <li>
              만 4세(48개월)이상부터는 영화티켓을 반드시 구매하셔야 입장
              가능합니다.
            </li>
            <li>예매 변경은 불가능하며, 취소 후 재 예매를 하셔야만 합니다.</li>
            <li>
              메가 박스 모바일앱을 이용할 경우 티켓출력없이 모바일티켓을 통해
              바로 입장하실 수 있습니다.
            </li>
          </ul>
          <h4>[티켓교환 안내]</h4>
          <ul className="bullet">
            <li>
              극장의 무인발권기(KIOSK)를 통해 예매번호 또는
              고객확인번호(생년월일+휴대폰번호)를 입력하여 편리하게 티켓을
              발권하실 수 있습니다.
            </li>
            <li>
              무인발권기 이용이 어려우신경우, 티켓교환권을 출력하여 매표소에
              방문하시면 티켓을 발권하실 수 있습니다.
            </li>
            <li>
              (티켓교환권 출력이 어려운경우 예매번호와 신분증을 지참하여
              매표소에 방문하시면 티켓을 발권하실 수 있습니다)
            </li>
          </ul>
          <h4>[예매취소 안내]</h4>
          <ul className="bullet">
            <li>
              온라인(홈페이지/모바일) 예매 취소는 상영시간 20분전까지 입니다.
            </li>
            <li>
              위탁 예매 사이트 이용 시 취소 및 환불 규정은 해당 사이트 규정을
              따릅니다.
            </li>
            <li>
              LIVE 공연 콘텐트는 취소 기준은 아래와 같습니다.
              <ul className="bullet">
                <li>관람 4일전 : 취소 가능</li>
                <li>관람 3일 ~ 1일전 : 취소 수수료 부담 후 취소 가능</li>
                <li>관람 당일 : 취소 및 환불 불가</li>
              </ul>
            </li>
            <li>공연 관람시 시작 시간 이후에는 입장이 제한 됩니다.</li>
            <li>
              발권된 티켓은 상영시간 전까지 현장 방문 시에만 취소가 가능합니다.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default BookingHistoryWrap;
