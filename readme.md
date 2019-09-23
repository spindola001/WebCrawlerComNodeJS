Este WebCrawler acessa a pagina da Amazon na pesquisa pelo termo Iphone e filtra a descrição dos produtos e o preço. No final esses dados são armazenados em uma tabela do Excel.

Para rodar o projeto é necessário instalar as seguintes bibliotecas:

request-promise
cheerio
excel4node
Para isso, no terminal (na pasta do projeto) rode o seguinte comando:

npm i -S request request-promise cheerio excel4node

Após rodar o comando acima, basta rodar o arquivo index.js com o seguinte comando:

node index.js