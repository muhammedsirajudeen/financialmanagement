import yfinance as yf

def getliverate(ticker):
    stock = yf.Ticker(ticker)
    current_price = stock.history(period="1d")['Close'].iloc[-1]
    return int(current_price)
# Example usage
