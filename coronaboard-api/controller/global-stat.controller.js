// 컨트롤러 구현하기 (요청을 받고, 요청에 맞게 비즈니스 로직을 수행한 후 다시 응답을 돌려주는 역할을 하는 코드를 지칭)
const { GlobalStat } = require('../database'); // GlobalStat 객체 가져오기
const { wrapWithErrorHandler } = require('../util');

// 시퀄라이즈 ORM에서 제공하는 대표적인 기능
// create(): INSERT문
// findAll(): SELECT문 (전체 조회)
// findOne(): SELECT문 (단일 조회)
// count(): SELECT문으로 검색된 레코드의 개수 반환
// update(): UPDATE문
// destroy(): DELETE문 (조건을 명시하지 않으면 전체 삭제되니 주의!)
// upsert(): MySQL의 INSERT ... ON DUPLICATE KEY UPDATE구문

// 데이터 조회
async function getAll(req, res) {
    const result = await GlobalStat.findAll();
    res.status(200).json({ result });
}

// 데이터 삽입 또는 업데이트
async function insertOrUpdate(req, res) {
        const { cc, date } = req.body;
        if(!cc || !date) {
            res.status(400).json({ error: 'cc and date are required'});
            return;
        }

        // 조건(국가 코드와 날짜)에 맞는 데이터 개수 확인
        const count = await GlobalStat.count({ where: { cc, date }});

        if(count == 0) {
            await GlobalStat.create(req.body);
        } else {
            await GlobalStat.update(req.body, { where: { cc, date }});
        }

        res.status(200).json({ result: 'success' });
}

// 데이터 삭제
async function remove(req, res) {
    const { cc, date } = req.body;
    if(!cc || !date) {
        res.status(400).json({ error: 'cc and date are required' });
        return;
    }

    await GlobalStat.destroy({
        where: {
            cc,
            date,
        },
    });

    res.status(200).json({ result: 'success' });
}

module.exports = wrapWithErrorHandler ({
    getAll,
    insertOrUpdate,
    remove,
});