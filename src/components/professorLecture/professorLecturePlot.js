import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";


// Plot 함수1
export function professorLecturePlot(data, {...options} = {}) {
    return Plot.plot({
        ...options,
        marks: [
            Plot.ruleY([0]),
            Plot.dot(data, {x: "지역명", y: "전임교원강의담당비율", r: d => Math.sqrt(d.전임교원수) * 3, fill: "지역명", fillOpacity: 0.6}),
            Plot.tip(data,
                Plot.pointerX({x: "지역명",
                               y: "전임교원강의담당비율",
                               title: (d) => `학교명: ${d.학교명}\n지역명: ${d.지역명}\n전임교원수: ${d.전임교원수}\n강의담당비율: ${d.전임교원강의담당비율}%`}))
        ]
    })
}
