const { getDataSource } = require('./src/data-loader');

// Node API 기반 페이지 추가하기 - createPages 후크 함수 사용자화
// createPages 후크는 개츠비 빌드 과정에서 자동으로 호출됨
exports.createPages = async ({ actions }) => {
    const { createPage } = actions;
    const dataSource = await getDataSource();

    createPage({
        path: '/',
        component: require.resolve('./src/templates/single-page.js'),
        context: { dataSource },
    });
};