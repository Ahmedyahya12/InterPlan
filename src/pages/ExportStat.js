
 export function exportTableToCSV(filename) {
    let csv = [];
    let rows = document.querySelectorAll("table tr");

    for (let row of rows) {
      let cols = row.querySelectorAll("th, td");
      let rowData = [];
      for (let col of cols) {
        rowData.push(col.innerText);
      }
      csv.push(rowData.join(","));
    }

    let csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

 export function exportTableToExcel(filename) {
    let table = document.querySelector("table");
    let wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(wb, filename);
  }

 
 