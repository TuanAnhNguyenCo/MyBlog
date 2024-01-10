import pandas as pd


acc = pd.read_csv('account.csv')
for i, j in acc.iterrows():
    print(j['username'])
   
