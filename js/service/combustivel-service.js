export const buscarPrecoCombustivelUf = async (ufUsuario) => {
    if (!ufUsuario) return null;

    try {
        console.log("Buscando valor médio do combustível para o estado:", ufUsuario);

        const response = await fetch("https://combustivelapi.com.br/api/precos/");

        if (!response.ok) {
            throw new Error("Erro ao consultar preços de combustível");
        }

        const dadosCombustivel = await response.json();

        console.log("Dados do combustível recebidos:", dadosCombustivel);

        const uf = ufUsuario.toLowerCase();

        const precoGasolina = dadosCombustivel?.precos?.gasolina?.[uf];

        if (!precoGasolina) {
            console.warn(`Preço não encontrado para a UF ${ufUsuario}`);
            return null;
        }

        const valorCombustivel = Number.parseFloat(precoGasolina.replace(',', '.'));

        console.log("Valor médio da gasolina:", valorCombustivel);

        return valorCombustivel;

    } catch (error) {
        console.error("Erro ao obter preço do combustível:", error);
        return null;
    }
};