import { query } from "./db.js"
import { csvFormat } from "d3-dsv"

async function getTopForeignStudentUniversities() {
  const selectQuery = `
    SELECT ai.연도, ai.학교명, ai.본분교명, ai.외국인학생수, uo.longitude, uo.latitude
    FROM academy_info ai
    INNER JOIN university_overview uo
    ON ai.학교명 = uo.학교명 AND ai.본분교명 = uo.본분교
    WHERE ai.연도 = '2023'
    ORDER BY ai.외국인학생수 DESC
    LIMIT 30
  `

  try {
    const results = await query(selectQuery)

    // 데이터 변환: CSV 포맷을 위한 객체 배열로 변환
    const formattedResults = results.map((row) => ({
      연도: row.연도,
      학교명: row.학교명,
      본분교명: row.본분교명,
      외국인학생수: row.외국인학생수,
      위도: row.latitude,
      경도: row.longitude,
    }))
    // CSV 형식으로 출력
    const csvData = csvFormat(formattedResults)
    process.stdout.write(csvData)
  } catch (err) {
    console.error("Error executing query:", err)
  }
}

getTopForeignStudentUniversities()
