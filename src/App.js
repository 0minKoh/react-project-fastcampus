import './App.css';
import './scss/App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GeoAlt, Map, Star, StarFill } from 'react-bootstrap-icons';
import { Dropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';

function App() {
  let navigate = useNavigate()
  
  let [myLocation, setMyLocation] = useState(false)
  let [entire, setEntire] = useState(true)
  let [pinTab, setPinTab] = useState(false)

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Main></Main>}></Route>
        <Route path='/mylocation' element={<h1>this is option</h1>}></Route>
        <Route path='/pin' element={<Pin></Pin>}></Route>
      </Routes>
      <footer>
        {/* this is tab */}
        <div className="fixed-bottom shadow-lg bg-white">
          <div className="container">
            <div className="d-flex justify-content-between">
              <div className={`pt-3 px-5 tab1 ${myLocation ? 'bg-light' : 'bg-white'}`} onClick={() => {navigate('/mylocation'); setMyLocation(true); setEntire(false); setPinTab(false);}}>
                <div className="icon text-center mb-2">
                  <GeoAlt size={32}></GeoAlt>
                </div>
                <p>내 지역보기</p>
              </div>
              <div className={`pt-3 px-5 tab2 ${entire ? 'bg-light' : 'bg-white'}`} onClick={() => {navigate('/'); setMyLocation(false); setEntire(true); setPinTab(false);}}>
                <div className="icon text-center mb-2">
                  <Map size={32}></Map>
                </div>
                <p>전체 지도보기</p>
              </div>
              <div className={`pt-3 px-5 tab3 ${pinTab ? 'bg-light' : 'bg-white'}`} onClick={() => {navigate('/pin'); setMyLocation(false); setEntire(false); setPinTab(true);}}>
                <div className="icon text-center mb-2">
                  <StarFill size={32}></StarFill>
                </div>
                <p>즐겨찾기</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function MyLocation() {
  //this is option
}

function Pin() {
  return (
    // add
    <div></div>
  )
}

function Main() {
  let [sidoEl, setSidoEl] = useState('전국');
  let [dataArr, setDataArr] = useState([]) // DataArr[i]['pm10Grade']

  const sidoName = ['전국', '서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '세종'];
  const getParameters = {
    serviceKey: 'aYwUZQT3DhQxK%2BXHxrhqeGPw%2BNLwVCjmXQE7Q1ILJAm%2FcKq0ySgV30%2FnY4iFVrv9Ywn5rVPqmRKpF6sdk7G93A%3D%3D',
    returnType: 'json',
    numOfRows: '20',
    pageNo: '1',
    sidoName: sidoEl,
    ver: '1.0',
  }

  let pin = (el) => {
    return el
  }

  
  fetch(`B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${getParameters['serviceKey']}&returnType=${getParameters['returnType']}&numOfRows=${getParameters['numOfRows']}&pageNo=${getParameters['pageNo']}&sidoName=${getParameters['sidoName']}&ver=${getParameters['ver']}`
  ).then(res => res.json()).then(data => {
    //data['response']['body']['items'][i]['pm10Grade']
    setDataArr(data['response']['body']['items'].slice(0, 20))
  }).catch(e => console.log(e))

  return (
    <div className="App">
      <main>
        <div className="container my-5">
          <div className="dropdown text-center">
            <Dropdown>
              <Dropdown.Toggle variant="none" id="dropdown-basic">
                {sidoEl}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {sidoName.map((el, i) => {
                  return (<Dropdown.Item href="#" onClick={() => {setSidoEl(el)}} key={i}>{el}</Dropdown.Item>)
                })}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="d-flex flex-wrap justify-content-center">
            {dataArr.map((el, i) => {
              // stationName, pm10Value, pm10Grade, dataTime, sidoName
              return (
                <div className={`dust-card p-3 ${(el['pm10Grade'] === '1') ? 'bg-primary' : (el['pm10Grade'] === '2') ? 'bg-success' : (el['pm10Grade'] === '3') ? 'bg-warning' : (el['pm10Grade'] === '4') ? 'bg-danger' : (el['pm10Grade'] === '5') ? 'bg-dark' : 'bg-gray'}`} key = {i}>
                  <div className="d-flex justify-content-between">
                    <div className="text d-flex align-items-end mb-3">
                      <div className="fs-5 me-2">{el['stationName']}</div>
                      <div className="fs-6">{el['sidoName']}</div>
                    </div>
                    <div className="icon icon-star" onClick={() => {pin(el)}}>
                      <Star color='white' size={20}/>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`mb-3 text-box fs-3 bg-white p-2 rounded mx-auto ${(el['pm10Grade'] === '1') ? 'text-primary' : (el['pm10Grade'] === '2') ? 'text-success' : (el['pm10Grade'] === '3') ? 'text-warning' : (el['pm10Grade'] === '4') ? 'text-danger' : (el['pm10Grade'] === '5') ? 'text-dark' : 'text-gray'}`}>
                      {(el['pm10Grade'] === '1') ? '좋음' : 
                      (el['pm10Grade'] === '2') ? '보통' :
                      (el['pm10Grade'] === '3') ? '한때나쁨' :
                      (el['pm10Grade'] === '4') ? '나쁨' :
                      (el['pm10Grade'] === '5') ? '매우나쁨' : '알수없음'}
                    </div>
                    <p className='m-0'>미세먼지 수치: <span>{el['pm10Value']}</span></p>
                    <p><span>({el['dataTime']})</span>기준</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
