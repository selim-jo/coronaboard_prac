// 내부 메뉴바 만들기
import React, { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { Nav, Navbar } from 'react-bootstrap';
import { animateScroll, Link } from 'react-scroll';

export function Navigation() {
    const menubarHeight = 45;
    // 스크롤 직후 메뉴가 콘텐츠를 가리는 것 방지
    const scrollOffset = -menubarHeight;
    // 현재 컴포넌트 최상위 DOM 엘리먼트에 대한 참조 생성
    const navBarWrapper = useRef(null);
    // 현재 스크롤 위치에 따라서 내비게이션을 상단에 고정시킬지 콘텐츠 내부에 위치시킬지 제어하는 상태 변수
    const [fixedTop, setFixedTop] = useState(false);

    const onScroll = () => {
        // 스크롤 위치가 메뉴바 아래까지 이동한 순간 메뉴바를 상단에 고정
        if (
            window.scrollY > 0 &&
            navBarWrapper.current.getBoundingClientRect().top <= 0
        ) {
            setFixedTop(true);
        } else {
            setFixedTop(false);
        }
    };

    // 현재 스크롤 위치를 찾아내는 스크롤 이벤트 리스너는 windows 객체에 등록
    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    });

    return (
        <div
            css={css`
                .fixed-top {
                    background: white;
                    box-shadow: 0 1px 4px #dee2e6;
                }
                // 링크가 active 상태일 때 링크 아래쪽에 파란색 하이라이트 표시
                .fixed-top .nav-link.active i {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    display: inline-block;
                    width: 85%;
                    height: 3px;
                    margin: auto;
                    background-color: #4169e2;
                }
            `}
            ref={navBarWrapper}
        >
            <Navbar     // 부트스트랩의 Navbar 컴포넌트의 기본 스타일을 오버라이드
                // 이 속성을 제외하고 기존 메뉴바에서 사용한 Navbar 코드와 동일
                // fixed-top 클래스를 이용하여 메뉴바를 화면 상단에 고정
                className={fixedTop ? 'fixed-top' : null}
                css={css`
                    justify-content: center;
                    background: #f7f7f7;
                    border-top: 1px solid #dee2e6;
                    border-bottom: 1px solid #dee2e6;
                    padding: 2px;
                    height: ${menubarHeight}px;

                    .nav-link {
                        position: relative;
                        cursor: pointer;
                    }
                `}
            >
                <Nav>  {/* 여러 Link 컴포넌트들을 묶어서 보여주는 컴포넌트 */}
                    <Link // 사용자 클릭에 반응해서 스크롤하는 컴포넌트
                        className="nav-link"
                        to="global-slide" // 실제 해당 링크를 클릭했을 때 이동할 목표 엘리먼트 id 적어줌
                        offset={scrollOffset}
                        spy={true} // 스크롤하는 위치 모니터링
                        smooth={true} // 목표 위치로 이동할 때 애니메이션 여부 결정
                    >
                        국가별현황<i />
                    </Link>
                    <Link
                        className="nav-link"
                        to="global-chart-slide"
                        offset={scrollOffset}
                        spy={true}
                        smooth={true}
                    >
                        글로벌차트<i />
                    </Link>
                    <Link
                        className="nav-link"
                        to="korea-chart-slide"
                        offset={scrollOffset}
                        spy={true}
                        smooth={true}
                    >
                        국내차트<i />
                    </Link>
                    <Link
                        className="nav-link"
                        to="youtube-slide"
                        offset={scrollOffset}
                        spy={true}
                        smooth={true}
                    >
                        유튜브<i />
                    </Link>
                </Nav>
            </Navbar>

            {fixedTop ? (
                <div
                    css={css`
                        position: fixed;
                        bottom: 15px;
                        right: 15px;
                        background-color: white;
                        border-radius: 15px;
                        z-index: 800;
                        width: 32px;
                        height: 32px;
                        text-align: center;
                        border: 1px solid #dee2e6;
                        a {
                            color: black;
                        }
                        box-shadow: 0 1px 4px #dee2e6;
                    `}
                >
                    {/* 버튼 클릭 이벤트 등록 */}
                    <a href="#top" onClick={() => animateScroll.scrollToTop()}>
                        {/* https://icons.getboostrap.com/icons/chevron-up/에서 복사한 아이콘 */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-chevron-up"
                            viewBox="0 0 16 16"
                        >
                            <path d="github에서 복사해서 붙여넣기" />
                        </svg>
                    </a>
                </div>
            ) : null}
        </div>
    );
}