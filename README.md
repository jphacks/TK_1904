# 製品概要
**レビュー x Tech（X → 今回皆さんが選定した好きな言葉に書き換えてください）**

## 課題（製品開発のきっかけ、課題等）

1. 傘の廃棄を減らせる
傘の年間廃棄量は1億本以上です。これだけで、レンタルで傘の消費量を減らすことの市場の大きさがわかります。また、傘は最終的に山や海へと流れるので、ただ廃棄されるだけではなく、それが環境破壊に直結します。なので、傘をレンタルすることによって不要な傘の消費をなくすことは、経済的・環境的に大きな影響を与えます。

2. 傘を持たなくて良い
東京という公共機関が発達した都市の中では、バスや電車で好きな場所にいけ、人々の足となっています。しかし雨の日の傘はそんなバスや電車を不快な空間にします。満員電車でズボンや靴に傘が当たって服を濡らしてしまった経験が皆さんあると思います。我々のプロダクトを使えば、駅に傘の濡れる部分はおいてきてくることが出来るので、自分も他人も傘のせいで服を濡らす心配もありません。
また、柄はしまえるので、これまで塞がっていた片手を自由に使えるようになります

3. 折りたたみ傘の耐久性が弱い
折りたたみ傘は、持ち運び可能な傘として人気ですが、あまり大きなものは作れない&折りたたみの機能上耐久性が低いという問題があります。この傘にすれば、より大きな傘を使うことも出来る上に結合部も一つなので、耐久性も高くなります。

## 特長
1. 徹底したユーザービリティ
- ユーザーは柄をポートに接続して傘を選ぶだけ。いかなるソフトウェア・アプリケーションも必要ない
- 決済・通知は全てLINEBotのみで行われる
- 返却する時は傘を傘立てに刺すだけ

2. 管理システムのセキュリティ性
- AWSのみで構築したサーバーレスアプリケーションなので、IOT領域で高いセキュリティを担保(IOTからIOTサーバーまでの通信以外は全てVPN)
- ユーザーのエラーアクションへの対応も考え、傘を選択したら他の傘を取得できないようにしたり、ユーザー認証して初めて傘を選択できるようにしている

3. 柄の持ち運びにより潔癖症の人も安心
- 柄は個人のものなのでレンタルはちょっとやだという潔癖症の人も安心

# 解決出来ること
傘の不法投棄数が減る
傘を持ち運ぶ必要がなくなる
電車内の傘による迷惑行為がなくなる

# 今後の展望
決済機能の追加
ハードウェア側の製品をより強化する

# 開発内容・開発技術
活用した技術
- AWS Iot
- AWS Lambda
- DynamoDB
- USB検知システム

# 独自開発技術（Hack Dayで開発したもの）
開発要件設計から全てこの二日間で作成した