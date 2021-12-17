//@ts-check
const request = require('request')
const express = require('express');
const port = 3000;
const app = express();

app.use(express.static('public'));
// Slack App の Client ID
const slack_client_id = process.env.SLACK_CLIENT_ID;
// Slack App の Client Secret
const slack_client_secret = process.env.SLACK_CLIENT_SECRET;
const slack_redirect_uri = process.env.REDIRECT_URI;
app.get('/home', (req, res) => {
    res.send(
        `<a href="https://slack.com/oauth/v2/authorize?scope=users%3Aread&amp;user_scope=users%3Aread&amp;redirect_uri=${slack_redirect_uri}&amp;client_id=${slack_client_id}" style="align-items:center;color:#000;background-color:#fff;border:1px solid #ddd;border-radius:4px;display:inline-flex;font-family:Lato, sans-serif;font-size:16px;font-weight:600;height:48px;justify-content:center;text-decoration:none;width:236px"><svg xmlns="http://www.w3.org/2000/svg" style="height:20px;width:20px;margin-right:12px" viewBox="0 0 122.8 122.8"><path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"></path><path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"></path><path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"></path><path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"></path></svg>Add to Slack</a>`
    );
});

app.get('/', (req, res) => {
    // 認可コードの取得
    const code = req.query["code"];
    // 認可コードを使って、アクセストークンをリクエストする
    request({
        url: "https://slack.com/api/oauth.v2.access",
        method: "POST",
        form: {
            client_id: slack_client_id,
            client_secret: slack_client_secret,
            code: code,
            redirect_uri: slack_redirect_uri
        }
    }, (error, response, body) => {
        // レスポンスからアクセストークンを取得する
        const param = JSON.parse(body);
        const access_token = param['authed_user']['access_token'];

        // ユーザIDを取得するためのリクエスト
        request("https://slack.com/api/auth.test",{
            method: "POST",
            form: {
                token: access_token
            }
        },(error, response, body) => {
            const user = JSON.parse(body);
            // アクセストークンを使ってユーザ情報をリクエスト
            res.send(user);
        })
    })
})


app.listen(port, () => console.log(`Listening on port ${port}!`))