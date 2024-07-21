'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import KakaoMap from "@/components/kakao_map/kakao_map";

export default function Home() {
  const [data, setData] = useState(null);
  const [gptInput, setGptInput] = useState('');
  const [answer, setAnswer] = useState([]);

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

  const hGptSubmit = async (e) =>{
    e.preventDefault();
    console.log('gpt버튼 눌림')
    if(!gptInput) return;

    let system_prev = ['입력한 지하철역 이름에 대해서 엘리베이터가 위치한 지하철역 이름과 출구 번호를 알려줘',
      data
    ]
    
    // input과 data.information을 이용해서 곂치는 부분만 새로운 state에 담는다(지도표시)


    try{
      const res = await fetch('api/gpt', {
        method:'POST',
        headers:{'Content-Type' : 'application/json'},
        body: JSON.stringify({
          // system_content에 객체배열을 전달
            system_content:system_prev,
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
          <label for="station-input">▶</label>
          <input type="text" id="station-input" 
          placeholder="지하철역을 입력하세요"
          onChange={(e)=>setGptInput(e.target.value)} value={gptInput}/>
            <button type="submit" className={styles.gptButton}>검색</button>
        </form>
        {data ? <p>{data.message}</p> : <p>Loading...</p>}
      </div>
      <div className={styles.contentFlex}>
        <div className={styles.mapContent}>
          <KakaoMap/>
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
    </div>
  );
}
