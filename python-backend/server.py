from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS from flask_cors
import requests
app = Flask(__name__)
CORS(app)  # Add CORS middleware to your Flask app
import json
# Sample data - replace with your actual data or database operations
from clustering import AiCode
from getliverate import getliverate
# Endpoint to get all books
@app.route('/', methods=['GET'])
def get_books():
    return jsonify({'message':'success'})

@app.route('/cluster', methods=['POST'])
def cluster():
    if(request.method=='POST'):
        request_data=request.json
        print(request_data)
        token=request_data['token']
        url="http://localhost:3000/getallexpense"

        response = requests.post(url, json.dumps({'token':token}), headers={'Content-Type': 'application/json'})
        if(response.status_code==200):
            print("request was successful")
            response_data=response.json()
            expenses=[]
            for expensearray in response_data['expense']:
                date=expensearray['date']
                for expense in expensearray['expensearray']:
                    expense['date']=date
                    del expense['_id']
                    expenses.append(expense)

            spent_data,image=AiCode(expenses)
            data=list(spent_data.values())
            print(data)
            for entry in data:
                entry['amount'] = int(entry['amount'])

            return jsonify({'message': 'success','spent_data':data, 'image': image})

        else:
            print("request failed")
            return jsonify({'message':'server error occured'})

@app.route('/livereturn', methods=['POST'])
def livereturn():
    if(request.method=='POST'):
        request_data=request.json
        token=request_data['token']
        token=request_data['token']
        url="http://localhost:3000/getallinvestments"

        response = requests.post(url, json.dumps({'token':token}), headers={'Content-Type': 'application/json'})
        
        if(response.status_code==200):
            response_data=response.json()
            investments=response_data['investments'][0]
            returns=[]
            for investment in investments['investarray']:
                print(investment)
                if(investment['type']=='stock'):
                    rate=getliverate(investment['name'])
                    print(rate)
                    percentage_change = ((rate - investment['amount']) / investment['amount']) * 100
                    print(int(percentage_change))
                    returns.append({'ticker':investment['name'],'percentage':int(percentage_change)})


            return {'message':'success','returns':returns}
        else:
            return {'message':'internal server error'}

if __name__ == '__main__':
    app.run(debug=True)
