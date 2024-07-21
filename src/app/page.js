'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import KakaoMap from "@/components/kakao_map/kakao_map";

export default function Home() {
  const[data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await fetch('/api/elevator',{
          method:'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({location:'서울'}),
        });
        if(!response.ok){
          throw new Error('Network response was not ok')
        }
        const result = await response.json();
        setData(result);
      } catch (error){
        console.error('Failed to fetch data', error);
      }
    };

    fetchData();
  }, [])

  return (
    <div className={styles.homeContainer}>
      <div className={styles.inputContent}>
        <h2>서울 지하철역 엘리베이터 위치검색</h2>
        <label for="station-input">▶</label>
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
    </div>
  );
}
