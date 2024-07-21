'use client'

// pages/index.js (or pages/home.js)

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import KakaoMap from "@/components/kakao_map/kakao_map";

export default function Home() {
  const [data, setData] = useState(null);
//  const my_result = data ? processResult() : [];

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

        result[0].information = result[0].information + 'n번 출구'

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

  // 데이터 가공 함수

  

  // 데이터가 유효할 때만 processResult 함수 호출

  return (
    <div className={styles.homeContainer}>
      <div className={styles.inputContent}>
        <h2>서울 지하철역 엘리베이터 위치검색</h2>
        <label htmlFor="station-input">▶</label>
        <input type="text" id="station-input"/>
        {data ? <p>{data.message}</p> : <p>Loading...</p>}
      </div>
      <div className={styles.contentFlex}>
        <div className={styles.mapContent}>
          <KakaoMap/>
        </div>
        <div className={styles.gptContent}>
          <ul>
            <li>리스트1</li>
            <li>리스트2</li>
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
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
