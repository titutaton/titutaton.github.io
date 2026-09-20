/*
 * Куда смотрит сайт.
 *
 * Один файл на все страницы нарочно: адрес коллекции и сеть должны меняться
 * в одном месте, иначе галерея однажды будет показывать одну коллекцию, а
 * минт — уходить в другую.
 */
window.TTN_NET = {
    /* Адрес коллекции. Пусто — значит минтить ещё некуда, и страницы это
       честно говорят вместо того, чтобы делать вид. */
    COLLECTION: 'EQBHmqSzRdGoOlToZhRofsafDh5TjZp8bRtCWwObBgxvWikU',

    NETWORK: '-239',                              /* -3 тестнет, -239 мейннет */
    API: 'https://tonapi.io/v2',
    MARKET: 'https://getgems.io/collection/',
    EXPLORER: 'https://tonviewer.com/',
    PRICE_NANO: '300000000',                      /* 0.3 TON */

    /* Манифест описывает приложение кошельку: своё имя и значок вместо
       чужого — файл лежит рядом на GitHub Pages. */
    MANIFEST: 'https://titutaton.github.io/tonconnect-manifest.json',
    /* Своя копия TON Connect UI лежит рядом: на TON Site (tituta.ton) и при
       блокировке CDN чеканка всё равно должна подниматься. CDN — запасной. */
    UI_LOCAL: 'js/tonconnect-ui.min.js',
    UI_CDN: 'https://cdn.jsdelivr.net/npm/@tonconnect/ui@2/dist/tonconnect-ui.min.js',
};

/*
 * Тестнет — если понадобится вернуться. Активный объект выше сейчас мейннет;
 * это шаблон: копируем и подставляем тестнетовый адрес коллекции.
 *
window.TTN_NET = {
    COLLECTION: '<тестнет-адрес коллекции>',
    NETWORK: '-3',
    API: 'https://testnet.tonapi.io/v2',
    MARKET: 'https://testnet.getgems.io/collection/',
    EXPLORER: 'https://testnet.tonviewer.com/',
    PRICE_NANO: '300000000',
    MANIFEST: 'https://titutaton.github.io/tonconnect-manifest.json',
    UI_LOCAL: 'js/tonconnect-ui.min.js',
    UI_CDN: 'https://cdn.jsdelivr.net/npm/@tonconnect/ui@2/dist/tonconnect-ui.min.js',
};
*/
