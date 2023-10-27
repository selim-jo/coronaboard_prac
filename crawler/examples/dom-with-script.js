// 메인 HTML 소스에 찾는 데이터가 존재하는 경우
const axios = require('axios');
const cheerio = require('cheerio');
const vm = require('vm'); // 추출된 자바스크립트 코드를 별도 실행하는 가상 환경 기능 로드

async function main() {
    const resp = await axios.get(
        'https://yjiq150.github.io/coronaboard-crawling-sample/dom-with-script',
    );

    const $ = cheerio.load(resp.data);
    // script 태그를 찾아서 코드 추출
    const extractedCode = $('script').first().html();

    // 컨텍스트를 생성 후 해당 컨텍스트에서 추출된 코드 실행
    const context = {};
    vm.createContext(context);
    vm.runInContext(extractedCode, context);

    // 스크립트 내에 하드코딩된 정보에 접근
    console.log(context.dataExample.content);
}

main();