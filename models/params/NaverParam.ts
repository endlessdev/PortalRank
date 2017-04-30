import {ParserParam} from "../ParserParam";

export let paramNaver: ParserParam = {
    type: "naver",
    url: 'http://www.naver.com',
    querySelector: 'ul.ah_l:first-child li.ah_item > a',
    parserSelector: function ($, elem) {
        var data = $(elem);
        return {
            title: data.find('.ah_k').text(),
            rank: data.find('.ah_r').text(),
        };
    }
};