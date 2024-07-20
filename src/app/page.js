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
    <div>
      {data ? <p>{data.message}</p> : <p>Loading...</p>}
      <KakaoMap/>
    </div>
  );
}
