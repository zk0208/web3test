SELECT curr_price, base_volume, update_time
FROM web3_exchange_data.crypto_info ci 
WHERE instid = ${instid} 
  AND update_time BETWEEN ${start_time} AND ${end_time}
order by update_time;