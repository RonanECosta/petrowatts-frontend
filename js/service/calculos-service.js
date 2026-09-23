const calcularCustoTroca = (evEletrico) => {
    return evEletrico.preco || 0; // Simplificado, pode ser ajustado conforme a lógica real
};

const calcularEconomiaMensal = (evEletrico) => {
    return 450.00; // Valor simulado de economia de gasolina vs luz
};

const calcularMesesPayback = (custoTrocaEstimado, economiaMensalEstimada) => {
    return (custoTrocaEstimado / economiaMensalEstimada).toFixed(1);
};

export { calcularCustoTroca, calcularEconomiaMensal, calcularMesesPayback };