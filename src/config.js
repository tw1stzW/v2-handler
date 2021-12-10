const ext = {
  tokens: ['token1', 'token2'],
  prefixes: [{ prefix: '!', space: false }, { prefix: '!!', space: false }]
};

/*

tokens kısmına, birden fazla botun tokenini girebilirsiniz.
proje tüm girdiğiniz tokenlere bağlanıp tüm eventleri onun için tekrar çalıştırır
aynı projeden iki bot çalıştırabilirsiniz yani, sadece yapmanız gereken token1 token2 yerlerini doldurmak.
eğer iki token istemiyorsanız , 'token2' yazan kısmı silin ve token1 kısmını doldurun.

prefixes kısmına botun prefixlerini yazabilirsiniz.
space değerini true yaparsanız boşluklu prefix olur. örnek: "{ prefix: 'test', space: true }" yazarsanız 
"test komutismi" yazılınca komut çalışır.

*/

module.exports = ext;