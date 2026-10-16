/* =========================================
   まるや製パン  パンを押したときの「おすすめ」
   -----------------------------------------
   ★ おすすめを変えるときは、下の MARUYA_PAIRING だけを書きかえます ★

   書き方（パン1種類分）：
     anpan: {
       drink: { name: "飲み物の名前", why: "合う理由" },
       others: [ { id: "ほかのパンの名前（英語）", why: "合う理由" }, ... ],
     },

   ・パンの名前（英語）は index.html の data-bread="〇〇" と同じにします
     anpan / melonpan / currypan / shokupan / creampan / koppepan
   ・パンの写真・名前・値段・説明は index.html から自動で読みこみます
   ========================================= */

const MARUYA_PAIRING = {
  anpan: {
    drink: { name: "あたたかい緑茶", why: "ほろ苦い緑茶が、つぶあんのやさしい甘さを引き立てます。" },
    others: [
      { id: "creampan", why: "あんことカスタード、甘いもの好きの定番コンビ。" },
      { id: "shokupan", why: "明日の朝ごはん用に。トーストにあんこをのせても。" },
    ],
  },
  melonpan: {
    drink: { name: "冷たい牛乳", why: "さくさくの皮と冷たい牛乳は、子どもにも大人にも人気です。" },
    others: [
      { id: "anpan", why: "甘いパンの食べくらべに。" },
      { id: "koppepan", why: "ジャムやバターで、おやつをもう一品。" },
    ],
  },
  currypan: {
    drink: { name: "冷たいウーロン茶", why: "揚げたての油をさっぱり流してくれます。" },
    others: [
      { id: "koppepan", why: "しょっぱい・甘いを交互に。お昼ごはんにぴったり。" },
      { id: "melonpan", why: "食後のデザートがわりに。" },
    ],
  },
  shokupan: {
    drink: { name: "ホットコーヒー", why: "厚切りトーストのこうばしさと、コーヒーの香りがよく合います。" },
    others: [
      { id: "currypan", why: "トーストの朝ごはんに、おかずパンをひとつ。" },
      { id: "creampan", why: "朝のあまいおたのしみに。" },
    ],
  },
  creampan: {
    drink: { name: "ミルクティー", why: "まろやかな紅茶が、たまごたっぷりのカスタードによく合います。" },
    others: [
      { id: "melonpan", why: "午後のおやつを、ちょっとぜいたくに。" },
      { id: "anpan", why: "和と洋のあまいパンの食べくらべに。" },
    ],
  },
  koppepan: {
    drink: { name: "コーヒー牛乳", why: "昔ながらのコッペパンには、やっぱりびん入りのコーヒー牛乳。" },
    others: [
      { id: "currypan", why: "給食みたいな、なつかしい組み合わせ。" },
      { id: "anpan", why: "コッペパンをおかずに、あんぱんをおやつに。" },
    ],
  },
};


/* ===== ここから下は、ふだんさわらなくてOK（パンを押したときの動き） ===== */
(function () {
  const dialog = document.getElementById("bread-dialog");
  const cards = document.querySelectorAll(".card[data-bread]");
  if (!dialog || cards.length === 0) return;

  // index.html のカードから、パンの写真・名前・値段・説明を集める
  const breads = {};
  cards.forEach(function (card) {
    const img = card.querySelector(".photo img");
    breads[card.dataset.bread] = {
      name: card.querySelector("h3").textContent,
      text: card.querySelector("h3 + p").textContent,
      price: card.querySelector(".price").firstChild.textContent.trim(),
      img: img ? img.getAttribute("src") : "",
      alt: img ? img.alt : "",
    };
  });

  const el = {
    img: dialog.querySelector(".bd-photo img"),
    name: dialog.querySelector(".bd-name"),
    price: dialog.querySelector(".bd-price"),
    text: dialog.querySelector(".bd-text"),
    drinkName: dialog.querySelector(".bd-drink-name"),
    drinkWhy: dialog.querySelector(".bd-drink-why"),
    others: dialog.querySelector(".bd-others"),
    pairing: dialog.querySelector(".bd-pairing"),
  };

  function show(id) {
    const b = breads[id];
    if (!b) return;
    el.img.src = b.img;
    el.img.alt = b.alt;
    el.name.textContent = b.name;
    el.price.textContent = b.price + "円";
    el.text.textContent = b.text;

    const p = MARUYA_PAIRING[id];
    el.pairing.hidden = !p;
    if (p) {
      el.drinkName.textContent = p.drink.name;
      el.drinkWhy.textContent = p.drink.why;

      // 「いっしょにどうぞ」のパン（押すとそのパンに切りかわる）
      el.others.innerHTML = "";
      (p.others || []).forEach(function (o) {
        const other = breads[o.id];
        if (!other) return;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "bd-other";
        const pic = document.createElement("img");
        pic.src = other.img;
        pic.alt = "";
        const name = document.createElement("strong");
        name.textContent = other.name;
        const price = document.createElement("span");
        price.className = "bd-other-price";
        price.textContent = other.price + "円";
        const why = document.createElement("span");
        why.textContent = o.why;
        btn.append(pic, name, price, why);
        btn.addEventListener("click", function () {
          show(o.id);
          dialog.scrollTop = 0;
        });
        el.others.append(btn);
      });
    }

    if (!dialog.open) dialog.showModal();
  }

  // カードを押したら開く（キーボードの Enter・スペースでも開ける）
  cards.forEach(function (card) {
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", card.querySelector("h3").textContent + "のくわしい説明を見る");
    card.addEventListener("click", function () { show(card.dataset.bread); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        show(card.dataset.bread);
      }
    });
  });

  // 「×」ボタンと、まわりの暗いところを押したら閉じる（Esc キーでも閉じる）
  dialog.querySelector(".bd-close").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) dialog.close();
  });
})();
