export const calcularPontuacaoConforto = (listaAcessorios) => {
    console.log("Calculando pontuação de conforto para a lista de acessórios:", listaAcessorios);

    if (!Array.isArray(listaAcessorios) || listaAcessorios.length === 0) {
        return 0;
    }

    let pontuacaoTotal = 0;

    listaAcessorios.forEach(item => {
        const valor = Number.parseFloat(item.valor_tamanho) || 0;

        switch (item.id) {
            case 1: // Central Multimídia (Ex: 10.2 polegadas)
                pontuacaoTotal += valor * 4; // peso 4
                break;
            case 2: // ISOFIX (Ex: 2 pontos)
                pontuacaoTotal += valor * 5; // peso 5
                break;
            case 3: // Airbags (Ex: 4 ou 6 airbags)
                pontuacaoTotal += valor * 5; // peso 5
                break;
            case 4: // Teto Solar (Ex: 1.1 m²)
                pontuacaoTotal += valor * 20; // peso 20
                break;
            case 5: // Câmeras de Estacionamento (Ex: 1 ou 4 lentes)
                pontuacaoTotal += valor * 5; // peso 5
                break;
            default:
                pontuacaoTotal += valor;
                break;
        }
    });

    // Assumimos um teto máximo de 100 pontos para atingir 100% da barra
    const tetoMaximoConforto = 150;
    const porcentagemConforto = Math.min(Math.max((pontuacaoTotal / tetoMaximoConforto) * 100, 0), 100);
    console.log("Pontuação total de conforto calculada:", pontuacaoTotal);
    return Math.round(porcentagemConforto);
};

export const calcularPontuacaoAutonomia = (autonomia) => {
    console.log("Calculando pontuação de autonomia para:", autonomia);

    const tetoMaximoAutonomia = 500; // Exemplo: 500 km de autonomia máxima considerada
    const porcentagemAutonomia = calcularPontuacao(autonomia, tetoMaximoAutonomia);
    console.log("Pontuação total de autonomia calculada:", autonomia);
    return porcentagemAutonomia;
};

// potencia
export const calcularPontuacaoPotencia = (potencia) => {
    console.log("Calculando pontuação de potência para:", potencia);

    const tetoMaximoPotencia = 300;
    const porcentagemPotencia = calcularPontuacao(potencia, tetoMaximoPotencia);
    console.log("Pontuação total de potência calculada:", potencia);
    return porcentagemPotencia;
};

export const calcularPontuacaoPreco = (preco) => {
    console.log("Calculando pontuação de preço para:", preco);

    const tetoMaximoPreco = 500000;
    const porcentagemPreco = calcularPontuacao(preco, tetoMaximoPreco);
    console.log("Pontuação total de preço calculada:", preco);
    return porcentagemPreco;
};

export const calcularPontuacaoCustoBeneficio = (pctPreco, pctConforto, pctAutonomia, pctPotencia) => {
    console.log("Calculando pontuação de custo-benefício para:", pctPreco, pctConforto, pctAutonomia, pctPotencia);

    const tetoMaximoCustoBeneficio = 90;// em tese seria possível 100, mas para normalizar a barra agradavelmente 90

    const custo = pctPreco;
    const beneficio = (pctConforto * 5 + pctAutonomia * 3 + pctPotencia * 2) / 10;
    const custoBeneficio = (custo / beneficio)*100;
    const porcentagemCustoBeneficio = calcularPontuacao(custoBeneficio, tetoMaximoCustoBeneficio);
    console.log("Pontuação total de custo-benefício calculada:", custoBeneficio);
    return Math.round(porcentagemCustoBeneficio);
};

const calcularPontuacao = (valor, tetoMaximo) => {
    return Math.round(Math.min(Math.max((valor / tetoMaximo) * 100, 0), 100));
};
