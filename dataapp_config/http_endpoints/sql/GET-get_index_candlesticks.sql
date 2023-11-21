SELECT * 
FROM web3_exchange_data.index_candlesticks
WHERE exchange=${exchange} AND instid=${instid} 
  AND time BETWEEN ${min_time} AND ${max_time} 
  AND time_interal = ${time_interal}
ORDER BY time;