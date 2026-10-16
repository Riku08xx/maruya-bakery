/* =========================================
   まるや製パン  おしらせを画面に並べるプログラム
   ふだんはこのファイルをさわる必要はありません。
   おしらせの中身は news.js を書きかえてください。
   ========================================= */

(function () {
  const SHOW_FIRST = 3;   // 最初に見せる件数
  const NEW_DAYS = 7;     // 何日以内なら「NEW」をつけるか

  const list = document.getElementById("news-list");
  const moreButton = document.getElementById("news-more");
  if (!list) return;

  // news.js が読みこめなかったときや、書き方をまちがえたとき
  if (typeof MARUYA_NEWS === "undefined" || !Array.isArray(MARUYA_NEWS)) {
    list.innerHTML = '<li class="news-empty">おしらせを読みこめませんでした。news.js の書き方（カンマやかっこ）を確認してください。</li>';
    if (moreButton) moreButton.hidden = true;
    return;
  }

  // 今日の日付（時刻は0時にそろえる）
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // "2026-10-16" → 日付に変換（変換できなければ null）
  function toDate(text) {
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(text || "").trim());
    if (!m) return null;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }

  const items = MARUYA_NEWS
    .map(function (n) { return { date: toDate(n.date), title: n.title || "", body: n.body || "" }; })
    .filter(function (n) { return n.date && n.date <= today && n.title; }) // 未来の日付・書きまちがいは表示しない
    .sort(function (a, b) { return b.date - a.date; });                   // 新しい順

  if (items.length === 0) {
    list.innerHTML = '<li class="news-empty">いまはおしらせはありません。</li>';
    if (moreButton) moreButton.hidden = true;
    return;
  }

  items.forEach(function (n, i) {
    const li = document.createElement("li");
    li.className = "news-item";
    if (i >= SHOW_FIRST) li.hidden = true;

    const time = document.createElement("time");
    time.className = "news-date";
    time.textContent = n.date.getFullYear() + "." + (n.date.getMonth() + 1) + "." + n.date.getDate();

    const title = document.createElement("h3");
    title.className = "news-title";
    title.textContent = n.title;   // textContent を使うので、記号を書いても安全

    const daysAgo = (today - n.date) / 86400000;
    if (daysAgo < NEW_DAYS) {
      const badge = document.createElement("span");
      badge.className = "news-new";
      badge.textContent = "NEW";
      title.prepend(badge);
    }

    li.append(time, title);
    if (n.body) {
      const body = document.createElement("p");
      body.className = "news-body";
      body.textContent = n.body;
      li.append(body);
    }
    list.append(li);
  });

  // 「もっと見る」ボタン
  if (moreButton) {
    if (items.length <= SHOW_FIRST) {
      moreButton.hidden = true;
    } else {
      moreButton.addEventListener("click", function () {
        list.querySelectorAll(".news-item[hidden]").forEach(function (li) { li.hidden = false; });
        moreButton.hidden = true;
      });
    }
  }
})();
