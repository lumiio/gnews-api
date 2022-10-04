# Simple News API
To build:
- `npm install`
- `npm run start`

Available on localhost:3001.

## Endpoints:
### `GET /keywords`
Accepts Body: 
```
{
	keywords: ['some', 'keywords']		//keywords to search articles by, these are joined by AND
	max: 20		//max number of articles to return
}
```
Returns a list of articles given the keywords.

### `GET /title`
Accepts Body:
```
{
	title: 'article title'
}
```
Returns a list of articles matching the given title.

