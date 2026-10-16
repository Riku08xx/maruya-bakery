/* =========================================
   まるや製パン  ページを開いたときの「パンがうわーっと出てくる」演出
   -----------------------------------------
   ・ブラウザを開いて最初に見たときだけ出ます（同じタブで戻ってきたときは出ません）
   ・画面を押すと、すぐに終わります
   ・パソコンやスマホで「動きを減らす」設定にしている人には出ません
   ========================================= */

(function () {
  const BREAD_COUNT = 36;      // 飛び出すパンの数
  const SHOW_TIME = 2400;      // 何ミリ秒（1000で1秒）見せてから消すか
  const IMAGES = [
    "images/anpan.jpg", "images/melonpan.jpg", "images/currypan.jpg",
    "images/shokupan.jpg", "images/creampan.jpg", "images/koppepan.jpg",
  ];

  const intro = document.getElementById("intro");
  if (!intro) return;

  // 2回目以降・動きを減らす設定のときは、すぐ消す
  let seen = false;
  try { seen = sessionStorage.getItem("maruya-intro") === "1"; } catch (e) {}
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (seen || reduce || !intro.animate) {
    intro.remove();
    return;
  }
  try { sessionStorage.setItem("maruya-intro", "1"); } catch (e) {}

  // パンを1つずつ作って、看板のうしろから四方八方へ飛ばす
  const box = intro.querySelector(".intro-breads");
  const w = window.innerWidth;
  const h = window.innerHeight;
  // 飛ぶ範囲は画面の横・縦それぞれに合わせる（スマホの細長い画面でも横に飛び出しすぎない）
  const farX = w * 0.55;
  const farY = h * 0.45;

  for (let i = 0; i < BREAD_COUNT; i++) {
    const img = document.createElement("img");
    img.src = IMAGES[i % IMAGES.length];
    img.alt = "";
    img.className = "intro-bread";
    const size = 48 + Math.random() * 64;              // 大きさ 48〜112px
    img.style.width = img.style.height = size + "px";
    img.style.margin = (-size / 2) + "px 0 0 " + (-size / 2) + "px";  // まん中を基準にする
    box.append(img);

    const angle = Math.random() * Math.PI * 2;          // 飛ぶ向き
    const dist = 0.45 + Math.random() * 0.6;            // 飛ぶ距離（範囲に対する割合）
    const dx = Math.cos(angle) * farX * dist;
    const dy = Math.sin(angle) * farY * dist - h * 0.22; // 上向きに打ち上げる
    const spin = (Math.random() - 0.5) * 720;           // くるくる回る
    const delay = Math.random() * 350;                  // 出るタイミングを少しずつずらす

    img.animate([
      { transform: "translate(0px, 0px) scale(0.2) rotate(0deg)", opacity: 0 },
      { transform: "translate(" + dx * 0.9 + "px, " + dy * 0.9 + "px) scale(1) rotate(" + spin * 0.6 + "deg)", opacity: 1, offset: 0.45 },
      { transform: "translate(" + dx + "px, " + (dy + h * 0.6) + "px) scale(0.9) rotate(" + spin + "deg)", opacity: 1 },
    ], {
      duration: 1900 + Math.random() * 500,
      delay: delay,
      easing: "cubic-bezier(.2,.7,.4,1)",
      fill: "both",
    });
  }

  // 消す（ふわっと透明にしてから取りのぞく）
  let done = false;
  function finish() {
    if (done) return;
    done = true;
    intro.classList.add("intro-hide");
    setTimeout(function () { intro.remove(); }, 600);
  }
  setTimeout(finish, SHOW_TIME);
  intro.addEventListener("click", finish);
})();
