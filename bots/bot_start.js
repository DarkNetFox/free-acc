const { VK, Keyboard } = require("vk-io");
const vk            = new VK();
const { updates }   = vk;

const baza = require("../db/users.json")
const games = require("../data/games_data.json")

const fs            = require("fs");
vk.setOptions({
  token: `e40078316a67396bd63e3c57757ce0bc1b096afc4a87aa7e359ae13a1e165b792c5eb5be03221660dafd2`,
  apiMode: "parallel"
});


updates.use(async (context, next) => {
  if (context.is("message") && context.isOutbox || context.senderId == undefined) {
    return;
  }
    if(context.messagePayload) {
      if(context.messagePayload.command == "getgame") {
        getgame(context)
      }
    }
try {
await next();
} catch (err) { console.error(err) }
});

async function getgame(context, game) {
  context.send(`Отлично! Мы обязательно отправим вам бесплатный аккаунт от ${games[context.messagePayload.game].name_2}.\n🤖 Подождите более 3 часов, сейчас наш модератор делает проверку вашего аккаунта на бота.`)
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
  let gr_id = await vk.api.groups.getById({
    token: "e40078316a67396bd63e3c57757ce0bc1b096afc4a87aa7e359ae13a1e165b792c5eb5be03221660dafd2"
  })
  console.log(gr_id)
  await vk.updates.startPolling();
  console.log("Рассылка работает!");
}
run()