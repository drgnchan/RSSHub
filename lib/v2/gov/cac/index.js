const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

const cat2suburl = {
    'qwfb/bgsfb': 'qwfb/bgsfb/A090302index_1.htm',
    'gzzc/gzzc': 'gzzc/gzzc/A090401index_1.htm',
};
const url = `http://www.cac.gov.cn`;
module.exports = async (ctx) => {
    const firstcat = ctx.params.firstcat;
    const secondcat = ctx.params.secondcat;
    const key = `${firstcat}/${secondcat}`;
    const requestUrl = `${url}/${cat2suburl[key]}`;

    const response = await got(requestUrl);
    const $ = cheerio.load(response.data);

    const list = $('.dataList li').toArray();
    const items = list.map((item) => {
        item = $(item);
        const a = item.find('h3 a');
        const retItem = {
            title: a.text(),
            link: a.attr('href'),
            pubDate: parseDate(item.find('span').text()),
        };
        return retItem;
    });

    ctx.state.data = {
        title: `互联网信息办公室 - ${$('#pageName2').text()}`,
        link: requestUrl,
        item: items,
    };
};
