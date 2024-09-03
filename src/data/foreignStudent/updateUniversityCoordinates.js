// ./src/app.js
import { query } from "./db.js";
import { getCoordinates } from "./geocode.js";

async function updateUniversityCoordinates() {
  const selectQuery = "SELECT 학교코드, 주소 FROM university_overview";
  
  try {
    const universities = await query(selectQuery);

    for (const university of universities) {
      const { 학교코드, 주소 } = university;

      const coordinates = await getCoordinates(주소);

      if (coordinates) {
        const { latitude, longitude } = coordinates;

        const updateQuery = `
          UPDATE university_overview
          SET latitude = $1, longitude = $2
          WHERE 학교코드 = $3
        `;

        await query(updateQuery, [latitude, longitude, 학교코드]);
        console.log(`Updated ${학교코드}: Latitude = ${latitude}, Longitude = ${longitude}`);
      } else {
        console.log(`Could not find coordinates for ${학교코드} with address ${주소}`);
      }
    }
  } catch (err) {
    console.error("Error processing universities:", err);
  }
}

updateUniversityCoordinates();
