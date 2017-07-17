/// <reference path="../typings/tsd.d.ts"/>

import * as Router from 'koa-router';
import { sequelize, Sequelize } from '../database/index';
import { RankType } from '../models/rank-type';
import async = Q.async;

const router = new Router({ prefix: '/v1/analytics' });

router.get('/recent', async (ctx, next) => {

  const RAW_QUERY =
    `SELECT
  title,
  count(title) AS rank_count,
  avg(rank) as rank_avg
FROM ((SELECT
         title,
         rank,
         rank_crawl_logs.*
       FROM rank_naver_logs
         LEFT JOIN rank_crawl_logs ON rank_crawl_idx = rank_crawl_logs.idx
       WHERE ((rank_crawl_idx IN (SELECT idx
                                  FROM rank_crawl_logs
                                  WHERE createdAt >= Now() - INTERVAL 1 DAY))) AND
             (createdAt >= Now() - INTERVAL 1 DAY))
      UNION ALL
      (SELECT
         title,
         rank,
         rank_crawl_logs.*
       FROM rank_daum_logs
         LEFT JOIN rank_crawl_logs ON rank_crawl_idx = rank_crawl_logs.idx
       WHERE ((rank_crawl_idx IN (SELECT idx
                                  FROM rank_crawl_logs
                                  WHERE createdAt >= Now() - INTERVAL 1 DAY))) AND
             (createdAt >= Now() - INTERVAL 1 DAY))
      UNION ALL
      (SELECT
         title,
         rank,
         rank_crawl_logs.*
       FROM rank_zum_logs
         LEFT JOIN rank_crawl_logs ON rank_crawl_idx = rank_crawl_logs.idx
       WHERE ((rank_crawl_idx IN (SELECT idx
                                  FROM rank_crawl_logs
                                  WHERE createdAt >= Now() - INTERVAL 1 DAY))) AND
             (createdAt >= Now() - INTERVAL 1 DAY))) AS asdf
GROUP BY title
ORDER BY rank_count DESC
LIMIT 10;`;

  let result = [];
  await sequelize.query(RAW_QUERY).spread(async (results, metadata) => {
    console.log(result);
    console.log(metadata);
    result = results;
  });

  ctx.body = result;

});

router.get('/today', async (ctx, next) => {

  const RAW_QUERY = `
SELECT
  title,
  Avg(rank)    AS rank_avg,
  Count(title) AS count,
  rank_crawl_logs.*
FROM rank_naver_logs
  LEFT JOIN rank_crawl_logs ON rank_crawl_idx = rank_crawl_logs.idx
  WHERE ((rank_crawl_idx IN (SELECT idx
                           FROM rank_crawl_logs
                           WHERE createdAt >= Now() - INTERVAL 1 DAY))) AND
      (createdAt >= Now() - INTERVAL 1 DAY)
UNION
SELECT
  title,
  Avg(rank)    AS rank_avg,
  Count(title) AS count,
  rank_crawl_logs.*
  FROM rank_daum_logs
  LEFT JOIN rank_crawl_logs ON rank_crawl_idx = rank_crawl_logs.idx
  WHERE ((rank_crawl_idx IN (SELECT idx
                           FROM rank_crawl_logs
                           WHERE createdAt >= Now() - INTERVAL 1 DAY))) AND
      (createdAt >= Now() - INTERVAL 1 DAY)
  GROUP BY title
  ORDER BY createdAt DESC,
  count DESC`;

  let result = [];
  await sequelize.query(RAW_QUERY).spread(async (results, metadata) => {
    result = results;
  });

  ctx.body = result;

});

router.get('/keyword/:keyword', async (ctx, next) => {

  const response = {};
  const ranks: RankType[] = ['naver', 'daum', 'zum'];

  const searchKeyword = sequelize.escape(ctx.params.keyword);

  for (const rank of ranks) {
    const RAW_QUERY = `
  SELECT
  rank_crawl_logs.createdAt,
  rank_${rank}_logs.rank_crawl_idx,
  rank_${rank}_logs.rank,
  rank_${rank}_logs.title
  FROM rank_crawl_logs 
  LEFT JOIN rank_${rank}_logs ON rank_crawl_logs.idx = rank_${rank}_logs.rank_crawl_idx
  WHERE createdAt >= Now() - INTERVAL 1 HOUR AND
      REPLACE(title, ' ', '') = REPLACE(${searchKeyword}, ' ', '')
  GROUP BY createdAt
  ORDER BY createdAt ASC;`;

    await sequelize.query(RAW_QUERY).spread((results, metadata) => {
      response[rank] = results;
      console.log(results);
    });
  }

  console.log(response);

  ctx.body = response;

});

export default router;
