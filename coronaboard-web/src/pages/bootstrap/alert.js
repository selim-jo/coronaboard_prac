// 부트스트랩 얼러트 컴포넌트
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Container } from 'react-bootstrap'; // 임포트

export default function AlertPage() { // 페이지 생성
    return (
        <Container className="pt-3">
            {/* 다양한 스타일 적용 */}
            <Alert variant="primary">Primary</Alert>
            <Alert variant="secondary">Secondary</Alert>
            <Alert variant="success">Success</Alert>
            <Alert variant="danger">Danger</Alert>
            <Alert variant="warning">Warning</Alert>
            <Alert variant="info">Info</Alert>
        </Container>
    );
}