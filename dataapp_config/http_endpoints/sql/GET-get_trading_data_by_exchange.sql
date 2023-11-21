SELECT curr_price, update_time
FROM web3_exchange_data.crypto_info
WHERE exchange=${exchange} AND instid=${instid}
  ORDER by update_time;