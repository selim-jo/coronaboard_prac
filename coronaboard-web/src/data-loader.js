// 구글 시트에서 불러오기, API 서버에서 불러오기
const axios = require('axios');
const { subDays } = require('date-fns'); // 날짜, 시간 포매팅 라이브러리 
const { format, utcToZonedTime } = require('date-fns-tz'); // 날짜, 시간 포매팅 라이브러리
const _ = require('lodash'); // 자바스크립트가 제공하지 않는 유용한 유틸리티 함수를 제공하는 라이브러리
const path = require('path');
const fs = require('fs-extra');

const countryInfo = require('../../tools/downloaded/countryInfo.json'); // 각 국가의 정보를 담은 객체들의 배열
const ApiClient = require('./api-client');
// 구글 시트로부터 내려받은 공지사항 목록 로드
const notice = require('../../tools/downloaded/notice.json');
const { count } = require('console');

async function getDataSource() {
    const countryByCc = _.keyBy(countryInfo, 'cc'); // countryInfo에서 cc 필드를 키로 사용하는 맵을 만든 것
    //const globalStats = await generateGlobalStats(); // 국가별 코로나19 현황 정보가 저장됨
    const apiClient = new ApiClient();

    // 국가별 데이터 로드
    const allGlobalStats = await apiClient.getAllGlobalStats();
    // 날짜별로 데이터를 묶는 부분을 기존 generateGlobalStats() 함수에서 추출
    const groupedByDate = _.groupBy(allGlobalStats, 'date');
    const globalStats = generateGlobalStats(groupedByDate);
    // 전체 기간에 대한 국가별 데이터 로드
    const globalChartDataByCc = generateGlobalChartDataByCc(groupedByDate);

    // 국가별 차트 데이터를 국가별로 순회하여 저장
    // static/generated 디렉터리는 데이터에따라 매번 생성되는 파일이기 때문에 .gitignore에 추가해서 git 저장소에 추가되지 않도록 할것
    Object.keys(globalChartDataByCc).forEach((cc) => {
        const genPath = path.join(process.cwd(), `static/generated/${cc}.json`);
        fs.outputFileSync(genPath, JSON.stringify(globalChartDataByCc[cc]));
    });

    // 생성된 차트 데이터를 빌드 시점에 주입할 필요가 없어서 반환값에 추가되는 것이 없음
    return {
        lastUpdated: Date.now(), // 데이터를 만든 현재 시간 기록
        globalStats,
        countryByCc,
        // 공지사항 목록 중 hidden 필드가 false인 항목만 필터하여 전달
        notice: notice.filter((x) => !x.hidden),
    };
}

function generateGlobalStats(groupedByDate) {
    // HTTP 클라이언트 생성
    //const apiClient = axios.create({
    //    baseURL: process.env.CORONABOARD_API_BASE_URL || 'http://localhost:8080',
    //});

    // GET /global-stats API 호출
    //const response = await apiClient.get('global-stats');

    // 날짜 기준 그룹핑
    //const groupedByDate = _.groupBy(response.data.result, 'date');

    // 오늘/어제 날짜 생성
    // 데이터가 제공되는 마지막 날짜로 Date 객체 생성
    // const now = new Date(); // 현재 시각의 Date 객체 생성
    const now = new Date('2021-06-05');
    const timeZone = 'Asia/Seoul'; // 시간대 = 한국(서울)
    const today = format(utcToZonedTime(now, timeZone), 'yyyy-MM-dd');
    const yesterday = format(
        utcToZonedTime(subDays(now, 1), timeZone),
        'yyyy-MM-dd',
    );

    // 오늘 날짜에 대한 데이터가 존재하지 않는 경우 오류 발생시키기
    if (!groupedByDate[today]) {
        throw new Error('Data for today is missing');
    }

    // 오늘, 어제 데이터를 모두 가진 객체를 생성해 반환
    return createGlobalStatWithPrevField(
        groupedByDate[today],
        groupedByDate[yesterday],
    );
}

