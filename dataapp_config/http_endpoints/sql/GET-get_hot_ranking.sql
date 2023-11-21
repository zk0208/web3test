SELECT hr.instid, hr.hot_score 
FROM web3_exchange_data.hot_ranking hr,
(
  SELECT instid, max(time) time
  FROM web3_exchange_data.hot_ranking hr2
  WHERE hot_score is not NULL AND hot_score > 0
  GROUP BY instid
) gp
WHERE hr.time = gp.time AND hr.instid = gp.instid
ORDER BY hr.hot_score DESC; 