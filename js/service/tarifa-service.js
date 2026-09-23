export const buscarTarifaEnergiaUf = async (ufUsuario) => {
    if (!ufUsuario) return;

    try {

        console.log("Buscando tarifa de energia para o estado:", ufUsuario);
        const responseTarifa = await fetch(`https://my.api.mockaroo.com/tarifas?uf=${ufUsuario}&key=d98ffdf0`);

        const dadosTarifa = await responseTarifa.json();
        console.log("Dados da tarifa recebidos:", dadosTarifa);

        const valorTarifa = dadosTarifa.length > 0
            ? Number.parseFloat(dadosTarifa[0].tarifa)
            : 0.95;

        console.log("Valor da tarifa calculado:", valorTarifa);

        return valorTarifa;
    } catch (error) {
        console.error("Erro ao obter tarifa de energia:", error);
    }
};