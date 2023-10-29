// 아파치 이차트 이용하기
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export function Echart(props) {
    const { wrapperCss, option } = props;
    // 차트가 그려질 DOM 엘리먼트를 참조할 레퍼런스 생성
    // useRef는 DOM으로 구성된 일반적인 HTML 환경과 리액트 엘리먼트 구성된 JSX 환경을 연결해주는 중간자 역할을 함
    const chartRef = useRef(null);

    // 의존하는 상태 변수(props 포함)가 변경될 때마다 호출됨
    useEffect(() => {
        // echarts를 초기화(return에서 정의한 DOM 엘리먼트에 차트를 그리도록 설정)
        const chartInstance = echarts.init(chartRef.current);
        chartInstance.setOption(option);

        // 의존하는 상태 변수가 바뀌거나 현재 컴포넌트가 DOM에서 제거될 때(unmount)
        // 사용 중인 리소스를 정리하기 위한 클린업 함수를 정의하여 반환
        return () => {
            chartInstance.dispose();
        };
    }, [option]);

    // 실제 차트가 그려질 리액트 엘리먼트
    return <div css={wrapperCss} ref={chartRef} />;
}