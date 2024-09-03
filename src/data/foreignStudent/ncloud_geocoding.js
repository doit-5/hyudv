// curl -G "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode"  --data-urlencode "query=경상북도 경산시 대학로 280"   -H "X-NCP-APIGW-API-KEY-ID: xxxx"   -H "X-NCP-APIGW-API-KEY: yyyy" -v
import dotenv from "dotenv"
dotenv.config()

const clientId = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET
const address = "서울특별시 강남구 삼성동 100"

// console.log("Client ID:", process.env.CLIENTID); // 출력 테스트
// console.log("Client Secret:", process.env.CLIENTSECRET); // 출력 테스트

fetch(
  `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(
    address
  )}`,
  {
    method: "GET",
    headers: {
      "X-NCP-APIGW-API-KEY-ID": clientId,
      "X-NCP-APIGW-API-KEY": clientSecret,
    },
  }
)
  .then((response) => response.json())
  .then((data) => {
    if (data.addresses.length > 0) {
      const { x, y } = data.addresses[0] // x: 경도, y: 위도
      console.log(`위도: ${y}, 경도: ${x}`)
    } else {
      console.log("해당 주소의 위치 정보를 찾을 수 없습니다.")
    }
  })
  .catch((error) => console.error("Error:", error))
