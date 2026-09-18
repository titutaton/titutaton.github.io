/*
 * Кошелёк — один на все страницы.
 *
 * Библиотека TON Connect грузится только когда она нужна: либо человек сам
 * нажал на кнопку, либо кошелёк уже подключён с прошлого раза. Пока ни того,
 * ни другого, страница остаётся тем, чем была, — зверятами без единой
 * внешней зависимости.
 *
 * Сеанс живёт в localStorage самого TON Connect, поэтому при переходе между
 * страницами кошелёк не вылетает: он восстанавливается сам.
 */
(function () {
    'use strict';

    var CFG = window.TTN_NET || {};
    var ui = null, account = null, listeners = [], btn = null, menu = null;

    /* Кошелёк отдаёт сырой адрес вида 0:5f9d…, а человек знает свой как
       0Q… или UQ…. Переводим сами: заголовок, рабочая цепочка, хеш и crc16.
       Сверено с @ton/core на трёх адресах в обе сети. */
    function friendly(raw) {
        var parts = raw.split(':'), wc = parseInt(parts[0], 10), hex = parts[1], i, k;
        var b = new Uint8Array(36);
        b[0] = 0x51 | (CFG.NETWORK === '-3' ? 0x80 : 0);   // не-bounceable, как показывают кошельки
        b[1] = wc < 0 ? 0xFF : wc;
        for (i = 0; i < 32; i++) b[2 + i] = parseInt(hex.substr(i * 2, 2), 16);
        var crc = 0;
        for (i = 0; i < 34; i++) {
            crc ^= b[i] << 8;
            for (k = 0; k < 8; k++) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
        }
        b[34] = crc >> 8;
        b[35] = crc & 0xFF;
        var s = '';
        for (i = 0; i < 36; i++) s += String.fromCharCode(b[i]);
        return btoa(s).replace(/\+/g, '-').replace(/\//g, '_');
    }

    function short(a) { return a.slice(0, 4) + '…' + a.slice(-4); }

    function announce() {
        for (var i = 0; i < listeners.length; i++) listeners[i](account);
        if (!btn) return;
        btn.textContent = account ? short(friendly(account.address)) : 'Подключить кошелёк';
        btn.classList.toggle('on', !!account);
    }

    function loadLib() {
        if (window.TON_CONNECT_UI) return Promise.resolve();
        return new Promise(function (ok, fail) {
            var s = document.createElement('script');
            s.src = CFG.UI_CDN;
            s.onload = ok;
            s.onerror = function () { fail(new Error('не загрузилась библиотека кошелька')); };
            document.head.appendChild(s);
        });
    }

    function ensureUi() {
        if (ui) return Promise.resolve(ui);
        return loadLib().then(function () {
            ui = new window.TON_CONNECT_UI.TonConnectUI({ manifestUrl: CFG.MANIFEST });
            ui.onStatusChange(function (w) {
                account = w ? w.account : null;
                announce();
            });
            return ui;
        });
    }

    /* Меню вместо мгновенного отключения: нажатие на подключённый кошелёк
       не должно молча выкидывать из него — это ровно то, чего не ждут. */
    function closeMenu() {
        if (!menu) return;
        menu.remove();
        menu = null;
        document.removeEventListener('click', onOutsideClick, true);
    }

    function onOutsideClick(e) {
        if (menu && !menu.contains(e.target) && e.target !== btn) closeMenu();
    }

    function openMenu() {
        closeMenu();
        menu = document.createElement('div');
        menu.className = 'wallet-menu';

        var where = document.createElement('p');
        where.className = 'wallet-menu-addr';
        var a = friendly(account.address);
        where.textContent = a.slice(0, 8) + '…' + a.slice(-6);
        menu.appendChild(where);

        var exit = document.createElement('button');
        exit.type = 'button';
        exit.textContent = 'Отключить';
        exit.addEventListener('click', function () {
            closeMenu();
            if (ui) ui.disconnect();
        });
        menu.appendChild(exit);

        btn.parentNode.insertBefore(menu, btn.nextSibling);
        setTimeout(function () { document.addEventListener('click', onOutsideClick, true); }, 0);
    }

    window.Wallet = {
        /** привязать кнопку в шапке; сеанс с прошлой страницы подхватится сам */
        bind: function (el) {
            btn = el;
            el.addEventListener('click', function () {
                if (account) { menu ? closeMenu() : openMenu(); return; }
                ensureUi().then(function (u) { return u.openModal(); })
                    .catch(function (e) { el.textContent = e.message; });
            });
            /* Уже подключались? Тогда поднимаем библиотеку сразу, чтобы кнопка
               не врала «подключить», когда кошелёк на самом деле на связи. */
            try {
                for (var i = 0; i < localStorage.length; i++)
                    if (localStorage.key(i).indexOf('ton-connect') === 0) { ensureUi(); break; }
            } catch (e) { /* приватное окно — переживём */ }
        },

        /** сообщать об изменениях (подключился, отключился, сменился) */
        on: function (cb) { listeners.push(cb); cb(account); },

        address: function () { return account ? account.address : null; },
        friendlyAddress: function () { return account ? friendly(account.address) : null; },
        chain: function () { return account ? account.chain : null; },

        /** подключить, если ещё нет, и вернуть готовый кошелёк */
        connect: function () {
            return ensureUi().then(function (u) {
                if (account) return u;
                /* connectWallet открывает окно выбора и ждёт, пока человек
                   подключится. openModal возвращается сразу, и с ним страница
                   успевала объявить «кошелёк не подключён», пока окно ещё
                   открыто перед носом. */
                return u.connectWallet().then(function () { return u; });
            });
        },

        send: function (messages) {
            return ensureUi().then(function (u) {
                return u.sendTransaction({
                    validUntil: Math.floor(Date.now() / 1000) + 300,
                    network: CFG.NETWORK,
                    messages: messages,
                });
            });
        },
    };
})();
