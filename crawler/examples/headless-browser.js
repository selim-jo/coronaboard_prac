// 헤드리스 브라우저로 크롤링하기
const puppeteer = require('puppeteer'); // 크롬 브라우저의 모든 기능을 제어할 수 있는 라이브러리

async function main() {
    const browser = await puppeteer.launch(); // 헤드리스 브라우저 실행
    const page = await browser.newPage(); // 브라우저에 새 페이지 생성

    const pageUrl = 'https://yjiq150.github.io/coronaboard-crawling-sample/http-api-with-button';
    await page.goto(pageUrl, {
        // 모든 네트워크 연결이 500ms 이상 유휴 상태가 될 때까지 기다림
        waitUntil: 'networkidle0',
    });

    // 제목/내용 불러오기 버튼 클릭
    await page.click('input[type="button"]');

    await page.waitForFunction(() => {
        // 함수가 웹브라우저의 컨텍스트에서 실행되기 때문에 document 객체에 접근 가능
        return document.getElementById('content').textContent.length > 0;
    });

    // 특정 셀렉터에 대해 제공된 함수를 수행한 값 반환
    const content = await page.$$eval(
        '#content',
        (elements) => elements[0].textContent,
    );

    console.log(content);

    await browser.close(); // 작업이 완료되면 브라우저 종
}

main();