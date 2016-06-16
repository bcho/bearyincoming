# Beary Incoming

Incoming message builder for [BearyChat][bc].

[bc]: https://bearychat.com/


## Usage

### Build an incoming message

```javascript
const bearychat = require('bearyincoming');

bearychat
  .withText('hello, world')
  .build();
```

### Push to BearyChat

```javascript
bearychat
  .withTitle('Use the Source, Luke')
  .pushTo('https://hook.bearychat.com/blahblah');
```


## License

MIT
