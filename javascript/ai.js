const headers = {
    'Content-Type': 'application/json'
};
const url = "http://localhost:3000";
const aibackend = "http://localhost:5000";

window.onload = async () => {
    console.log("loaded");
    let token = window.localStorage.getItem('token');
    console.log(token);
    let response = await (await fetch(aibackend + "/cluster", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ token: token })
    })).json();
    
    let imagecontainer = document.querySelector(".imagecontainer");
    let image = document.createElement('img');
    image.className = "image";
    image.src = "data:image/png;base64, " + response.image;
    imagecontainer.appendChild(image);
    console.log(response);

    // Creating chart now
    let spent_data = response.spent_data;
    let labels = [];
    let values = [];
    for (let data of spent_data) {
        labels.push(data.type);
        values.push(data.amount);
    }
    var data = {
        labels: labels,
        datasets: [{
            label: "most spent areas",
            backgroundColor: "rgba(75,192,192,1)",
            data: values
        }]
    };
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};
