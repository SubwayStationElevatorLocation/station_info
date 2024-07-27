'use client'

// pages/index.js (or pages/home.js)

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import KakaoMap from "@/components/kakao_map/kakao_map";
import { station_number } from "@/utils/data";

export default function Home() {
  const [data, setData] = useState(null);
//  const my_result = data ? processResult() : [];
  const [gptInput, setGptInput] = useState('');
  const [answer, setAnswer] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/elevator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ location: '서울' }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result = await response.json();

        result.forEach(item => {
          station_number.forEach(station => {
            if (station.lat === item.latitude && station.lon === item.longitude) {
              item.information = `${item.information} ${station.num}번 출구`;
            }
          });
        });
        //result[0].information = result[0].information + 'n번 출구'

        // 받은 result에 information + x번 출구
        console.log("테스트",result)
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    // const processResult = async () => {
    //   console.log('Data:', data); // 데이터 확인용 로그
    //   if (!data || !data.length) {
    //     return []; // 데이터가 없으면 빈 배열 반환
    //   }
  
    //   return data.map(item => ({
    //     NODE_WKT: item.NODE_WKT,
    //     SGG_NM: item.SGG_NM,
    //     SBWY_STN_CD: item.SBWY_STN_CD,
    //     SBWY_STN_NM: item.SBWY_STN_NM,
    //     Latitude: item.Latitude, // 위도
    //     Longitude: item.Longitude // 경도
    //   }));
    // };
    
    fetchData();

  }, [])

  const hGptSubmit = async (e) =>{
    e.preventDefault();
    console.log('gpt버튼 눌림')
    if(!gptInput) return;

    let system_json = JSON.stringify(data)
    
    // input과 data.information을 이용해서 곂치는 부분만 새로운 state에 담는다(지도표시)


    try{
      const res = await fetch('api/gpt', {
        method:'POST',
        headers:{'Content-Type' : 'application/json'},
        body: JSON.stringify({
          // system_content에 객체배열을 전달
            system_content:system_json,
            user_prompt: gptInput
          })      
        });

      if(!res.ok){
        throw new Error('gpt응답 에러')
      }

      const data = await res.json();
      setAnswer(prev=> [...prev, data.answer]);   // 뒤에 추가
    }catch(error){
      console.log(error)
    }finally{
      setGptInput('')
    }
  }

  return (
    <div className={styles.homeContainer}>
      <div className={styles.inputContent}>
      <h2>서울 지하철역 엘리베이터 위치 안내</h2>
        <form onSubmit={hGptSubmit}>
          <label htmlFor="station-input">▶</label>
          <input type="text" id="station-input" 
          placeholder="지하철역을 입력하세요"
          onChange={(e)=>setGptInput(e.target.value)} value={gptInput}/>
            <button type="submit" className={styles.gptButton}>검색</button>
        </form>
        {data ? <p>{data.message}</p> : <p>Loading...</p>}
      </div>
      <div className={styles.contentFlex}>
        <div className={styles.mapContent}>
          <KakaoMap data={data}/>
        </div>
        <div className={styles.gptContent}>
          <ul>
            {
              answer && answer.map(
                (item, index)=>{
                  return(
                    <li>{item}</li>
                  )
                }
              )
            }
          </ul>
        </div>
      </div>
      <div>
        {data ? (
          <div>

            <ul>
              {data.map((item, index) => (
                <li key={index}>
                  <p>Latitude: {item.latitude}</p>
                  <p>Longitude: {item.longitude}</p>
                  <p>지역명: {item.city_name}</p>
                  <p>지하철역: {item.subway_name}</p>
                  <p>정보: {item.information}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>데이터 없음</p>
        )}
      </div>
    </div>
  );
}
