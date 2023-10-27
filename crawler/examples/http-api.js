// API를 호출해서 외부에서 데이터를 불러오는 경우
const axios = require('axios');

async function main() {
    const resp = await axios.get(
        'https://yjiq150.github.io/coronaboard-crawling-sample/example-data.json',
    );
    console.log(resp.data.content);
}

main();