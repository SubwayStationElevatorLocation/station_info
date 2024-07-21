import Script from "next/script";
import { Map, MapMarker } from "react-kakao-maps-sdk";
const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_MAP_KEY}&autoload=false`;
export default function KakaoMap(){
    return(
        <div style={{width:'100%', height:'100%'}}>
            <Script src={KAKAO_SDK_URL} strategy="beforeInteractive" />
            <Map center={{lat:37.559866, lng:126.942444}} style={{width:"100%", height:"100%" }}>

                <MapMarker position={{ lat:37.559866, lng:126.942444 }}>
                    <div style={{color:"#000"}}>Hello World!</div>
                </MapMarker>
            </Map>
        </div>
    )
}
// npm install react-kakao-maps-sdk
// 플랫폼허용 : http://localhost:3000
// 자바스크립트 API키