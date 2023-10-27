// 구글 시트에서 불러오기, API 서버에서 불러오기
const axios = require('axios');
const { subDays } = require('date-fns'); // 날짜, 시간 포매팅 라이브러리 
const { format, utcToZonedTime } = require('date-fns-tz'); // 날짜, 시간 포매팅 라이브러리
const _ = require('lodash'); // 자바스크립트가 제공하지 않는 유용한 유틸리티 함수를 제공하는 라이브러리

const countryInfo = require('../../tools/downloaded/countryInfo.json'); // 각 국가의 정보를 담은 객체들의 배열

async function getDataSource() {
    const countryByCc = _.keyBy(countryInfo, 'cc'); // countryInfo에서 cc 필드를 키로 사용하는 맵을 만든 것
    const globalStats = await generateGlobalStats(); // 국가별 코로나19 현황 정보가 저장됨

    return {
        globalStats,
        countryByCc,
    };
}

async function generateGlobalStats() {
    // HTTP 클라이언트 생성
    const apiClient = axios.create({
        baseURL: process.env.CORONABOARD_API_BASE_URL || 'http://localhost:8080',
    });

    // GET /global-stats API 호출
    const response = await apiClient.get('global-stats');

    // 날짜 기준 그룹핑
    const groupedByDate = _.groupBy(response.data.result, 'date');

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

module.exports = {
    getDataSource,
};
