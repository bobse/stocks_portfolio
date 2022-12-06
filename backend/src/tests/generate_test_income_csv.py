from datetime import datetime, timedelta
import random
tickers = ['petr4','vale3','aesb3']
categories = ['interests','dividends']

now = datetime.now()
with open('income_test.csv','+w') as file:
    file.write('date,ticker,category,value\n')
    for i in range(0,2000):
        date = (datetime.now() + timedelta(minutes=i)).isoformat()
        ticker = tickers[random.randint(0,len(tickers)-1)]
        category = categories[random.randint(0,1)]
        value = round(random.uniform(20, 40),2)
        file.write(f"{date},{ticker},{category},{value}\n")
        
