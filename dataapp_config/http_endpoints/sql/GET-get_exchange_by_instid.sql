SELECT DISTINCT exchange
FROM web3_exchange_data.crypto_info
WHERE instid=${instid}
ORDER by exchange;