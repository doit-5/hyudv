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

# 정보공시 현황

```js
const acinfo = FileAttachment("../data/academyinfo.csv").csv({ typed: true })
```

```js
display(acinfo)
```
---

**1. 전임교원 강의비율**

**2. 외국인 학생비율**

**3. 취업률**
