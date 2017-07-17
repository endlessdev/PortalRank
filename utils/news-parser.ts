import * as request from 'request-promise';
import * as xml2js from 'xml2js';
import * as moment from 'moment';

export default class NewsParser {

  static getNewsDataByKeyword = async (searchKeyword: string) => {
    console.log(searchKeyword);
    let newsData: any = [];
    const rssURL = `http://newssearch.naver.com/search.naver?where=rss&query=`;
    const requestURL =
      `${rssURL}}${encodeURI(searchKeyword)}`;
    const rssResponse = await request(requestURL);
    await xml2js.parseString(rssResponse, async (err, result) => {
      newsData = result.rss.channel[0].item;
      await newsData.forEach(async (news, index) => {
        for (const element in newsData[index]) {
          if (newsData[index].hasOwnProperty(element)) {
            newsData[index][element] = newsData[index][element][0];
          }
        }
        if (news['media:thumbnail']) {
          newsData[index].thumb = news['media:thumbnail'].$.url.replace(/thumb140/gi, 'thumb');
          delete newsData[index]['media:thumbnail'];
        }
        newsData[index].pubDate = moment(newsData[index].pubDate).fromNow();
      });
    });
    return newsData;
  }
}
