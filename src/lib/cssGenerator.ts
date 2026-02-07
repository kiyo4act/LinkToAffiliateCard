export interface CssConfig {
    amazonColor: string;
    aliexpressColor: string;
    sunstellaBgColor: string;
    sunstellaTextColor: string;
}

export const DEFAULT_CSS_CONFIG: CssConfig = {
    amazonColor: '#FF9900',
    aliexpressColor: '#FF4747',
    sunstellaBgColor: '#f0f0f0',
    sunstellaTextColor: '#333333'
};

export const generateBlogCss = (config: CssConfig): string => {
    return `/* =========================================
   複数ボタン対応（完全版：マージン＆色分け対応）
   ========================================= */

/* ボタンコンテナ（ツール生成用） */
.product-link-buttons {
    margin-top: 12px !important; /* タイトルとの隙間 */
    width: 100%;
    display: flex;
    flex-direction: column; /* 縦並び */
    gap: 10px;              /* ボタン間の隙間 */
}

/* 個別ボタンの基本スタイル（デフォルト：Amazonオレンジ） */
.hatena-asin-detail .asin-detail-buy {
    width: 100% !important;
    box-sizing: border-box;
    
    display: flex !important;
    align-items: center;
    justify-content: center;
    padding: 12px 0 !important;
    margin: 0 !important;
    
    font-size: 14px !important;
    font-weight: bold !important;
    text-decoration: none !important;
    border-radius: 3px !important;
    transition: opacity 0.2s ease;

    /* デフォルト色（標準Amazonリンク用） */
    background-color: ${config.amazonColor} !important; 
    color: #ffffff !important;
}

/* 標準Amazonリンク（info直下のボタン）のみマージン復活 */
.hatena-asin-detail-info > .asin-detail-buy {
    margin-top: 12px !important;
}

.hatena-asin-detail .asin-detail-buy:hover {
    opacity: 0.8;
}

/* --- ショップ別カラー定義（詳細度を上げて強制上書き） --- */

/* Amazon（明示的に指定された場合） */
.hatena-asin-detail .asin-detail-buy.shop-amazon { 
    background-color: ${config.amazonColor} !important; 
    color: #ffffff !important;
}

/* AliExpress（赤） */
/* セレクタを長くして詳細度を高め、デフォルト設定に勝つように変更 */
.hatena-asin-detail .asin-detail-buy.shop-aliexpress { 
    background-color: ${config.aliexpressColor} !important; 
    color: #ffffff !important;
}

/* Sunstella（グレー） */
.hatena-asin-detail .asin-detail-buy.shop-sunstella { 
    background-color: ${config.sunstellaBgColor} !important;
    color: ${config.sunstellaTextColor} !important;
    border: 1px solid #ccc !important;
}
.hatena-asin-detail .asin-detail-buy.shop-sunstella:hover {
    background-color: #e0e0e0 !important;
    opacity: 1 !important;
}
`;
};
