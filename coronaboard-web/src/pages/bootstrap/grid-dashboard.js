// 코로나보드에서의 그리드 시스템
// 부트스트랩 그리드 시스템은 화면 너비를 12칸으로 등분해서 사용함
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row } from 'react-bootstrap';
import { css } from '@emotion/react';

const borderedGrid = css`
    text-align: center;
    .row div {
        background-color: rgba(39, 41, 43, 0.03);
        border: 1px solid rgba(39, 41, 43, 0.1);
        padding: 10px;
        margin-bottom: 20px;
`;

export default function GridDashboardPage() {
    return (
        <div className="pt-3" css={borderedGrid}>
            <Container>
                <h2>전 세계</h2>
                {/* 가로 길이가 768px보다 작으면 각 열이 xs로 지정한 크기만큼으로 유지되다가 
                768px보다 크거나 같아지는 순간부터 행 가로 너비를 열 개수 만큼으로 등분하게 됨 */}
                <Row>
                    <Col xs={4} md>확진자</Col>
                    <Col xs={4} md>사망자</Col>
                    <Col xs={4} md>격리해제</Col>
                    <Col xs={6} md>치명률</Col>
                    <Col xs={6} md>발생국</Col>
                </Row>

                <h2>대한민국</h2>
                <Row>
                    <Col xs={3} md>확진자</Col>
                    <Col xs={3} md>사망자</Col>
                    <Col xs={3} md>격리해제</Col>
                    <Col xs={3} md>치명률</Col>
                    <Col xs={4} md>총검사자</Col>
                    <Col xs={4} md>검사중</Col>
                    <Col xs={4} md>결과음성</Col>
                </Row>
            </Container>

        </div>
    );
}