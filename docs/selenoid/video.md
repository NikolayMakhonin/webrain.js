## Show video listing

http://selenoid:4444/video/

## Delete all videos

```
await Promise.all(Array.from(document.querySelectorAll('a'))
    .map(o => o.href)
    .filter(o => !/selenoid[^/]+$/.test(o))
    .map(o => fetch(o, { method: 'DELETE' })))
```
