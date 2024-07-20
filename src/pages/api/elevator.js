// pages/api/elevator.js
export default async function handler(req, res) {
    console.log("들어옴",req.body)
    try {
      const apiKey = process.env.SEOUL_API_KEY;  // 환경 변수에서 API 키를 가져옵니다.
      //const url = 'http://openapi.seoul.go.kr:8088/sample/xml/CardSubwayStatsNew/1/5/20220301';  // API URL
      const url = `http://openapi.seoul.go.kr:8088/${process.env.SEOUL_API_KEY}/json/tbTraficElvtr/1/643/`
  
      const response = await fetch(url);  // API 호출
      if (!response.ok) {
        console.log('안됨')
        throw new Error('Network response was not ok');  // 네트워크 오류 처리
      }

      //console.log('응답:', response)
      const data = await response.json();  // JSON 응답을 객체로 변환
      console.log('응답',data);
      console.log('테스트',data.tbTraficElvtr);

      // 데이터 가공
      let my_result = [{}]


      res.status(200).json(data);  // 클라이언트에게 JSON 응답 전송
    } catch (error) {
      console.error('Failed to fetch data:', error);  // 오류 로깅
      res.status(500).json({ error: 'Failed to fetch data' });  // 오류 응답
    }
  }
  