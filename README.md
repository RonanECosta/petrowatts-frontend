# PetroWatts - Front-end

Este é um MVP que será apresentado como Trabalho de Conclusão de Curso (TCC) da Pós-graduação da PUC-Rio.

## Funcionamento do front-end

Composto de páginas html, folha de estilos CSS e arquivos JavaScript modularizados. O sistema se comunica com o backend e com APIs públicas.

## Sobre a aplicação

O objetivo do sistema é apresentar ao usuário de maneira clara e intuitiva os custos necessários e a possível economia na troca de seu veículo a combustão por um elétrico, assim como o tempo que levará para que o investimento inicial seja "recuperado".

Para isso haverá um cadastro do usuário e seu estado de residência e, em seguida, o cadastro do seu carro a combustão.

Feito isso o usuário avança para uma página onde ele pode visualizar diferentes modelos de veículos elétricos, suas informações e comparar os custos para aquisição e os valores que serão economizados (ou não).

### Tecnologias Utilizadas

* **Frontend:** HTML, JavaScript, CSS
* **Backend:** Python, banco de dados MySQL, Docker
* **Documentação:** Swagger para documentar as APIs

## Preparação do ambiente de execução

Na primeira sprint bastava executar o index.html. Porém devido ao crescimento do projeto e adoção de modularização nos arquivos java script, NÃO é possível executar o arquivo diretamente.

*Nota: Necessário que o docker esteja instalado na máquina.*

### Executar o projeto completo

1. Clone os repositórios referentes ao backend (`petrowatts`) e ao frontend (`petrowatts-frontend`), sendo de suma importância que a pasta raiz desses projetos estejam compartilhando o mesmo diretório da sua máquina, e estejam no mesmo nível diretorial

    ```cmd
    git clone <URL_DO_REPOSITORIO_PETROWATTS>
    git clone <URL_DO_REPOSITORIO_PETROWATTS_FRONTEND>
    ```

2. Acesse o backend (`petrowatts`) e suba os containers preparados via docker compose, são eles: banco de dados MySQL, o servidor web Nginx e do backend API Python:

    ```bash
    cd petrowatts
    docker compose up --build -d
    ```

    *Nota: Na primeira execução, o banco MySQL será criado e populado automaticamente com os dados de carga inicial.*

3. Acesse a aplicação:

   * Backend API / Documentação Interativa (Swagger): <http://localhost:5000/openapi>
   * Aplicação Web: <http://localhost:8080>

4. Para parar os containers:

    ```bash
    docker compose down
    ```

### Executar apenas o Frontend de forma isolada

1. Abra um terminal na raiz do repositório frontend.
2. Execute o comando:

    ```bash
    docker build -t petrowatts-frontend .
    docker run -d -p 8080:80 --name petrowatts-frontend petrowatts-frontend
    ```

3. no navegador de sua preferência, acesse <http://localhost:8080>

### Executar o frontend fora do docker

Desde que sua máquina possua o python devidamente instalado, siga os seguintes passos:

1. Abra um terminal
2. Navegue até a pasta do projeto frontend
3. Execute o comando:

    ``` bash
    python -m http.server 8080
    ```

4. no navegador de sua preferência, acesse <http://127.0.0.1:8080/index.html>

## Plano de desenvolvimento

### Primeira Sprint

* home html, com css e js
* cadastro de usuário
* cadatro de carro a combustão
* carga inicial de dados no BD

### Segunda Sprint

* construção de página "dashboard" com dados do veículo a combustão e elétrico
* aumento de quantidade de informações
* construção de métodos comparativos
* consulta a apis públicas

### Terceira Sprint

* À definir;
