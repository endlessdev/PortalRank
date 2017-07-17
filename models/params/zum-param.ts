import {ParserParam} from '../parser-param';

export let paramZum: ParserParam = {
  type: 'zum',
  url: 'http://zum.com/',
  querySelector: '.d_rank .d_btn_keyword.d_ready',
  parserSelector: ($, elem) => {
    const data = $(elem);
    return {
      title: data.attr('title'),
      rank: data.data('order'),
    };
  },
};
