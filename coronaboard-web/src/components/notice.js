// 공시사항 컴포넌트 만들기
import React from 'react';
import { css } from '@emotion/react';

export function Notice(props) {
    const { notice } = props;

    return (
        <div
            css={css`
                padding-top: 20px;
                text-align: center;
            `}
        >
            <h2
                css={css`
                    font-size: 20px;
                `}
            >
                [공지사항]
            {notice.map((x, idx) => (
                <p key={idx}>{x.message}</p>
            ))}
            </h2>

        </div>
    );
}