SELECT MAX(hot_score) as hot_score ,gp.time
 from
(SELECT hot_score ,LEFT(time, 13) as time
FROM web3_exchange_data.hot_ranking hr
where time BETWEEN ${start_time} AND ${end_time}
  and instid = ${instid} AND hot_score > 0
ORDER BY hr.time ) gp
GROUP by gp.time
order BY gp.time;