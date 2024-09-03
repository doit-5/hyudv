// ./src/geocode.js
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;

export async function getCoordinates(address) {
  const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-NCP-APIGW-API-KEY-ID": clientId,
        "X-NCP-APIGW-API-KEY": clientSecret,
      },
    });

    const data = await response.json();

    if (data.addresses && data.addresses.length > 0) {
      const { x, y } = data.addresses[0]; // x: 경도, y: 위도
      return {
        latitude: y,
        longitude: x,
      };
    } else {
      console.log("해당 주소의 위치 정보를 찾을 수 없습니다.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    return null;
  }
}
