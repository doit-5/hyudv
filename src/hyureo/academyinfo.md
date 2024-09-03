```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap"
    rel="stylesheet"
  />
</head>

<style>
  body {
    font-family: "Noto Sans KR", sans-serif;
    font-weight: 400;
  }

  h1,
  h2,
  h3 {
    font-family: "Noto Sans KR", sans-serif;
    font-weight: 600;
  }
</style>
```

```js
import * as d3 from "npm:d3";
import { professorLecturePlot } from '../components/professorLecture/professorLecturePlot.js';
```

```js
const acinfo = FileAttachment("../data/academyinfo.csv").csv({ typed: true });
const professorLectureUniv = FileAttachment("../data/professorLecture/professorLectureUniv.csv").csv({
  typed: true,
  array: true,
});
```

```js
display(acinfo);
```

# 정보공시 현황

---

## 1. 전임교원 강의담당비율

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => professorLecturePlot(acinfo, {
    width,
    y: {grid: true, label: "전임교원강의담당비율(%)"},
    x: {label: "지역명(가나다 순)"}}
    ))
    }

  </div>

</div>


### 전임교원강의담당비율 대학현황(Radial dendrogram)

```js
const width = 928;
const height = width;
const cx = width * 0.5; // adjust as needed to fit
const cy = height * 0.54; // adjust as needed to fit
const radius = Math.min(width, height) / 2 - 120;

// Create a radial cluster layout. The layout’s first dimension (x)
// is the angle, while the second (y) is the radius.
const tree = d3.cluster()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

  // Sort the tree and apply the layout.
const root = tree(d3.hierarchy(d3.stratify().path((d) => d)(professorLectureUniv))
      .sort((a, b) => d3.ascending(a.data.id, b.data.id)));
  
// 깊이 1의 항목들을 추출하여 고유한 색상을 할당합니다.
const topLevelCategories = root.children.map(d => d.data.id);
const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(topLevelCategories);

// 그라데이션을 위한 보조 함수
function interpolateColor(color, factor) {
  return d3.interpolateRgb(color, "#ffffff")(factor);
}

// 노드의 색상을 결정하는 함수
function getNodeColor(d) {
  if (d.depth === 0) return "#6f4f28"; // 루트 노드 색상
  const topLevelParent = d.depth === 1 ? d : d.ancestors().find(node => node.depth === 1);
  const baseColor = colorScale(topLevelParent.data.id);
  return interpolateColor(baseColor, (d.depth - 1) / 4); // 깊이에 따라 그라데이션
}

// Creates the SVG container.
const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-cx, -cy, width, height])
      .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");


// SVG에 스타일을 추가합니다.
const style = svg.append("style").text(`
  @media (prefers-color-scheme: dark) {
    .node-label { fill: #ffffff; }
  }
  @media (prefers-color-scheme: light) {
    .node-label { fill: #000000; }
  }
`);

// Append links.
svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
    .selectAll()
    .data(root.links())
    .join("path")
      .attr("d", d3.linkRadial()
          .angle(d => d.x)
          .radius(d => d.y));

// Append nodes and labels.
const node = svg.append("g")
  .selectAll("g")
  .data(root.descendants())
  .join("g")
    .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`);

// Add circles for nodes
node.append("circle")
  .attr("fill", d => getNodeColor(d))
  .attr("r", 2.5);

// Add labels
node.append("text")
  .attr("class", "node-label") 
  .attr("transform", d => `rotate(${d.x >= Math.PI ? 180 : 0})`)
  .attr("dy", "0.31em")
  .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
  .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
  .attr("paint-order", "stroke")
  .attr("fill", d => d.depth === 0 ? "#000" : getNodeColor(d))
  .attr("font-size", "8px")
  .text(d => {
    const parts = d.data.id.split('/');
    return parts[parts.length - 1];
  })
 .style("opacity", d => d.depth <= 3 ? 1 : 0); // 3번째 descendants까지는 항상 보이게 설정

// 마우스 오버와 아웃 이벤트 추가
node
  .on("mouseover", function(event, d) {
    if (d.depth > 3) { // 마지막 descendants에 대해서만 적용
      d3.select(this).select("text").style("opacity", 1);
    }
  })
  .on("mouseout", function(event, d) {
    if (d.depth > 3) { // 마지막 descendants에 대해서만 적용
      d3.select(this).select("text").style("opacity", 0);
    }
  });
  
display(svg.node());
```


### 전임교원강의담당비율 대학현황(Force-directed graph)

```js
// Specify the chart’s dimensions.
const width = 928;
const height = 600;
    
// Define the drag function
const drag = simulation => {
      function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
  }
  
function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
  }
  
function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
  

// Compute the graph and start the force simulation.
const root = d3.hierarchy(d3.stratify().path((d) => d)(professorLectureUniv));
const links = root.links();
const nodes = root.descendants();
  
const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(0).strength(1))
        .force("charge", d3.forceManyBody().strength(-20))
        .force("x", d3.forceX())
        .force("y", d3.forceY());


// 색상 스케일 정의 (예: 20개의 서로 다른 색상)
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// 노드의 색상을 결정하는 함수
function getNodeColor(d) {
  if (d.depth === 0) return "#fff";  // 루트 노드는 흰색
  if (d.depth === 1) return colorScale(d.data.id);  // depth 1 노드에 고유 색상 지정
  
  // depth 1 이상의 노드는 부모 색상의 그라데이션
  const parentColor = d3.color(getNodeColor(d.parent));
  return parentColor.brighter(d.depth * 0.35);
}


// Create the container SVG.
const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto;");
  
// Append links.
const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line");
  
// Append nodes.
const node = svg.append("g")
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("fill", getNodeColor) 
        .attr("r", 3.5)
        .call(drag(simulation));
  
node.append("title")
        .text(d => d.data.id);
  
simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
  
      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
    });
  
invalidation.then(() => simulation.stop());
  
display(svg.node());
```


## 2. 외국인 학생비율

```js
const foreignStudentsData = FileAttachment(
  "../data/foreignStudent/getTopForeignStudentUniversities.csv"
).csv({ typed: true });
```

<!-- Plot : Number of foreign students-->

```js
function foreignStudents(data, { width } = {}) {
  console.log(JSON.stringify(data, null, 2));

  return Plot.plot({
    // title: "Number of foreign students",
    marginBottom: 60,
    x: {
      label: "",
      tickRotate: -30,
    },
    y: {
      transform: (d) => d,
      label: "↑ Number of foreign students",
      grid: 5,
    },
    marks: [
      Plot.ruleY([0]),

      Plot.barY(data, {
        x: "학교명",
        y: "외국인학생수",
        sort: { x: "y", reverse: true, limit: 20 },
        fill: "steelblue",
      }),
    ],
  });
}
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => foreignStudents(foreignStudentsData, {width}))}
  </div>
</div>
<svg></svg>

**3. 취업률**