// 오늘, 어제 데이터를 모두 가진 객체 생성
function createGlobalStatWithPrevField(todayStats, yesterdayStats) {
    // 어제 데이터를 국가 코드 기준으로 찾을 수 있게 변환
    const yesterdayStatsByCc = _.keyBy(yesterdayStats, 'cc');

    // 국가별로 오늘 데이터와 어제 데이터를 한 번에 가질 수 있게 데이터 변환
    const globalStatWithPrev = todayStats.map((todayStat) => {
        const cc = todayStat.cc;
        const yesterdayStat = yesterdayStatsByCc[cc];
        // 어제 데이터가 존재하면 오늘 데이터 필드 외에 xxxxPrev 형태로
        // 어제 데이터 필드 추가
        if (yesterdayStat) {
            return {
                ...todayStat,
                confirmedPrev: yesterdayStat.confirmed || 0,
                deathPrev: yesterdayStat.death || 0,
                negativePrev: yesterdayStat.negative || 0,
                releasedPrev: yesterdayStat.released || 0,
                testedPrev: yesterdayStat.tested || 0,
            };
        }

        return todayStat;
    });

    return globalStatWithPrev;
}

// 차트에 사용하기 적합한 형태로 변환하기 위한 함수
function generateGlobalChartDataByCc(groupedByDate) {
    // 국가 코드를 필드 이름으로 하여 차트 데이터를 저장할 객체 선언 
    const chartDataByCc = {};
    // 모든 키값(날짜)를 불러와서 날짜순으로 정렬
    const dates = Object.keys(groupedByDate).sort();
    for (const date of dates) {
        const countriesDataForOneDay = groupedByDate[date];
        for (const countryData of countriesDataForOneDay) {
            const cc = countryData.cc;
            // 특정 국가의 차트 데이터 객체가 정의되지 않았다면 기본값으로 생성
            if (!chartDataByCc[cc]) {
                chartDataByCc[cc] = {
                    date: [],
                    confirmed: [],    // 해당 날짜의 확진자 수
                    confirmedAcc: [], // 해당 날짜까지의 누적 확진자 수
                    death: [],        // 사망자 수
                    deathAcc: [],
                    released: [],     // 격리해제자 수
                    releasedAcc: [],
                };
            }
            // 특정 국가의 차트 데이터에 특정 국가의 현재 날짜의 데이터 추가
            appendToChartData(chartDataByCc[cc], countryData, date);
        }

        // 날짜별로 모든 국가에 대한 합산 데이터를 global이라는 임의의 국가 코드에 저장
        if (!chartDataByCc['global']) {
            chartDataByCc['global'] = {
                date: [],
                confirmed: [],
                confirmedAcc: [],
                death: [],
                deathAcc: [],
                released: [],
                releasedAcc: [],
            };
        }

        const countryDataSum = countriesDataForOneDay.reduce(
            (sum, x) => ({
                confirmed: sum.confirmed + x.confirmed,
                death: sum.death + x.death,
                // release 데이터가 없는 국가들이 존재하여 별도 처리
                released: sum.released + (x.released || 0),
            }),
            { confirmed: 0, death: 0, released: 0 },
        );

        appendToChartData(chartDataByCc['global'], countryDataSum, date);
    }

    return chartDataByCc;
}

function appendToChartData(chartData, countryData, date) {
    // 전일 데이터가 없는 경우 현재 날짜 데이터를 그대로 사용
    if (chartData.date.length === 0) {
        chartData.confirmed.push(countryData.confirmed);
        chartData.death.push(countryData.death);
        chartData.released.push(countryData.released);
    } else {
        // 전일 대비 증가량 저장
        const confirmedIncrement = countryData.confirmed - _.last(chartData.confirmedAcc) || 0;
        chartData.confirmed.push(confirmedIncrement);

        const deathIncrement = countryData.death - _.last(chartData.deathAcc) || 0;
        chartData.death.push(deathIncrement);

        const releasedIncrement = countryData.released - _.last(chartData.releasedAcc) || 0;
        chartData.released.push(releasedIncrement);
    }

    chartData.confirmedAcc.push(countryData.confirmed);
    chartData.deathAcc.push(countryData.death);
    chartData.releasedAcc.push(countryData.released);

    chartData.date.push(date);
}

module.exports = {
    getDataSource,
};
