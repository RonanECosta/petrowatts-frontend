export const calcularCustoMensalCombustao = async (rodagemKm, consumoKmL, valorL) => {
    console.log("Calculando custo mensal de combustão:");
    console.log("Rodagem (km):", rodagemKm);
    console.log("Consumo (km/L):", consumoKmL);
    console.log("Valor do combustível:", valorL);

    const consumoEmLitros = rodagemKm / consumoKmL;
    const custoMensal = consumoEmLitros * valorL;

    console.log("Custo mensal de combustão:", custoMensal);

    return custoMensal;
};

export const calcularCustoMensalEletrico = async (rodagemKm, consumoMjKm, valorKwh) => {
    console.log("Calculando custo mensal de elétrico:");
    console.log("Rodagem (km):", rodagemKm);
    console.log("Consumo (km/kWh):", consumoMjKm);
    console.log("Valor da eletricidade:", valorKwh);

    const consumoEmKWhKm = consumoMjKm / 3.6;
    const custoMensal = consumoEmKWhKm * rodagemKm * valorKwh;
    const custoMensalComPerda = custoMensal / 0.8; // Considerando uma perda de 20% na eficiência

    console.log("Custo mensal de elétrico (com perda):", custoMensalComPerda);

    return custoMensalComPerda;
};