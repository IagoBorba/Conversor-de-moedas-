const apiKey = 'c564d45f747e58200c28e7b9';
const apiKey2 = '77d562d08e6c1db06ebd48c5';

let myChart;

async function obterTaxasDeCambio() {
    try {
        const url = `https://v6.exchangerate-api.com/v6/${apiKey2}/latest/USD`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.result === "success") {
            return data.conversion_rates;
        } else {
            throw new Error("Erro ao obter taxas de câmbio.");
        }
    } catch (error) {
        console.error('Erro ao obter taxas de câmbio:', error);
        return null;
    }
}

function gerarGraficoCotacao(moedaSelecionada = null) {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    obterTaxasDeCambio().then(rates => {
        if (!rates) return;

        // Moedas que queremos incluir no gráfico
        const moedasFiltradas = ["USD", "EUR", "JPY", "GBP", "BRL", "AUD", "CAD", "CHF", "CNY", "ARS"];
        const labels = moedasFiltradas.filter(moeda => rates[moeda]);
        const data = labels.map(moeda => rates[moeda]);
        const backgroundColors = labels.map(moeda => moeda === moedaSelecionada ? 'rgba(255, 99, 132, 0.8)' : 'rgba(75, 192, 192, 0.5)');

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cotação Atual',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    });
}

document.querySelector('.btn_converter').addEventListener('click', async () => {
    const quantia = parseFloat(document.getElementById('quantia').value);
    const fromCurrency = document.getElementById('moedaOrigem').value;
    const toCurrency = document.getElementById('moedaDestino').value;

    if (isNaN(quantia) || quantia <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }
    if (fromCurrency === toCurrency) {
        alert('As moedas de origem e destino não podem ser as mesmas.');
        return;
    }

    gerarGraficoCotacao(fromCurrency);

    const resultado = await converterMoeda(quantia, fromCurrency, toCurrency);
    if (resultado !== null) {
        document.getElementById('convertTo').value = resultado;
    }

    atualizarAreaMoedas(toCurrency);
});

async function converterMoeda(quantia, fromCurrency, toCurrency) {
    try {
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.result === "success") {
            return quantia * data.conversion_rate;
        } else {
            throw new Error("Erro ao converter moeda.");
        }
    } catch (error) {
        console.error('Erro ao converter moeda:', error);
        return null;
    }
}

const currencyAcceptance = {
    USD: ["Estados Unidos", "Porto Rico", "Equador", "El Salvador", "Panamá"],
    EUR: ["Zona do Euro", "França", "Alemanha", "Espanha", "Itália", "Irlanda"],
    JPY: ["Japão"],
    GBP: ["Reino Unido"],
    BRL: ["Brasil"],
    AUD: ["Austrália"],
    CAD: ["Canadá"],
    CHF: ["Suíça"],
    CNY: ["China"],
    ARS: ["Argentina"]
};

function atualizarAreaMoedas(currency) {
    const areaMoedas = document.querySelector('.Area_moedas');
    areaMoedas.innerHTML = '';

    if (currencyAcceptance[currency]) {
        const title = document.createElement('h3');
        title.textContent = `Países que aceitam ${currency}:`;
        areaMoedas.appendChild(title);

        const countryList = document.createElement('ul');
        currencyAcceptance[currency].forEach(country => {
            const listItem = document.createElement('li');
            listItem.textContent = country;
            countryList.appendChild(listItem);
        });
        areaMoedas.appendChild(countryList);
    } else {
        areaMoedas.textContent = 'Nenhuma informação disponível para esta moeda.';
    }
}

function atualizarHora() {
    const sp = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", timeStyle: "short" });
    const ny = new Date().toLocaleString("en-US", { timeZone: "America/New_York", timeStyle: "short" });
    const tokyo = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", timeStyle: "short" });
    const berlin = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin", timeStyle: "short" });

    document.getElementById("hora-sp").textContent = sp;
    document.getElementById("hora-ny").textContent = ny;
    document.getElementById("hora-tokyo").textContent = tokyo;
    document.getElementById("hora-berlin").textContent = berlin;
}

setInterval(atualizarHora, 60000);
atualizarHora();

gerarGraficoCotacao();

document.getElementById('btnEntrar').addEventListener('click', function() {
    document.getElementById('loginModal').style.display = 'block';
});

document.getElementById('btnCriarConta').addEventListener('click', function() {
    document.getElementById('criarContaModal').style.display = 'block';
});

document.getElementById('closeLogin').addEventListener('click', function() {
    document.getElementById('loginModal').style.display = 'none';
});

document.getElementById('closeCriarConta').addEventListener('click', function() {
    document.getElementById('criarContaModal').style.display = 'none';
});

window.addEventListener('click', function(event) {
    const loginModal = document.getElementById('loginModal');
    const criarContaModal = document.getElementById('criarContaModal');

    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target === criarContaModal) {
        criarContaModal.style.display = 'none';
    }
});
    
const chatButton = document.createElement('button');
chatButton.classList.add('chat-button');
chatButton.innerText = "💬";
document.body.appendChild(chatButton);

const chatWindow = document.createElement('div');
chatWindow.classList.add('chat-window');
chatWindow.style.display = 'none';
document.body.appendChild(chatWindow);

chatButton.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'block' : 'none';
});

const quickReplies = [
    "Qual é a taxa de câmbio atual do USD para o EUR?",
    "Quais países aceitam a moeda EUR?",
    "Como converto uma quantia de BRL para USD?",
    "Qual moeda está mais valorizada agora?",
    "Como funciona a cotação entre diferentes moedas?"
];

function sendQuickReply(reply) {
    const userMessage = document.createElement('div');
    userMessage.classList.add('user-message');
    userMessage.innerText = reply;
    chatWindow.appendChild(userMessage);

    getAIResponse(reply);
}
quickReplies.forEach(reply => {
    const quickReplyButton = document.createElement('button');
    quickReplyButton.classList.add('quick-reply');
    quickReplyButton.innerText = reply;
    quickReplyButton.addEventListener('click', () => sendQuickReply(reply));
    chatWindow.appendChild(quickReplyButton);
});

function getAIResponse(message) {
    const botResponse = document.createElement('div');
    botResponse.classList.add('bot-message');
    botResponse.innerText = "Pesquisando...";
    chatWindow.appendChild(botResponse);

    setTimeout(() => {
        switch (message) {
            case quickReplies[0]:
                botResponse.innerText = "A taxa atual do USD para EUR é 1.10.";
                break;
            case quickReplies[1]:
                botResponse.innerText = "Países que aceitam EUR: Zona do Euro, França, Alemanha...";
                break;
            case quickReplies[2]:
                botResponse.innerText = "Para converter de BRL para USD, utilize a função de conversão de quantia.";
                break;
            case quickReplies[3]:
                botResponse.innerText = "Atualmente, o USD está mais valorizado que outras moedas.";
                break;
            case quickReplies[4]:
                botResponse.innerText = "A cotação entre moedas é baseada no mercado financeiro global.";
                break;
            default:
                botResponse.innerText = "Estou aqui para responder questões de câmbio!";
                break;
        }
    }, 1000);
}
