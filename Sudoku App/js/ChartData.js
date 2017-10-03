new Chart(document.getElementById("line-chart"), {
  type: 'line',
  data: {
    labels: Array.from({length:10}, (e,i) => i+1), 
    datasets: [{ 
        data: [86,114,106,106,107,111,133,221],
        label: "Easy",
        borderColor: "#088A08",
        fill: false
      }, { 
        data: [282,350,411,502,635,809,947,1402,3700,300],
        label: "Normal",
        borderColor: "#FF8000",
        fill: false
      }, { 
        data: [168,170,178,190,203,276,408,547,675,734],
        label: "Hard",
        borderColor: "#0B0B61",
        fill: false
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'Time spent (minutes) in the last 10 games by difficulty.'
    }
  }
});


let a = [2478,5267,734]//promise.then->
	
new Chart(document.getElementById("pie-chart"), {	
    type: 'pie',
    data: {
      labels: ["Easy","Normal","Hard"],
      datasets: [{
        label: "Level",
        backgroundColor: ["#088A08", "#FF8000","#0B0B61"],
        data: [a[0],a[1],a[2]]
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Games won by difficulty.'
      }
    }
});