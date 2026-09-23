const buscarTarifaEnergiaUf = async (ufUsuario) => {
    if (!ufUsuario) return;

    try {

        console.log("Buscando tarifa de energia para o estado:", ufUsuario);
        const responseTarifa = await fetch(`https://my.api.mockaroo.com/tarifas?uf=${ufUsuario}&key=d98ffdf0`);
        
        const dadosTarifa = await responseTarifa.json();
        console.log("Dados da tarifa recebidos:", dadosTarifa);
        
        const valorTarifa = dadosTarifa.tarifa || 0.95; // fallback caso dê erro
        console.log("Valor da tarifa calculado:", valorTarifa);

        document.getElementById('resTarifaUf').innerText = valorTarifa.toFixed(3);

        return valorTarifa;
    } catch (error) {
        console.error("Erro ao obter tarifa de energia:", error);
    }
};

const calcularCustoTroca = (evEletrico) => {
    return evEletrico.preco || 0; // Simplificado, pode ser ajustado conforme a lógica real
};

const calcularEconomiaMensal = (evEletrico) => {
    return 450.00; // Valor simulado de economia de gasolina vs luz
};

const calcularMesesPayback = (custoTrocaEstimado, economiaMensalEstimada) => {
    return (custoTrocaEstimado / economiaMensalEstimada).toFixed(1);
};