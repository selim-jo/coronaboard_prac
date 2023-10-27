const axios = require('axios'); // HTTP 호출을 더 편리하게 해주는 HTTP 클라이언트 라이브러리
const cheerio = require('cheerio'); // 로드된 HTML을 파싱하여 DOM을 생성하는 라이브러리

async function main() {
    // HTML 로드하기
    const resp = await axios.get(
        'https://yjiq150.github.io/coronaboard-crawling-sample/dom',
    );

    const $ = cheerio.load(resp.data); // HTML을 파싱하고 DOM 생성하기
    const elements = $('.slide p'); // CS 셀렉터로 원하는 요소 찾기

    // 찾은 요소를 순회하면서 요소가 가진 텍스트 출력하기
    elements.each((idx, el) => {
        // text() 메서드를 사용하기 위해 Node 객체인 el을 $로 감싸서 cheerio 객체로 변환
        console.log($(el).text());
    });
}

main();