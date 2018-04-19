# TypetalkDeck

[Typetalk](https://www.typetalk.com) client app like [TweetDeck](https://tweetdeck.twitter.com/).

## setup
### Add `secret.json` file.
This secret from Made application using Authorization Code.
[How to get it.](https://developer.nulab-inc.com/ja/docs/typetalk/#code)

```json
{
  "client_id": "OUR_CLIENT_ID",
  "client_secret": "OUR_CLIENT_SECRET"
}
```

### installation
```
npm i
```

## npm scripts
### start web view app (build & watch)
```
npm start
```

#### build web view app
```
npm run build
```

### start electron
```
npm run electron
```

### fix tslint
```
npm run tslint
```

### test (test & watch)
```
npm run test-watch
```

#### test
```
npm run test
```

### build installer
```
npm run pack
```
