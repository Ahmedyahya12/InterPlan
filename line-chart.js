const dataLine = {
    labels: ["Réalisées", "En attente"],
    datasets: [
      {
        name: "Tâches", type: "line",
        values: [20, 10] // Nombre de tâches réalisées et en attente
      }
    ]
  };
  
  const lineChart = new frappe.Chart("#line-chart", {
    title: "Pourcentage des tâches réalisées ou en attente",
    data: dataLine,
    type: 'line', // Type de graphique
    height: 250,
    colors: ['#7cd6fd']
  });
  