
const apiUrl = 'https://mindicador.cl/api';
const currencySelect = document.getElementById('currency');
const resultDisplay = document.getElementById('result');
const chartCanvas = document.getElementById('chart');
let chart;

async function fetchIndicators() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const currencies = ['dolar', 'euro'];
    currencies.forEach(code => {
      if (data[code]) {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${code.toUpperCase()} - ${data[code].nombre}`;
        currencySelect.appendChild(option);
      }
    });
  } catch (error) {
    resultDisplay.textContent = 'Error al cargar monedas. Intente más tarde.';
  }
}

async function convertCurrency() {
  const amount = parseFloat(document.getElementById('amount').value);
  const selectedCurrency = currencySelect.value;
  if (!amount || !selectedCurrency) return;

  try {
    const response = await fetch(`${apiUrl}/${selectedCurrency}`);
    const data = await response.json();
    const rate = data.serie[0].valor;
    const converted = (amount / rate).toFixed(2);
    resultDisplay.textContent = `Resultado: $${converted} ${selectedCurrency.toUpperCase()}`;

    const labels = data.serie.slice(0, 10).reverse().map(e => e.fecha.split('T')[0]);
    const values = data.serie.slice(0, 10).reverse().map(e => e.valor);

    if (chart) chart.destroy();
    chart = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `Historial últimos 10 días (${selectedCurrency.toUpperCase()})`,
          data: values,
          fill: false,
          borderColor: 'blue',
          tension: 0.1
        }]
      }
    });
  } catch (error) {
    resultDisplay.textContent = 'Error en la conversión. Intente nuevamente.';
  }
}

fetchIndicators();
