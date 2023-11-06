// 리액트 컴포넌트 기본
import React from 'react'; // react 임포트 (react는 자바스크립트와 HTML을 섞어서 사용할 수 있도록 JSX 사용)
// cf) JSX 표현식은 자바스크립트 코드가 아니기 때문에 웹브라우저에서 바로 실행하면 오류가 남
//     그래서 빌드 과정에서 바벨 컴파일러가 JSX 표현식을 자바스크립트 코드로 컴파일하며, 웹브라우저는 정상적인 자바스크립트 코드를 받게 됨
import { css } from '@emotion/react';
import { Container } from 'react-bootstrap';

export function Slide(props) { // Slide라는 이름의 함수형 컴포넌트 선언
    const { title, children, id } = props; // 부모 컴포넌트에서 전달받은 속성값 호출
    return ( // 이 컴포넌트가 렌더링될 형태 반환
        <div
        id={id} // id 추가
          css={css`
            text-align: center;
            border-bottom: 1px solid #aaa; // 속성 변경
            padding-top: 40px;
            padding-bottom: 60px;
          `}
        >
          {/* 컴포넌트 추가 */}
          <Container>
            <h2>{title}</h2>
            <div>{children}</div>
          </Container>
        </div>
    );
}