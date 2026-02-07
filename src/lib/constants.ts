export const DEFAULT_CSS = `/* =========================================
   複数ボタン対応（縦積みレイアウト）
   ========================================= */

/* ボタンコンテナ：縦に並べる設定 */
.product-link-buttons {
    margin-top: auto; /* 下部に配置 */
    width: 100%;
    display: flex;
    flex-direction: column; /* 縦並び */
    gap: 10px;              /* ボタン間の隙間 */
}

/* 個別ボタンのスタイル上書き */
.hatena-asin-detail .asin-detail-buy {
    /* 横幅いっぱいに広げる */
    width: 100% !important;
    box-sizing: border-box; /* paddingを含めた幅計算 */
      
    /* 高さや文字位置の調整 */
    display: flex !important;
    align-items: center;
    justify-content: center;
    padding: 12px 0 !important; /* 少し高さを出して押しやすく */
    margin: 0 !important;       /* 余計なマージン削除 */
      
    /* フォント設定 */
    font-size: 14px !important;
    font-weight: bold !important;
    text-decoration: none !important;
    border-radius: 3px !important;
    transition: opacity 0.2s ease;
}

.hatena-asin-detail .asin-detail-buy:hover {
    opacity: 0.8;
}

/* --- ショップ別カラー定義 (デフォルト値) --- */

/* Amazon：指定のオレンジ */
.shop-amazon {
    background-color: #FF9900 !important;
    color: #ffffff !important;
}

/* AliExpress：指定の赤 */
.shop-aliexpress {
    background-color: #FF4747 !important;
    color: #ffffff !important;
}

/* Sunstella：元のAmazon風グレー */
/* はてなブログ標準のボタン色（薄いグレー）に近い色を再現 */
.shop-sunstella {
    background-color: #f0f0f0 !important;
    color: #333333 !important;
    border: 1px solid #ccc !important;
}
/* サンステラのみ、ホバー時に少し濃くする */
.shop-sunstella:hover {
    background-color: #e0e0e0 !important;
    opacity: 1 !important; /* 透明度は変えず色を変える */
}
`;
