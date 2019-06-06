const User = require('./models/User')
const axios = require('axios')

const clientID = '3672b8255f18495d5093'
const clientSecret = '7871e75f4f99c4fb23c68e645b8a76c7acc0b0d7'

export const oauth = async ctx => {
	const requestToken = ctx.request.query.code;
	console.log(requestToken)
	console.log(ctx.request)
	console.log('authorization code:', requestToken);

	const tokenResponse = await axios({
		method: 'post',
		url: 'https://github.com/login/oauth/access_token?' +
			`client_id=${clientID}&` +
			`client_secret=${clientSecret}&` +
			`code=${requestToken}`,
		headers: {
			accept: 'application/json'
		}
	});

	console.log(tokenResponse.data)

	const accessToken = tokenResponse.data.access_token;
	console.log(`access token: ${accessToken}`);

	const result = await axios({
		method: 'get',
		url: `https://api.github.com/user`,
		headers: {
			accept: 'application/json',
			Authorization: `token ${accessToken}`
		}
	});
	console.log(result.data);
	ctx.body = {data: result.data}
};

