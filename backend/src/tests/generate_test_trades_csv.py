from datetime import datetime, timedelta
import random

now = datetime.now()
with open('trades_test.csv','+w') as file:
    file.write('date,ticker,price,amount,fees\n')
    for i in range(0,2000):
        date = (datetime.now() + timedelta(minutes=i)).isoformat()
        ticker = 'petr4'
        amount = 1
        price = round(random.uniform(20, 40),2)
        fees = round(random.uniform(1, 3),2)
        file.write(f"{date},{ticker},{price},{amount},{fees}\n")
        
