const dataPie = {
    labels: ["Intervenant A", "Intervenant B", "Intervenant C"],
    datasets: [
      {
        values: [10, 15, 5] // Nombre de tâches réalisées par chaque intervenant
      }
    ]
  };
  
  const pieChart = new frappe.Chart("#pie-chart", {
    title: "Pourcentage des tâches réalisées par chaque intervenant",
    data: dataPie,
    type: 'pie', // Type de graphique
    height: 250,
    colors: ['#7cd6fd', '#743ee2', '#ff5858']
  });
  