// 막대 차트 그리기
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Echart } from '../../components/echart';
import { css } from '@emotion/react';

export default function BarChart() {
    // 레이블 표시 여부, 위치 설정
    const labelOptions = {
        show: true,
        position: 'top',
    };

    // 데이터의 이름, 차트 타입, 색상, 레이블, 실제 데이터 제공
    const series = [
        {
            name: '확진',
            type: 'bar',
            color: '#e2431e',
            label: labelOptions,
            data: [743, 556, 485, 454, 602],
        },
        {
            name: '격리해제',
            type: 'bar',
            color: '#6f9654',
            label: labelOptions,
            data: [474, 499, 599, 551, 602],
        },
    ];

    // 차트를 그리는 데 필요한 모든 옵션을 하나의 객체에 모아서 정의
    const chartOption = {
        title: {
            text: '대한민국 코로나 19 추이',
            left: 'center',
        },
        // 범례 설정
        legend: {
            data: series.map((x) => x.name),
            bottom: 20,
        },
        xAxis: {
            data: ['6.5', '6.6', '6.7', '6.8', '6.9'],
        },
        yAxis: {},
            tooltip: {
                trigger: 'axis',
            },
            series,
            animation: false,
        };
        
        return (
            <Container>
                {/* 차트가 그려질 영역의 크기와 정의해둔 차트 옵션을 컴포넌트에 전달 */}
                <Echart
                    wrapperCss={css`
                        width: 100%;
                        height: 400px;
                    `}
                    option={chartOption}
                />
            </Container>
        );
}