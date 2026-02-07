# Blog Card Builder

Amazon / AliExpress / Sunstella 対応の、はてなブログ向け商品リンクカード作成 Chrome 拡張機能です。

ECサイトの商品ページから情報を自動取得し、ブログに貼り付けられる HTML/CSS コードを生成します。

## 主な機能

- **商品情報の自動取得** — 閲覧中のページからタイトル・画像・URLをスクレイピング
- **複数ECサイト対応** — Amazon、AliExpress、Sunstella のサイト別パーサーを搭載（未対応サイトは OGP フォールバック）
- **アフィリエイトリンク生成** — Amazon アソシエイトタグの付与、Sunstella アフィリエイトURL変換に対応
- **カードHTML/CSS生成** — はてなブログのデザインCSSに貼り付け可能なコードを出力
- **ショップボタンの色カスタマイズ** — 各ショップごとにボタンの色を設定可能
- **履歴管理** — 作成したカードを保存・再利用（最大50件）

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| 言語 | TypeScript (Strict) |
| UI | React 18 + Tailwind CSS 3 |
| ビルド | Vite 5 + CRXJS |
| バリデーション | Zod |
| アイコン | Lucide React |
| 拡張機能 | Chrome Manifest V3 |

## プロジェクト構成

```
src/
├── pages/sidepanel/     # サイドパネル UI（エントリーポイント）
├── components/
│   ├── tabs/            # Builder / History / Config タブ
│   └── ui/              # CardPreview, ShopList 等の共通UIコンポーネント
├── content/             # コンテンツスクリプト
│   └── parsers/         # サイト別データ抽出パーサー
├── background/          # Service Worker
├── hooks/               # カスタムフック（useScraper, useHistory, useConfig）
├── lib/                 # ユーティリティ（HTML/CSS生成、URL処理）
└── types/               # 型定義
```

## セットアップ

### 必要環境

- Node.js
- npm

### インストール

```bash
npm install
```

### 開発

```bash
npm run dev
```

開発サーバーが起動したら、Chrome で `chrome://extensions/` を開き、デベロッパーモードを有効にして `dist` フォルダを読み込んでください。

### ビルド

```bash
npm run build
```

`dist/` ディレクトリにビルド済みの拡張機能ファイルが出力されます。

### リント

```bash
npm run lint
```

## 使い方

1. Chrome に拡張機能をインストール
2. ツールバーのアイコンをクリックしてサイドパネルを開く
3. **Config タブ** でアフィリエイトIDやボタン色を設定
4. 商品ページを開いた状態で **Builder タブ** の「ページ情報を取得」を実行
5. 必要に応じてタイトルや画像URL、ショップリンクを編集
6. 生成された HTML / CSS をコピーして、はてなブログに貼り付け

## ライセンス

Private
