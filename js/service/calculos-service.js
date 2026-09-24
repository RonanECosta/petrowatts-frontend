const calcularCustoTroca = (evEletrico, combustaoValorRevenda, necessitaInfra) => {
    console.log("Calculando custo de troca: EV =", evEletrico, "Combustão valor revenda =", combustaoValorRevenda);
    const custoInfra = necessitaInfra ? 10000 : 0; // Exemplo de custo de infraestrutura
    const custoTroca = evEletrico - combustaoValorRevenda + custoInfra;
    console.log("Custo de troca calculado:", custoTroca);
    return custoTroca;
};

const calcularEconomiaMensal = (rodagemKm, kmL, combustivelL, custoKmEletrico, custoKmCombustao) => {
    console.log("Calculando economia mensal: Rodagem =", rodagemKm, "km/L =", kmL, "Combustível L =", combustivelL, "Custo km elétrico =", custoKmEletrico, "Custo km combustão =", custoKmCombustao);
    const custoCarro = (rodagemKm / kmL) * combustivelL;
    const economiaMensal = (rodagemKm * custoKmCombustao) - (rodagemKm * custoKmEletrico);
    console.log("Economia mensal calculada:", economiaMensal);
    return economiaMensal;
};

const calcularMesesPayback = (custoTrocaEstimado, economiaMensalEstimada) => {
    console.log("Calculando meses de payback: Custo troca =", custoTrocaEstimado, "Economia mensal =", economiaMensalEstimada);
    if (economiaMensalEstimada === 0) return Infinity; // Evita divisão por zero
    return (custoTrocaEstimado / economiaMensalEstimada).toFixed(1);
};

export { calcularCustoTroca, calcularEconomiaMensal, calcularMesesPayback };