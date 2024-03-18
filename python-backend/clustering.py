import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import base64
from io import BytesIO
def AiCode(data):
    df = pd.DataFrame(data)
    df = df.dropna(subset=['date'])
    label_encoder = LabelEncoder()
    df['type'] = label_encoder.fit_transform(df['type'])
    df.dropna(inplace=True)

    X = df[['amount', 'type']]
    kmeans = KMeans(n_clusters=3)  # Specify the number of clusters
    kmeans.fit(X)  # Fit the model to your data

    # Get cluster labels
    labels = kmeans.labels_

    # Plotting data points with their assigned clusters
    fig, ax = plt.subplots(figsize=(8, 6))
    for i in range(3):
        ax.scatter(X[labels == i]['amount'], X[labels == i]['type'], label=f'Cluster {i+1}')
    ax.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], marker='x', color='red', label='Centroids')
    ax.set_xlabel('Amount')
    ax.set_ylabel('Type')
    ax.set_title('Clustering Results')
    ax.legend()

    # Convert plot to base64 string
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    base64_image = base64.b64encode(buffer.read()).decode('utf-8')

    # Close plot to free memory
    plt.close()

    # Get the most spent amount for each cluster with type
    most_spent_amount = {}
    for i in range(3):
        cluster_data = df[labels == i]
        most_spent_amount[i+1] = {
            'type': label_encoder.inverse_transform([cluster_data['type'].value_counts().idxmax()])[0],
            'amount': cluster_data.groupby('type')['amount'].sum().max()
        }

    return most_spent_amount, base64_image
