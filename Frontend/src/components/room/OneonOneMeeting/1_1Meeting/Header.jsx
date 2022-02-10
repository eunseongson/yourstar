import React, { useDispatch, useSelector } from 'react-redux';
import Timer from '../../Timer/Timer';
import styled from 'styled-components';
import { IoIosAlarm, IoMdCreate, IoIosAperture } from 'react-icons/io';
import { pointColor } from '../../../../styles/variables';
import axios from 'axios';

const HeaderBox = styled.div`
  /* border: solid red; */
  margin-bottom: 3vh;
  height: 15vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserBox = styled.div`
  font-size: 3vw;
  width: 12vw;
`;

const StarBox = styled.div`
  font-size: 3vw;
  width: 12vw;
`;

const SignIcon = styled.div`
  position: absolute;
  left: 67.7vw;
  font-size: 2vw;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
    transition: 0.5s;
    color: ${pointColor};
  }
`;
const CaptureIcon = styled.div`
  position: absolute;
  left: 1350px;
  font-size: 2vw;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
    transition: 0.5s;
    color: ${pointColor};
  }
`;

export default function Header() {
  const { me } = useSelector(state => state.mypage);
  const { index, storeSession, subscribers, onebyoneStream } = useSelector(
    state => ({
      index: state.MeetingRoom.index,
      storeSession: state.MeetingRoom.storeSession,
      subscribers: state.MeetingRoom.subscribers,
      onebyoneStream: state.MeetingRoom.onebyoneStream,
    })
  );

  const OPENVIDU_SERVER_URL = 'https://i6e204.p.ssafy.io:8443';
  const OPENVIDU_SERVER_SECRET = 'YOURSTAR';

  const signalToNextUser = idx => {
    console.log('===== 사용자 수 ======', subscribers.length);

    if (idx < subscribers.length) {
      console.log('===== 불러오기 ======');
      const sessionId = storeSession.sessionId;
      const data = {
        session: sessionId.substring(0, sessionId.length - 9), // 1-onebyone 일때 1만 뽑아내기
        to: [subscribers[idx].stream.connection.connectionId],
        type: 'signal:one',
        data: '6',
      };
      axios
        .post(OPENVIDU_SERVER_URL + '/openvidu/api/signal', data, {
          headers: {
            Authorization:
              'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          console.log(response);
        })
        .catch(error => console.error(error));
    }

    // 다시 이전 세션으로 보내기
    if (idx <= subscribers.length && idx > 0) {
      console.log(
        '===== 내보내기 ======',
        onebyoneStream.stream.connection.connectionId
      );
      const sessionId = storeSession.sessionId;

      const data = {
        session: sessionId, // 1-onebyone 일때 1만 뽑아내기
        to: [onebyoneStream.stream.connection.connectionId],
        type: 'signal:oneback',
        data: '0',
      };
      axios
        .post(OPENVIDU_SERVER_URL + '/openvidu/api/signal', data, {
          headers: {
            Authorization:
              'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          console.log(response);
        })
        .catch(error => console.error(error));
    }
  };

  return (
    <>
      <div>
        {/* 일반 유저 */}
        {me.code === 3 && (
          <HeaderBox>
            <UserBox>
              <div>
                <IoIosAlarm
                  style={{
                    float: 'left',
                    marginRight: '20px',
                    marginTop: '12px',
                  }}
                />
                <Timer style={{ float: 'left' }} />
              </div>
            </UserBox>
          </HeaderBox>
        )}
        {/* 스타 */}
        {me.code !== 3 && (
          <HeaderBox>
            <StarBox>
              <div>
                <IoIosAlarm
                  style={{
                    float: 'left',
                    marginRight: '20px',
                    marginTop: '12px',
                  }}
                />
                <Timer style={{ float: 'left' }} />
                {index !== -1 && signalToNextUser(index)}
              </div>
            </StarBox>
            <SignIcon>
              <IoMdCreate />
            </SignIcon>
            <CaptureIcon>
              <IoIosAperture />
            </CaptureIcon>
          </HeaderBox>
        )}
      </div>
    </>
  );
}
