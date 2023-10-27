// 선택 상자 컴포넌트
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Select from 'react-select'; // 임포트

// 선택 상자에 사용할 국가 목록
const options = [
    { value: 'KR', label: '한국'},
    { value: 'JP', label: '일본'},
    { value: 'US', label: '미국'},
    { value: 'CN', label: '중국'},
];

export default function SelectPage() {
    // 첫 번째 요소는 새롭게 정의된 상태 변수이고, 두 번째 요소는 해당 상태 변수의 값을 변경하는데 사용하는 함수
    // 단일 선택 상자의 선택 내역을 저장할 상태 변수 정의
    const [selectedOptionSingle, setSelectedOptionSingle] = useState();
    // 다중 선택 상자의 선택 내역을 저장할 상태 변수 정의
    const [selectedOptionMulti, setSelectedOptionMulti] = useState();
    return (
        <Container className="pt-3">
            <h5>단일 선택 상자</h5>
            <Select
                value={selectedOptionSingle}
                onChange={(selectedOption) => {
                    console.log('Single options selected', selectedOption);
                    setSelectedOptionSingle(selectedOption);
                }}
                options={options}
            />
            <hr />
            <h5>다중 선택 상자</h5>
            <Select
                isMulti={true}
                isSearchable={true}
                placeholder="국가 선택..."
                value={selectedOptionMulti}
                onChange={(selectedOptions) => {
                    console.log('Multi options selected', selectedOptions);
                    setSelectedOptionMulti(selectedOptions);
                }}
                options={options}
            />
        </Container>
    );
}
