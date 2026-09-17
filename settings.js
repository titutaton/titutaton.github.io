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
    COLLECTION: 'kQDJtVVqVnQb5HnfxkmLFaaMROaD9GHUU0nCiOR2OUiLr2y9',

    NETWORK: '-3',                                /* -3 тестнет, -239 мейннет */
    API: 'https://testnet.tonapi.io/v2',
    MARKET: 'https://testnet.getgems.io/collection/',
    EXPLORER: 'https://testnet.tonviewer.com/',
    PRICE_NANO: '300000000',                      /* 0.3 TON */

    /* Манифест описывает приложение кошельку: своё имя и значок вместо
       чужого — файл лежит рядом на GitHub Pages. */
    MANIFEST: 'https://titutaton.github.io/tonconnect-manifest.json',
    UI_CDN: 'https://cdn.jsdelivr.net/npm/@tonconnect/ui@2/dist/tonconnect-ui.min.js',
};
