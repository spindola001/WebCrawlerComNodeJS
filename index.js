const request = require('request-promise');
const cheerio = require('cheerio');
const excel = require('excel4node');

const wb = new excel.Workbook();
const ws = wb.addWorksheet('AMAZON');

var style = wb.createStyle({
    font: {
        color: '#FF0800',
        size: 12,
    },
    //numberFormat: '$#,##0.00; ($#,##0.00); -', 
});

const url = 'https://www.amazon.com.br/s?k=iphone&__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss';
const newEncode = encodeURI(url);

const crawl ={

    uri: (newEncode),
    gzip: true,
    transform: function (body){
        return cheerio.load(body);
    }

}

request(crawl)
    .then(($) => {
        const produtos = []
        $('div[class="sg-col-20-of-24 s-result-item sg-col-0-of-12 sg-col-28-of-32 sg-col-16-of-20 sg-col sg-col-32-of-36 sg-col-12-of-16 sg-col-24-of-28"]').each((i, item)=>{
            const produto = {
                nome: $(item).find('span[class="a-size-medium a-color-base a-text-normal"]').text(),
                preco: $(item).find('span[class="a-price-whole"], span[class="a-price-fraction"]').text(),
                //alguns produtos não tem preço, a unica opção foi usar os preços de oferta
                ofertasDeProdutosSemPreco: $(item).find('span[class="a-color-base"]').text(),
            }
            
            const stringProdutosSemPreco = produto.ofertasDeProdutosSemPreco;
            const StringSemPrecoInt = stringProdutosSemPreco.substring(2);
            const StringsemPrecoIntReplace = StringSemPrecoInt.replace(".","").replace(",",".");
            const preco = produto.preco;
            const precoInt = preco.replace(".","").replace(",",".");
            
            
            if (!produto.preco){
                var cast = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(StringsemPrecoIntReplace);
            }else if(!produto.ofertasDeProdutosSemPreco){
                var cast = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoInt);
            }else{
                var cast =  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoInt);
            }

            // console.log(produto);

            ws.cell(i + 1, 1).string(produto.nome).style(style);
            //preciso converter esse o preço para number
            ws.cell(i + 1, 2).string(cast).style(style);

            wb.write('PlanilhaAmazon.xlsx');
            
        });
    })
    .catch((err) => {
        console.log(err);
    })

