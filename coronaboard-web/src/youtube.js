// 유튜브 영상 정도 데이터 준비
const axios = require('axios');
// 로케일 설정에 따라 n분 전, n시간 전 등의 형태로 시간을 표시해주는 라이브러리 사용
const TimeAgo = require('javascript-time-ago');
const ko =  require('javascript-time-ago/locale/ko');
TimeAgo.addLocale(ko);
const timeAgoKorean = new TimeAgo('ko-KR');

// GCP 콘솔을 통해 발급받은 API 키
const apiKey = process.env.GATSBY_APIKEY;

// description이 너무 긴 경우 앞부분만 남기고 잘라내는 함수
function truncateText(text, maxLength) {
    if (!text) {
        return '';
    }

    if (text.length > maxLength) {
        return text.substr(0, maxLength) + '...';
    } else {
        return ds;
    }
}

// 유튜브 API에서 전달된 item을 코로나보드에서 사용하기 좋은 형태로 변환
function convertModel(item) {
    const { id, snippet, statistics } = item;
    return {
        videoUrl: 'https://www.youtube.com/watch?v=' + id,

        // 타임스탬프 형태로 주어지는 publishedAt을 Date 객체로 변경한 후 포매팅
        publishedAt: timeAgoKorean.format(Date.parse(snippet.publishedAt)),
        title: snippet.title,
        channelTitle: snippet.channelTitle,
        thumbnail: snippet.thumbnails ? snippet.thumbnails.medium.url : '',
        description: truncateText(snippet.description, 80),
        viewCount: parseInt(statistics.viewCount),
    };
}

async function getYouTubeVideosByKeyword(keyword) {
    // 검색 API를 사용해 원하는 영상 검색
    const searchResponse = await axios.get(
        'https://content.googleapis.com/youtube/v3/search',
        {
            params: {
                key: apiKey,
                q: keyword,
                type: 'video',  // video, channel, playlist 중 하나
                part: 'id',     // 검색 조건을 만족하는 비디오의 id값만 조회
                maxResults: 3,  // 응답에 포함될 검색 결과 수
            },
        },
    );

    const ids = searchResponse.data.items.map((x) => x.id.videoId);
    // 검색해 획득한 id값들을 이용하여 비디오 정보, 통계 데이터 조회
    const detailResponse = await axios.get(
        'https://content.googleapis.com/youtube/v3/videos',
        {
            params: {
                key: apiKey,
                id: ids.join(','),
                order: 'relevance',
                // snippet 의미 : 제목, 설명, 업로드 날짜 등의 비디오 정보 조회
                // statistics 의미 : 조회수 등의 통계 정보 조회
                part: 'snippet,statistics',
            },
        },
    );

    return detailResponse.data.items.map(convertModel);
}

module.exports = {
    getYouTubeVideosByKeyword,
};